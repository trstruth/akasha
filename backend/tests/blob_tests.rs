// src/main.rs

use backend::storage::blob::BlobStorageProvider;
use backend::storage::prelude::StorageProvider;

use proto::gen::*;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_blob_connection() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string());

        assert!(storage.is_ok());
    }

    #[tokio::test]
    async fn test_get_bool_flag_not_present() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string());

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        let result = provider.get_bool_flag("39272hkdsa9809").await;

        assert!(result.is_ok());

        let option = result.unwrap();
        assert!(option.is_none());
    }

    #[tokio::test]
    async fn test_create_new_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string());

        assert!(storage.is_ok());

        let provider = storage.unwrap();

        let flag = BoolFlag {
            id: "39272hkdsa9809".to_string(),
            name: "test_flag".to_string(),
            enabled: true,
            default_value: false,
            targeting_rules: vec![],
        };
        let result = provider.create_bool_flag(flag).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_get_existing_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string());

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        let result = provider.get_bool_flag("39272hkdsa9809").await;

        assert!(result.is_ok());

        let option = result.unwrap();
        assert!(option.is_some());
    }

    #[tokio::test]
    async fn test_create_existing_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string());

        assert!(storage.is_ok());

        let provider = storage.unwrap();

        let flag = BoolFlag {
            id: "39272hkdsa9809".to_string(),
            name: "test_flag".to_string(),
            enabled: true,
            default_value: false,
            targeting_rules: vec![],
        };
        let result = provider.create_bool_flag(flag).await;

        assert!(result.is_err());
    }
}
