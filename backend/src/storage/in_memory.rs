use proto::gen::*;
use std::collections::HashMap;
use tokio::sync::RwLock;

// Define InMemoryStorage
#[derive(Debug, Default)]
pub struct InMemoryStorage {
    bool_flags: RwLock<HashMap<String, BoolFlag>>,
    string_flags: RwLock<HashMap<String, StringFlag>>,
}
