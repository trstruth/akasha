use anyhow::Result;
use proto::gen::metrics_service_server::MetricsService;
use proto::gen::*;
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::{Request, Response, Status};

use crate::metrics::prelude::{InMemoryMetricsProvider, VariantType};

#[derive(Debug)]
pub struct AkashaMetricsService {
    metrics: Arc<Mutex<InMemoryMetricsProvider>>,
}

impl AkashaMetricsService {
    pub fn new(metrics: Arc<Mutex<InMemoryMetricsProvider>>) -> Self {
        Self { metrics }
    }
}

#[tonic::async_trait]
impl MetricsService for AkashaMetricsService {
    async fn get_metrics(
        &self,
        request: Request<GetMetricsRequest>,
    ) -> Result<Response<GetMetricsResponse>, Status> {
        let flag_id = request.into_inner().flag_id;

        match self.metrics.lock().await.get_metrics(&flag_id).await {
            Some(metrics_data) => {
                let mut response = GetMetricsResponse {
                    total_queries: metrics_data.get_total_queries(),
                    true_count: 0,
                    false_count: 0,
                    variant_counts: Default::default(),
                };
                for (variant, count) in metrics_data.get_variants() {
                    match variant {
                        VariantType::BoolVariant(value) => {
                            if *value {
                                response.true_count = *count;
                            } else {
                                response.false_count = *count;
                            }
                        }
                        VariantType::StringVariant(value) => {
                            response.variant_counts.insert(value.clone(), *count);
                        }
                    }
                }

                Ok(Response::new(response))
            }
            None => Err(Status::not_found("Metrics not found for this flag.")),
        }
    }
}
