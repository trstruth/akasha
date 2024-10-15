use std::collections::HashMap;
use std::fmt::Debug;
use std::hash::Hash;
use async_trait::async_trait;

use tokio::sync::RwLock;

use crate::metrics::prelude::*;

#[derive(Debug)]
pub struct InMemoryMetricsProvider {
    flags: RwLock<HashMap<String, MetricsData>>,
}

impl InMemoryMetricsProvider {
    pub fn new() -> Self {
        Self {
            flags: RwLock::new(HashMap::new()),
        }
    }
}

#[async_trait]
impl MetricsProvider for InMemoryMetricsProvider {
    async fn get_metrics(&self, flag_id: &str) -> Option<MetricsData> {
        self.flags.read().await.get(flag_id).cloned()
    }

    async fn increment_variant(&mut self, flag_id: &str, variant: VariantType) {
        let mut flags_writer = self.flags.write().await;
        let data = flags_writer.entry(flag_id.to_string()).or_default();
        data.increment_variant(variant);
    }
}

impl Default for InMemoryMetricsProvider {
    fn default() -> Self {
        Self::new()
    }
}