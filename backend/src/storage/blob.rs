use async_trait::async_trait;
use azure_core::{
    error::{ErrorKind, ResultExt},
    StatusCode,
};
use azure_storage_blobs::prelude::{BlobServiceClient, ContainerClient};
use futures::StreamExt;

use proto::gen::*;

use super::prelude::{StorageError, StorageProvider};
use anyhow::Result;

#[derive(Debug)]
pub struct BlobStorageProvider {
    container_client: ContainerClient,
}

impl BlobStorageProvider {
    pub fn new(storage_account: String, storage_container: String) -> Result<Self> {
        let storage_credentials = azure_identity::create_credential()?;
        let container_client = BlobServiceClient::new(storage_account.clone(), storage_credentials)
            .container_client(storage_container.clone());

        Ok(Self { container_client })
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
            println!("received {:?} bytes", data.len());
            complete_response.extend(&data);
        }

        let s_content = String::from_utf8(complete_response)
            .map_kind(ErrorKind::DataConversion)
            .map_err(|e| {
                StorageError::DatabaseError(format!("failed to convert to utf8: {}", e))
            })?;
        println!("s_content == {s_content}");

        let flag: BoolFlag = serde_json::from_str(&s_content).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        Ok(Some(flag))
    }

    async fn create_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError> {
        if self.get_bool_flag(&flag.id).await?.is_some() {
            return Err(StorageError::AlreadyExists);
        }

        let blob_client = self.container_client.blob_client(flag.id.clone());

        let flag_str = serde_json::to_string(&flag).map_err(|e| {
            StorageError::SerializationError(format!("failed to parse json: {}", e))
        })?;

        let res = blob_client
            .put_block_blob(flag_str.clone())
            .content_type("text/plain")
            .await
            .map_err(|e| {
                StorageError::DatabaseError(format!("Failed to write flag data to blob: {}", e))
            })?;

        println!("1-put_block_blob {res:?}");

        Ok(())
    }

    async fn get_bool_flag_by_name(&self, _name: &str) -> Result<Option<BoolFlag>, StorageError> {
        todo!()
    }
    async fn update_bool_flag(&self, _flag: BoolFlag) -> Result<(), StorageError> {
        todo!()
    }
    async fn delete_bool_flag(&self, _id: &str) -> Result<bool, StorageError> {
        todo!()
    }
    async fn list_bool_flags(
        &self,
        _page: usize,
        _page_size: usize,
    ) -> Result<(Vec<BoolFlag>, i32), StorageError> {
        todo!()
    }

    // StringFlag methods
    async fn create_string_flag(&self, _flag: StringFlag) -> Result<(), StorageError> {
        todo!()
    }
    async fn get_string_flag(&self, _id: &str) -> Result<Option<StringFlag>, StorageError> {
        todo!()
    }
    async fn get_string_flag_by_name(
        &self,
        _name: &str,
    ) -> Result<Option<StringFlag>, StorageError> {
        todo!()
    }
    async fn update_string_flag(&self, _flag: StringFlag) -> Result<(), StorageError> {
        todo!()
    }
    async fn delete_string_flag(&self, _id: &str) -> Result<bool, StorageError> {
        todo!()
    }
    async fn list_string_flags(
        &self,
        _page: usize,
        _page_size: usize,
    ) -> Result<(Vec<StringFlag>, i32), StorageError> {
        todo!()
    }
}
