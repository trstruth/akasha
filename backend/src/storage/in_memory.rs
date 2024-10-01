// src/storage/in_memory.rs

use proto::gen::*;
use std::collections::HashMap;
use tokio::sync::RwLock;

// Define InMemoryStorage
#[derive(Debug, Default)]
pub struct InMemoryStorage {
    // Private fields
    bool_flags: RwLock<HashMap<String, BoolFlag>>,
    string_flags: RwLock<HashMap<String, StringFlag>>,
}

// Implement methods for InMemoryStorage
impl InMemoryStorage {
    // BoolFlag methods
    pub async fn create_bool_flag(&self, flag: BoolFlag) -> Result<(), String> {
        let mut flags = self.bool_flags.write().await;
        if flags.contains_key(&flag.id) {
            Err("BoolFlag with this ID already exists.".to_string())
        } else {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        }
    }

    pub async fn get_bool_flag(&self, id: &str) -> Option<BoolFlag> {
        let flags = self.bool_flags.read().await;
        flags.get(id).cloned()
    }

    pub async fn get_bool_flag_by_name(&self, name: &str) -> Option<BoolFlag> {
        let flags = self.bool_flags.read().await;
        flags.values().find(|flag| flag.name == name).cloned()
    }

    pub async fn update_bool_flag(&self, flag: BoolFlag) -> Result<(), String> {
        let mut flags = self.bool_flags.write().await;
        if flags.contains_key(&flag.id) {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        } else {
            Err("BoolFlag not found.".to_string())
        }
    }

    pub async fn delete_bool_flag(&self, id: &str) -> bool {
        let mut flags = self.bool_flags.write().await;
        flags.remove(id).is_some()
    }

    pub async fn list_bool_flags(&self, page: usize, page_size: usize) -> (Vec<BoolFlag>, i32) {
        let flags = self.bool_flags.read().await;
        let flags_vec: Vec<BoolFlag> = flags.values().cloned().collect();
        let total_count = flags_vec.len() as i32;

        let start = page * page_size;
        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        (flags_page, total_count)
    }

    // StringFlag methods
    pub async fn create_string_flag(&self, flag: StringFlag) -> Result<(), String> {
        let mut flags = self.string_flags.write().await;
        if flags.contains_key(&flag.id) {
            Err("StringFlag with this ID already exists.".to_string())
        } else {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        }
    }

    pub async fn get_string_flag(&self, id: &str) -> Option<StringFlag> {
        let flags = self.string_flags.read().await;
        flags.get(id).cloned()
    }

    pub async fn get_string_flag_by_name(&self, name: &str) -> Option<StringFlag> {
        let flags = self.string_flags.read().await;
        flags.values().find(|flag| flag.name == name).cloned()
    }

    pub async fn update_string_flag(&self, flag: StringFlag) -> Result<(), String> {
        let mut flags = self.string_flags.write().await;
        if flags.contains_key(&flag.id) {
            flags.insert(flag.id.clone(), flag);
            Ok(())
        } else {
            Err("StringFlag not found.".to_string())
        }
    }

    pub async fn delete_string_flag(&self, id: &str) -> bool {
        let mut flags = self.string_flags.write().await;
        flags.remove(id).is_some()
    }

    pub async fn list_string_flags(&self, page: usize, page_size: usize) -> (Vec<StringFlag>, i32) {
        let flags = self.string_flags.read().await;
        let flags_vec: Vec<StringFlag> = flags.values().cloned().collect();
        let total_count = flags_vec.len() as i32;

        let start = page * page_size;
        let flags_page = flags_vec.into_iter().skip(start).take(page_size).collect();

        (flags_page, total_count)
    }
}
