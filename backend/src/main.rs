use anyhow::Result;
use backend::storage::blob::BlobStorageProvider;
use http::{Request as HttpRequest, Response as HttpResponse};
use proto::gen::evaluation_service_server::EvaluationServiceServer;
use proto::gen::flag_service_server::FlagServiceServer;
use proto::gen::metrics_service_server::MetricsServiceServer;
use std::sync::Arc;
use tokio::sync::Mutex;
use tonic::transport::Server;
use tower_http::classify::GrpcFailureClass;
use tower_http::trace::TraceLayer;
use tracing::info;

use backend::config::{Config, StorageProviderConfig};
use backend::metrics::prelude::InMemoryMetricsProvider;
use backend::routes::{AkashaEvaluationService, AkashaFlagService, AkashaMetricsService};
use backend::storage::{prelude::*, InMemoryStorage};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let config = Config::from_env()?;
    info!("loaded config: {:?}", config);

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

    info!("Akasha server listening on {}", addr);

    Server::builder()
        .layer(
            TraceLayer::new_for_grpc()
                .on_request(|request: &HttpRequest<_>, _span: &tracing::Span| {
                    tracing::info!("request: {:?}", request);
                })
                .on_response(
                    |response: &HttpResponse<_>,
                     latency: std::time::Duration,
                     _span: &tracing::Span| {
                        tracing::info!("response: {:?}, latency: {:?}", response, latency);
                    },
                )
                .on_failure(
                    |error: GrpcFailureClass,
                     latency: std::time::Duration,
                     _span: &tracing::Span| {
                        tracing::error!("error: {:?}, latency: {:?}", error, latency);
                    },
                ),
        )
        .add_service(flag_service)
        .add_service(evaluation_service)
        .add_service(metrics_service)
        .serve(addr)
        .await?;

    Ok(())
}
