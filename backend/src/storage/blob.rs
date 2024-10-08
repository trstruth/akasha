use std::collections::HashMap;

use async_trait::async_trait;
use azure_core::{
    error::{ErrorKind, ResultExt},
    StatusCode,
};
use azure_storage_blobs::prelude::{BlobServiceClient, ContainerClient, BlobClient};
use futures::{StreamExt, TryStreamExt};

use proto::gen::*;

use super::prelude::{StorageError, StorageProvider};
use anyhow::Result;

#[derive(Debug)]
pub struct BlobStorageProvider {
    container_client: ContainerClient,
    metadata_blob_client: BlobClient
}

impl BlobStorageProvider {
    pub async fn new(storage_account: String, storage_container: String) -> Result<Self, StorageError> {
        let storage_credentials = azure_identity::create_credential().map_err(|e| {
            StorageError::DatabaseError(format!("failed to initialize empty admin metadata: {}", e))
        })?;

        let container_client = BlobServiceClient::new(storage_account.clone(), storage_credentials.clone())
            .container_client(storage_container.clone());
        
        let admin_container_client = BlobServiceClient::new(storage_account.clone(), storage_credentials.clone())
        .container_client("admin");

        let metadata_blob_client = admin_container_client.blob_client("metadata");
        
        Ok(Self { 
            container_client,
            metadata_blob_client
        })
    }

    async fn get_metadata(&self) -> Result<HashMap<String, String>, StorageError> {
        let flag_names: HashMap<String, String>;
        if let Err(e) = self.metadata_blob_client.get_properties().await {
            if let ErrorKind::HttpResponse {
                status: StatusCode::NotFound,
                ..
            } = e.kind()
            {            
                flag_names = HashMap::new();
                return Ok(flag_names);
            } else {
                return Err(StorageError::DatabaseError(format!(
                    "Failed to get properties of blob: {}",
                    e
                )));
            }
        } else {
            let blob_content = self.metadata_blob_client.get_content().await.map_err(|e| {
                StorageError::DatabaseError(format!("Failed to create empty admin metadata: {}", e))
            })?;
            let s_content = String::from_utf8(blob_content)
            .map_kind(ErrorKind::DataConversion)
            .map_err(|e| {
                StorageError::DatabaseError(format!("failed to convert to utf8: {}", e))
            })?;
            flag_names = serde_json::from_str(&s_content).map_err(|e| {
                StorageError::SerializationError(format!("failed to parse json: {}", e))
            })?;
            return Ok(flag_names);
        }
    }

    async fn remove_metadata_entry(&self, name: &str) -> Result<(), StorageError> {
        let mut flag_names = self.get_metadata().await?;
        if !flag_names.contains_key(name) {
            return Err(StorageError::NotFound)
        }

        flag_names.remove(name);

        let blob_data = serde_json::to_string(&flag_names).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;
        self.metadata_blob_client.put_block_blob(blob_data).content_type("text/plain").await.map_err(|e| {
            StorageError::DatabaseError(format!("Failed to create empty admin metadata: {}", e))
        })?;
        
        Ok(())
    }

    async fn add_metadata_entry(&self, id: &str, name: &str) -> Result<(), StorageError> {
        let mut flag_names = self.get_metadata().await?;
        if flag_names.contains_key(name) {
            return Err(StorageError::AlreadyExists);
        }

        flag_names.insert(name.to_string(), id.to_string());

        let blob_data = serde_json::to_string(&flag_names).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;
        self.metadata_blob_client.put_block_blob(blob_data).content_type("text/plain").await.map_err(|e| {
            StorageError::DatabaseError(format!("Failed to create empty admin metadata: {}", e))
        })?;

        return Ok(());
    }

    async fn name_exists(&self, name: &str) -> Result<bool, StorageError> {
        let flag_names = self.get_metadata().await?;
        
        return Ok(flag_names.contains_key(name));
    }
}

