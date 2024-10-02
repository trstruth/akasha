// src/main.rs

use anyhow::Result;
use proto::gen::evaluation_service_server::EvaluationServiceServer;
use proto::gen::flag_service_server::FlagServiceServer;
use proto::gen::metrics_service_server::MetricsServiceServer;
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::transport::Server;

use backend::metrics::prelude::InMemoryMetricsProvider;
use backend::routes::{AkashaEvaluationService, AkashaFlagService, AkashaMetricsService};
use backend::storage::{prelude::*, InMemoryStorage};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;
    let storage: Arc<dyn StorageProvider> = Arc::new(InMemoryStorage::default());
    let metrics = Arc::new(Mutex::new(InMemoryMetricsProvider::default()));

    let flag_service = FlagServiceServer::new(AkashaFlagService::new(Arc::clone(&storage)));

    let evaluation_service = EvaluationServiceServer::new(AkashaEvaluationService::new(
        Arc::clone(&storage),
        metrics.clone(),
    ));

    let metrics_service = MetricsServiceServer::new(AkashaMetricsService::new(metrics.clone()));

    println!("Akasha server listening on {}", addr);

    Server::builder()
        .add_service(flag_service)
        .add_service(evaluation_service)
        .add_service(metrics_service)
        .serve(addr)
        .await?;

    Ok(())
}
