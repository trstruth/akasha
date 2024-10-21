use std::borrow::Borrow;
use std::env;
use std::time::Duration;
use opentelemetry::trace::{TraceError, TracerProvider as _};
use opentelemetry::{global, KeyValue};
use opentelemetry_otlp::{ExportConfig, Protocol, WithExportConfig};
use opentelemetry_sdk::metrics::data::Temporality;
use opentelemetry_sdk::metrics::reader::TemporalitySelector;
use opentelemetry_sdk::metrics::InstrumentKind;
use opentelemetry_sdk::{runtime, trace as sdktrace, Resource};
use opentelemetry_semantic_conventions::resource::SERVICE_NAME;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::{EnvFilter, Layer};
use tracing_subscriber::util::SubscriberInitExt;

fn init_tracer() -> Result<(), Box<dyn std::error::Error>> {
    let geneva_tracing_endpoint = env::var("TRACES_ENDPOINT").expect("Unspecified traces endpoint");

    let tracer_provider = opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(
            // Export to geneva agent
            opentelemetry_otlp::new_exporter()
                .tonic()
                .with_endpoint(geneva_tracing_endpoint),
        )
        .with_trace_config(
            sdktrace::config()
                .with_resource(Resource::new(vec![KeyValue::new(SERVICE_NAME, "akasha")])),
        )
        .install_batch(runtime::Tokio)?;

    let tracer = tracer_provider.tracer("akasha");
    // // Send traces to monitoring agent

    let geneva_agent = tracing_opentelemetry::layer()
        .with_tracer(tracer)
        // Use RUST_LOG to filter
        .with_filter(EnvFilter::from_default_env());

    // Send traces to stdout
    let stdout_log = tracing_subscriber::fmt::layer()
        .pretty()
        // Use RUST_LOG to filter
        .with_filter(EnvFilter::from_default_env());

    tracing_subscriber::registry()
        .with(stdout_log)
        .with(geneva_agent)
        .init();

    Ok(())
}

fn init_meter() {
    let mdm_agent_endpoint =
        env::var("MDM_AGENT_ENDPOINT").expect("Unspecified MDM agent endpoint");
    let mdm_account = env::var("MDM_ACCOUNT").expect("Unspecified MDM account");
    let mdm_namespace = env::var("MDM_NAMESPACE").expect("Unspecified MDM namespace");

    let export_config = ExportConfig {
        endpoint: mdm_agent_endpoint,
        timeout: Duration::from_secs(3),
        protocol: Protocol::Grpc,
    };
    let exporter = opentelemetry_otlp::new_exporter()
        .tonic()
        .with_export_config(export_config);
    let meter = opentelemetry_otlp::new_pipeline()
        .metrics(runtime::Tokio)
        .with_temporality_selector(DeltaTemporalitySelector::new())
        .with_exporter(exporter)
        .with_resource(Resource::new(vec![
            KeyValue::new("_microsoft_metrics_account", mdm_account),
            KeyValue::new("_microsoft_metrics_namespace", mdm_namespace),
        ]))
        .build()
        .expect("Build meter provider");

    global::set_meter_provider(meter);
}

pub(crate) fn init_telemetry() -> OtelGuard {
    init_tracer();
    init_meter();
    OtelGuard {}
}

#[derive(Default)]
/// A temporality selector that returns Delta for all instruments except UpDownCounter and ObservableUpDownCounter.
/// This is the temporality supported by Geneva.
/// /// See https://eng.ms/docs/products/geneva/collect/metrics/mecollectotlp#configure-your-otlp-exporter
struct DeltaTemporalitySelector {}

impl DeltaTemporalitySelector {
    /// Create a new default temporality selector.
    fn new() -> Self {
        Self::default()
    }
}

impl TemporalitySelector for DeltaTemporalitySelector {
    fn temporality(&self, kind: InstrumentKind) -> Temporality {
        match kind {
            InstrumentKind::UpDownCounter => Temporality::Cumulative,
            InstrumentKind::ObservableUpDownCounter => Temporality::Cumulative,
            _ => Temporality::Delta,
        }
    }
}

pub struct OtelGuard {}

impl Drop for OtelGuard {
    fn drop(&mut self) {
        opentelemetry::global::shutdown_tracer_provider();
    }
}
