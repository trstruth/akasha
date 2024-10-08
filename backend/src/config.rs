use std::env;

use anyhow::{anyhow, Context, Result};

#[derive(Debug)]
pub struct Config {
    pub port: u16,
    pub storage: StorageProviderConfig,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let port = env::var("AKASHA_PORT")
            .unwrap_or("50051".to_string())
            .parse::<u16>()?;

        let storage_type = match env::var("AKASHA_STORAGE_TYPE") {
            Ok(s) => s,
            Err(_) => "in_memory".to_string(),
        };

        let storage_provider = match storage_type.to_lowercase().as_str() {
            "in_memory" => StorageProviderConfig::InMemory,
            "blob" => {
                let storage_account = env::var("AKASHA_STORAGE_BLOB_ACCOUNT").context(
                    "if using storage type blob, `AKASHA_STORAGE_BLOB_ACCOUNT` must be specified",
                )?;
                StorageProviderConfig::AzureBlob(AzureBlobStorageConfig { storage_account })
            }
            unknown_storage_type => {
                return Err(anyhow!(format!(
                    "Invalid storage type: {}",
                    unknown_storage_type
                )))
            }
        };

        Ok(Config {
            port,
            storage: storage_provider,
        })
    }
}

#[derive(Debug)]
pub enum StorageProviderConfig {
    InMemory,
    AzureBlob(AzureBlobStorageConfig),
}

#[derive(Debug)]
pub struct AzureBlobStorageConfig {
    pub storage_account: String,
}