#[async_trait]
impl StorageProvider for BlobStorageProvider {
    async fn get_bool_flag(&self, id: &str) -> Result<Option<BoolFlag>, StorageError> {
        let blob_client = self.container_client.blob_client(id);

        if let Err(e) = blob_client.get_properties().await {
            if let ErrorKind::HttpResponse {
                status: StatusCode::NotFound,
                ..
            } = e.kind()
            {
                return Ok(None);
            } else {
                return Err(StorageError::DatabaseError(format!(
                    "Failed to get properties of blob: {}",
                    e
                )));
            }
        }

        let mut complete_response = vec![];
        // this is how you stream a blob. You can specify the range(...) value as above if necessary.
        // In this case we are retrieving the whole blob in 8KB chunks.
        let mut stream = blob_client.get().chunk_size(0x2000u64).into_stream();
        while let Some(value) = stream.next().await {
            let data = value
                .map_err(|e| StorageError::DatabaseError(format!("failed to read stream: {}", e)))?
                .data
                .collect()
                .await
                .map_err(|e| {
                    StorageError::DatabaseError(format!("failed to collect stream: {}", e))
                })?;
            complete_response.extend(&data);
        }

        let s_content = String::from_utf8(complete_response)
            .map_kind(ErrorKind::DataConversion)
            .map_err(|e| {
                StorageError::DatabaseError(format!("failed to convert to utf8: {}", e))
            })?;

        let flag: BoolFlag = serde_json::from_str(&s_content).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        Ok(Some(flag))
    }

