// src/main.rs

use backend::storage::blob::BlobStorageProvider;
use backend::storage::prelude::StorageProvider;

use proto::gen::*;

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_blob_connection() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());
    }

    #[tokio::test]
    async fn test_get_bool_flag_not_present() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        let result = provider.get_bool_flag("39272hkdsa9809").await;

        assert!(result.is_ok());

        let option = result.unwrap();
        assert!(option.is_none());
    }

    #[tokio::test]
    async fn test_create_new_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

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

        // if let Err(e) = result {
        //     println!("{}", e);
        // }
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_get_existing_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        let result = provider.get_bool_flag("39272hkdsa9809").await;

        assert!(result.is_ok());

        let option = result.unwrap();
        assert!(option.is_some());
    }

    #[tokio::test]
    async fn test_create_existing_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

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

    #[tokio::test]
    async fn test_list_existing_bool_flags() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());

        let provider = storage.unwrap();

        let result = provider.list_bool_flags(0, 1).await;

        assert!(result.is_ok());

        let data = result.unwrap();

        assert!(data.1 == 1);
        for flag in data.0 {
            println!("flag id = {}", flag.id);
        }
    }

    #[tokio::test]
    async fn test_update_existing_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        let flag = BoolFlag {
            id: "39272hkdsa9809".to_string(),
            name: "test_flag".to_string(),
            enabled: false,
            default_value: false,
            targeting_rules: vec![],
        };
        let result = provider.update_bool_flag(flag).await;

        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_delete_existing_bool_flag() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        
        let result = provider.delete_bool_flag("39272hkdsa9809").await;

        // if let Err(e) = result {
        //     println!("{}", e)
        // }
        assert!(result.is_ok());

        let success = result.unwrap();
        assert!(success);
    }

    #[tokio::test]
    async fn test_create_flag_same_name() {
        let storage = BlobStorageProvider::new("akashadev".to_string(), "flags".to_string()).await;

        assert!(storage.is_ok());

        let provider = storage.unwrap();
        
        let flag = BoolFlag {
            id: "dhsahdksakd".to_string(),
            name: "test_flag".to_string(),
            enabled: false,
            default_value: false,
            targeting_rules: vec![],
        };
        
        let result = provider.create_bool_flag(flag).await;

        if let Err(e) = result {
            println!("{}", e);
        }
        // assert!(result.is_err());
    }

}
