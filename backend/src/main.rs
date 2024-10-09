// src/main.rs

use anyhow::Result;
use backend::storage::blob::BlobStorageProvider;
use proto::gen::evaluation_service_server::EvaluationServiceServer;
use proto::gen::flag_service_server::FlagServiceServer;
use proto::gen::metrics_service_server::MetricsServiceServer;
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::transport::Server;

use backend::config::{Config, StorageProviderConfig};
use backend::metrics::prelude::InMemoryMetricsProvider;
use backend::routes::{AkashaEvaluationService, AkashaFlagService, AkashaMetricsService};
use backend::storage::{prelude::*, InMemoryStorage};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config::from_env()?;
    println!("loaded config: {:?}", config);

    let addr = format!("0.0.0.0:{}", config.port).parse()?;

    let storage: Arc<dyn StorageProvider> = match config.storage {
        StorageProviderConfig::InMemory => Arc::new(InMemoryStorage::default()),
        StorageProviderConfig::AzureBlob(blob_storage_config) => Arc::new(
            BlobStorageProvider::new(
                blob_storage_config.storage_account,
                blob_storage_config.storage_container,
            )
            .await?,
        ),
    };

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
