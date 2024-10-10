use std::collections::HashMap;

use async_trait::async_trait;
use azure_core::{
    error::{ErrorKind, ResultExt},
    StatusCode,
};

use azure_storage_blobs::prelude::{BlobClient, BlobServiceClient, ContainerClient};
use futures::{StreamExt, TryStreamExt};

use proto::gen::*;
use serde::{Deserialize, Serialize};

use super::prelude::{StorageError, StorageProvider};
use anyhow::Result;

const STRING_FLAG_CONTAINER: &str = "string_flags";
const BOOL_FLAG_CONTAINER: &str = "bool_flags";
const METADATA_CONTAINER: &str = "admin";
const METADATA_BLOB: &str = "metadata";

#[derive(Deserialize, Serialize, PartialEq)]
enum FlagType {
    Bool,
    String,
}

impl From<&str> for FlagType {
    fn from(s: &str) -> Self {
        match s {
            "bool" => FlagType::Bool,
            "string" => FlagType::String,
            _ => panic!("Invalid flag type"),
        }
    }
}

impl From<String> for FlagType {
    fn from(s: String) -> Self {
        FlagType::from(s.as_str())
    }
}

#[derive(Deserialize, Serialize)]
struct Metadata {
    id: String,
    flag_type: FlagType,
}

#[derive(Debug)]
pub struct BlobStorageProvider {
    string_flag_container_client: ContainerClient,
    bool_flag_container_client: ContainerClient,
    metadata_blob_client: BlobClient,
}

impl BlobStorageProvider {
    pub async fn new(storage_account: String) -> Result<Self, StorageError> {
        let storage_credentials = azure_identity::create_credential().map_err(|e| {
            StorageError::DatabaseError(format!("failed to initialize empty admin metadata: {}", e))
        })?;

        let string_flag_container_client =
            BlobServiceClient::new(storage_account.clone(), storage_credentials.clone())
                .container_client(STRING_FLAG_CONTAINER);

        let bool_flag_container_client =
            BlobServiceClient::new(storage_account.clone(), storage_credentials.clone())
                .container_client(BOOL_FLAG_CONTAINER);

        let admin_container_client =
            BlobServiceClient::new(storage_account.clone(), storage_credentials.clone())
                .container_client(METADATA_CONTAINER);

        let metadata_blob_client = admin_container_client.blob_client(METADATA_BLOB);

        Ok(Self {
            string_flag_container_client,
            bool_flag_container_client,
            metadata_blob_client,
        })
    }

    async fn get_metadata(&self) -> Result<HashMap<String, Metadata>, StorageError> {
        let flag_names: HashMap<String, Metadata>;
        if let Err(e) = self.metadata_blob_client.get_properties().await {
            if let ErrorKind::HttpResponse {
                status: StatusCode::NotFound,
                ..
            } = e.kind()
            {
                flag_names = HashMap::new();
                Ok(flag_names)
            } else {
                Err(StorageError::DatabaseError(format!(
                    "Failed to get properties of blob: {}",
                    e
                )))
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
            Ok(flag_names)
        }
    }

    async fn remove_metadata_entry(&self, name: &str) -> Result<(), StorageError> {
        let mut flag_names = self.get_metadata().await?;
        if !flag_names.contains_key(name) {
            return Err(StorageError::NotFound);
        }

        flag_names.remove(name);

        let blob_data = serde_json::to_string(&flag_names).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;
        self.metadata_blob_client
            .put_block_blob(blob_data)
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to create empty admin metadata: {}", e))
            })?;