    async fn create_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError> {
        if self.get_bool_flag(&flag.id).await?.is_some() {
            return Err(StorageError::AlreadyExists);
        }
        if self.name_exists(&flag.name).await? {
            return Err(StorageError::AlreadyExists);
        }

        let blob_client = self.container_client.blob_client(flag.id.clone());
        
        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to serialize json: {}", e))
        })?;

        let _res = blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;
        
        self.add_metadata_entry(&flag.id, &flag.name).await?;

        Ok(())
    }

    async fn get_bool_flag_by_name(&self, name: &str) -> Result<Option<BoolFlag>, StorageError> {
        let mut blob_list = self.container_client.list_blobs().into_stream().map_err(|e| {
            StorageError::DatabaseError(format!("Failed to write to get blob list from client: {}", e))
        });

        while let Some(result) = blob_list.next().await {
            let res = result?;
            for blob in res.blobs.blobs() {
                let bool_flag = self.get_bool_flag(&blob.name).await?.unwrap();
                if bool_flag.name == name {
                    return Ok(Some(bool_flag))
                }
            }
        }
        return Ok(None); 
    }

    async fn update_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError> {
        let blob_client = self.container_client.blob_client(flag.id.clone());

        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        let _res = blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;

        Ok(())
    }

    async fn delete_bool_flag(&self, id: &str) -> Result<bool, StorageError> {
        let blob_client = self.container_client.blob_client(id);

        if let Err(e) = blob_client.get_properties().await {
            if let ErrorKind::HttpResponse {
                status: StatusCode::NotFound,
                ..
            } = e.kind()
            {
                return Ok(false);
            } else {
                return Err(StorageError::DatabaseError(format!(
                    "Failed to get properties of blob: {}",
                    e
                )));
            }
        }
        
        let bool_flag = self.get_bool_flag(id).await?.unwrap();

        let _res = blob_client.delete().await.map_err(|e| {
            StorageError::DatabaseError(format!("Failed to delete blob with error: {}", e))
        });

        self.remove_metadata_entry(&bool_flag.name).await?;

        Ok(true)
    }

    async fn list_bool_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<BoolFlag>, i32), StorageError> {
        let mut stream = self.container_client.list_blobs().into_stream().map_err(|e| {
            StorageError::DatabaseError(format!("Failed to write to get blob list from client: {}", e))
        });

        let mut flags_vec = vec![];
        let mut count = 0;
        while let Some(result) = stream.next().await {
            let res = result?;
            for blob in res.blobs.blobs() {
                match self.get_bool_flag(&blob.name).await {
                    Ok(Some(flag)) => {
                        flags_vec.push(flag);
                        count += 1;
                    }
                    Ok(None) => {
                        continue;
                    }
                    Err(e) => {
                        return Err(e);
                    }
                }
            }
        }

        let start = page * page_size;
        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        return Ok((flags_page, count));
    }

    // StringFlag methods
    async fn create_string_flag(&self, flag: StringFlag) -> Result<(), StorageError> {
        if self.get_string_flag(&flag.id).await?.is_some() {
            return Err(StorageError::AlreadyExists);
        }

        if self.name_exists(&flag.name).await? {
            return Err(StorageError::AlreadyExists);
        }

        let blob_client = self.container_client.blob_client(flag.id.clone());

        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        let _res = blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;

        self.add_metadata_entry(&flag.id, &flag.name).await?;

        Ok(())
    }

    async fn get_string_flag(&self, id: &str) -> Result<Option<StringFlag>, StorageError> {
        let blob_client = self.container_client.blob_client(id);

        if let Err(e) = blob_client.get_properties().await {
            if let ErrorKind::HttpResponse {
                status: StatusCode::NotFound,
                ..
            } = e.kind()
            {
                return Ok(None);
            } else {
                return Err(StorageError::DatabaseError(format!(
                    "Failed to get properties of blob: {}",
                    e
                )));
            }
        }

        let mut complete_response = vec![];
        // this is how you stream a blob. You can specify the range(...) value as above if necessary.
        // In this case we are retrieving the whole blob in 8KB chunks.
        let mut stream = blob_client.get().chunk_size(0x2000u64).into_stream();
        while let Some(value) = stream.next().await {
            let data = value
                .map_err(|e| StorageError::DatabaseError(format!("failed to read stream: {}", e)))?
                .data
                .collect()
                .await
                .map_err(|e| {
                    StorageError::DatabaseError(format!("failed to collect stream: {}", e))
                })?;
            complete_response.extend(&data);
        }

        let s_content = String::from_utf8(complete_response)
            .map_kind(ErrorKind::DataConversion)
            .map_err(|e| {
                StorageError::DatabaseError(format!("failed to convert to utf8: {}", e))
            })?;

        let flag: StringFlag = serde_json::from_str(&s_content).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        Ok(Some(flag))
    }

    async fn get_string_flag_by_name(
        &self,
        name: &str,
    ) -> Result<Option<StringFlag>, StorageError> {
        let mut blob_list = self.container_client.list_blobs().into_stream().map_err(|e| {
            StorageError::DatabaseError(format!("Failed to write to get blob list from client: {}", e))
        });

        while let Some(result) = blob_list.next().await {
            let res = result?;
            for blob in res.blobs.blobs() {
                let string_flag = self.get_string_flag(&blob.name).await?.unwrap();
                if string_flag.name == name {
                    return Ok(Some(string_flag))
                }
            }
        }
        return Ok(None); 
    }

    async fn update_string_flag(&self, flag: StringFlag) -> Result<(), StorageError> {
        return self.create_string_flag(flag.clone()).await;
    }

    async fn delete_string_flag(&self, id: &str) -> Result<bool, StorageError> {
        let blob_client = self.container_client.blob_client(id);

        if let Err(e) = blob_client.get_properties().await {
            if let ErrorKind::HttpResponse {
                status: StatusCode::NotFound,
                ..
            } = e.kind()
            {
                return Ok(false);
            } else {
                return Err(StorageError::DatabaseError(format!(
                    "Failed to get properties of blob: {}",
                    e
                )));
            }
        }
        
        let string_flag = self.get_string_flag(id).await?.unwrap();

        let _res = blob_client.delete().await.map_err(|e| {
            StorageError::DatabaseError(format!("Failed to delete blob with error: {}", e))
        });
        
        self.remove_metadata_entry(&string_flag.name).await?;

        Ok(true)
    }

    async fn list_string_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<StringFlag>, i32), StorageError> {
        let mut stream = self.container_client.list_blobs().into_stream().map_err(|e| {
            StorageError::DatabaseError(format!("Failed to write to get blob list from client: {}", e))
        });

        let mut flags_vec = vec![];
        let mut count = 0;
        while let Some(result) = stream.next().await {
            let res = result?;
            for blob in res.blobs.blobs() {
                match self.get_string_flag(&blob.name).await {
                    Ok(Some(flag)) => {
                        flags_vec.push(flag);
                        count += 1;
                    }
                    Ok(None) => {
                        continue;
                    }
                    Err(e) => {
                        return Err(e);
                    }
                }
            }
        }

        let start = page * page_size;
        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        return Ok((flags_page, count));
    }
}
