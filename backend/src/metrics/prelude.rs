use std::collections::HashMap;
use std::fmt::Debug;
use std::hash::Hash;
use async_trait::async_trait;

use tokio::sync::RwLock;

#[derive(Debug, Default, Clone)]
pub struct MetricsData {
    total_queries: i64,
    variant_counts: HashMap<VariantType, i64>,
}

impl MetricsData {
    pub fn new() -> Self {
        Self {
            total_queries: 0,
            variant_counts: HashMap::new(),
        }
    }

    pub fn increment_variant(&mut self, variant: VariantType) {
        self.total_queries += 1;

        let count = self.variant_counts.entry(variant).or_insert(0);
        *count += 1;
    }

    pub fn get_total_queries(&self) -> i64 {
        self.total_queries
    }

    pub fn get_variants(&self) -> &HashMap<VariantType, i64> {
        &self.variant_counts
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum VariantType {
    BoolVariant(bool),
    StringVariant(String),
}

impl From<VariantType> for String {
    fn from(val: VariantType) -> Self {
        match val {
            VariantType::BoolVariant(value) => value.to_string(),
            VariantType::StringVariant(value) => value,
        }
    }
}

impl From<bool> for VariantType {
    fn from(value: bool) -> Self {
        VariantType::BoolVariant(value)
    }
}

impl From<String> for VariantType {
    fn from(value: String) -> Self {
        VariantType::StringVariant(value)
    }
}

impl From<&str> for VariantType {
    fn from(value: &str) -> Self {
        VariantType::StringVariant(value.to_string())
    }
}

#[async_trait]
pub trait MetricsProvider: Send + Sync + Debug {
    async fn get_metrics(&self, flag_id: &str) -> Option<MetricsData>;
    async fn increment_variant(&mut self, flag_id: &str, variant: VariantType);
}