        Ok(())
    }

    async fn add_metadata_entry(
        &self,
        id: &str,
        name: &str,
        flag_type: FlagType,
    ) -> Result<(), StorageError> {
        let mut flag_names = self.get_metadata().await?;
        if flag_names.contains_key(name) {
            return Err(StorageError::AlreadyExists);
        }

        flag_names.insert(
            name.to_string(),
            Metadata {
                id: id.to_string(),
                flag_type,
            },
        );

        let blob_data = serde_json::to_string(&flag_names).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;
        self.metadata_blob_client
            .put_block_blob(blob_data)
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to create empty admin metadata: {}", e))
            })?;

        Ok(())
    }

    async fn name_exists(&self, name: &str) -> Result<bool, StorageError> {
        let flag_names = self.get_metadata().await?;

        Ok(flag_names.contains_key(name))
    }
}

#[async_trait]
impl StorageProvider for BlobStorageProvider {
    async fn get_bool_flag(&self, id: &str) -> Result<Option<BoolFlag>, StorageError> {
        let blob_client = self.bool_flag_container_client.blob_client(id);

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

        let blob_client = self.bool_flag_container_client.blob_client(flag.id.clone());

        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to serialize json: {}", e))
        })?;

        blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;

        self.add_metadata_entry(&flag.id, &flag.name, FlagType::Bool)
            .await?;

        Ok(())
    }

    async fn get_bool_flag_by_name(&self, name: &str) -> Result<Option<BoolFlag>, StorageError> {
        let blob_metadata = self.get_metadata().await?;
        if !blob_metadata.contains_key(name) {
            return Ok(None);
        }
        if blob_metadata[name].flag_type != FlagType::Bool {
            return Ok(None);
        }

        let id = &blob_metadata[name].id;

        self.get_bool_flag(id.as_str()).await
    }

    async fn update_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError> {
        let blob_client = self.bool_flag_container_client.blob_client(flag.id.clone());

        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;

        Ok(())
    }

    async fn delete_bool_flag(&self, id: &str) -> Result<bool, StorageError> {
        let blob_client = self.bool_flag_container_client.blob_client(id);

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

        blob_client.delete().await.map_err(|e| {
            StorageError::DatabaseError(format!("Failed to delete blob with error: {}", e))
        })?;

        self.remove_metadata_entry(&bool_flag.name).await?;

        Ok(true)
    }

    async fn list_bool_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<BoolFlag>, i32), StorageError> {
        let mut stream = self
            .bool_flag_container_client
            .list_blobs()
            .into_stream()
            .map_err(|e| {
                StorageError::DatabaseError(format!(
                    "Failed to write to get blob list from client: {}",
                    e
                ))
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

        let blob_client = self
            .string_flag_container_client
            .blob_client(flag.id.clone());

        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;

        self.add_metadata_entry(&flag.id, &flag.name, FlagType::String)
            .await?;

        Ok(())
    }

    async fn get_string_flag(&self, id: &str) -> Result<Option<StringFlag>, StorageError> {
        let blob_client = self.string_flag_container_client.blob_client(id);

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
        let blob_metadata = self.get_metadata().await?;
        if !blob_metadata.contains_key(name) {
            return Ok(None);
        }
        if blob_metadata[name].flag_type != FlagType::String {
            return Ok(None);
        }

        let id = &blob_metadata[name].id;

        self.get_string_flag(id.as_str()).await
    }

    async fn update_string_flag(&self, flag: StringFlag) -> Result<(), StorageError> {
        return self.create_string_flag(flag.clone()).await;
    }

    async fn delete_string_flag(&self, id: &str) -> Result<bool, StorageError> {
        let blob_client = self.string_flag_container_client.blob_client(id);

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

        blob_client.delete().await.map_err(|e| {
            StorageError::DatabaseError(format!("Failed to delete blob with error: {}", e))
        })?;

        self.remove_metadata_entry(&string_flag.name).await?;

        Ok(true)
    }

    async fn list_string_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<StringFlag>, i32), StorageError> {
        let mut stream = self
            .string_flag_container_client
            .list_blobs()
            .into_stream()
            .map_err(|e| {
                StorageError::DatabaseError(format!(
                    "Failed to write to get blob list from client: {}",
                    e
                ))
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
