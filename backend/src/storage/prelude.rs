use async_trait::async_trait;
use proto::gen::*;
use std::fmt::Debug;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StorageError {
    #[error("Resource not found")]
    NotFound,
    #[error("Resource already exists")]
    AlreadyExists,
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Serialization error: {0}")]
    SerializationError(String),
    #[error("Other error: {0}")]
    Other(String),
}

impl From<StorageError> for tonic::Status {
    fn from(value: StorageError) -> Self {
        match value {
            StorageError::NotFound => tonic::Status::not_found("Resource not found"),
            StorageError::AlreadyExists => tonic::Status::already_exists("Resource already exists"),
            StorageError::DatabaseError(msg) => tonic::Status::internal(msg),
            StorageError::SerializationError(msg) => tonic::Status::internal(msg),
            StorageError::Other(msg) => tonic::Status::internal(msg),
        }
    }
}

impl From<serde_json::Error> for StorageError {
    fn from(value: serde_json::Error) -> Self {
        StorageError::SerializationError(format!("{}", value))
    }
}

#[async_trait]
pub trait StorageProvider: Send + Sync + Debug {
    // BoolFlag methods
    async fn create_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError>;
    async fn get_bool_flag(&self, id: &str) -> Result<Option<BoolFlag>, StorageError>;
    async fn get_bool_flag_by_name(&self, name: &str) -> Result<Option<BoolFlag>, StorageError>;
    async fn update_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError>;
    async fn delete_bool_flag(&self, id: &str) -> Result<bool, StorageError>;
    async fn list_bool_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<BoolFlag>, i32), StorageError>;

    // StringFlag methods
    async fn create_string_flag(&self, flag: StringFlag) -> Result<(), StorageError>;
    async fn get_string_flag(&self, id: &str) -> Result<Option<StringFlag>, StorageError>;
    async fn get_string_flag_by_name(&self, name: &str)
        -> Result<Option<StringFlag>, StorageError>;
    async fn update_string_flag(&self, flag: StringFlag) -> Result<(), StorageError>;
    async fn delete_string_flag(&self, id: &str) -> Result<bool, StorageError>;
    async fn list_string_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<StringFlag>, i32), StorageError>;
}
