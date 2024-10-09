// src/storage/in_memory.rs

use async_trait::async_trait;
use proto::gen::*;
use std::collections::HashMap;
use tokio::sync::RwLock;

// Import the Storage trait and StorageError
use crate::storage::prelude::{StorageError, StorageProvider};

// Define InMemoryStorage
#[derive(Debug, Default)]
pub struct InMemoryStorage {
    // Private fields
    bool_flags: RwLock<HashMap<String, BoolFlag>>,
    string_flags: RwLock<HashMap<String, StringFlag>>,
}

#[async_trait]
impl StorageProvider for InMemoryStorage {
    // BoolFlag methods
    async fn create_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError> {
        let mut flags = self.bool_flags.write().await;
        if flags.contains_key(&flag.id) {
            Err(StorageError::AlreadyExists)
        } else {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        }
    }

    async fn get_bool_flag(&self, id: &str) -> Result<Option<BoolFlag>, StorageError> {
        let flags = self.bool_flags.read().await;
        Ok(flags.get(id).cloned())
    }

    async fn get_bool_flag_by_name(&self, name: &str) -> Result<Option<BoolFlag>, StorageError> {
        let flags = self.bool_flags.read().await;
        Ok(flags.values().find(|flag| flag.name == name).cloned())
    }

    async fn update_bool_flag(&self, flag: BoolFlag) -> Result<(), StorageError> {
        let mut flags = self.bool_flags.write().await;
        if flags.contains_key(&flag.id) {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        } else {
            Err(StorageError::NotFound)
        }
    }

    async fn delete_bool_flag(&self, id: &str) -> Result<bool, StorageError> {
        let mut flags = self.bool_flags.write().await;
        Ok(flags.remove(id).is_some())
    }

    async fn list_bool_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<BoolFlag>, i32), StorageError> {
        let flags = self.bool_flags.read().await;
        let flags_vec: Vec<BoolFlag> = flags.values().cloned().collect();
        let total_count = flags_vec.len() as i32;

        let start = page * page_size;
        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        Ok((flags_page, total_count))
    }

    // StringFlag methods
    async fn create_string_flag(&self, flag: StringFlag) -> Result<(), StorageError> {
        let mut flags = self.string_flags.write().await;
        if flags.contains_key(&flag.id) {
            Err(StorageError::AlreadyExists)
        } else {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        }
    }

    async fn get_string_flag(&self, id: &str) -> Result<Option<StringFlag>, StorageError> {
        let flags = self.string_flags.read().await;
        Ok(flags.get(id).cloned())
    }

    async fn get_string_flag_by_name(
        &self,
        name: &str,
    ) -> Result<Option<StringFlag>, StorageError> {
        let flags = self.string_flags.read().await;
        Ok(flags.values().find(|flag| flag.name == name).cloned())
    }

    async fn update_string_flag(&self, flag: StringFlag) -> Result<(), StorageError> {
        let mut flags = self.string_flags.write().await;
        if flags.contains_key(&flag.id) {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        } else {
            Err(StorageError::NotFound)
        }
    }

    async fn delete_string_flag(&self, id: &str) -> Result<bool, StorageError> {
        let mut flags = self.string_flags.write().await;
        Ok(flags.remove(id).is_some())
    }

    async fn list_string_flags(
        &self,
        page: usize,
        page_size: usize,
    ) -> Result<(Vec<StringFlag>, i32), StorageError> {
        let flags = self.string_flags.read().await;
        let flags_vec: Vec<StringFlag> = flags.values().cloned().collect();
        let total_count = flags_vec.len() as i32;

        let start = page * page_size;
        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        Ok((flags_page, total_count))
    }
}
