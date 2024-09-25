use clap::{Parser, Subcommand};
use tonic::transport::Channel;

mod akasha {
    tonic::include_proto!("akasha");
}

use akasha::flag_service_client::FlagServiceClient;
use akasha::metrics_service_client::MetricsServiceClient;
use akasha::*;

#[derive(Parser)]
#[command(
    name = "Akasha CLI",
    version = "1.0",
    author = "Your Name",
    about = "CLI for Akasha Feature Flag Service"
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a new flag
    CreateFlag {
        /// Flag type: BOOL or STRING
        #[arg(long)]
        flag_type: String,
        /// Default value of the flag
        #[arg(long)]
        value: String,
        /// ID of the flag
        id: String,
        /// Name of the flag
        name: String,
    },
    /// Get flag details
    GetFlag {
        /// ID of the flag
        id: String,
    },
    /// Update a flag
    UpdateFlag {
        /// ID of the flag
        id: String,
        /// New default value of the flag
        #[arg(long)]
        value: String,
    },
    /// Delete a flag
    DeleteFlag {
        /// ID of the flag
        id: String,
    },
    /// List all flags
    ListFlags,
    /// Get metrics for a flag
    GetMetrics {
        /// ID of the flag
        id: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    // Connect to the Akasha backend server
    let channel = Channel::from_static("http://localhost:50051")
        .connect()
        .await?;

    match cli.command {
        Commands::CreateFlag {
            flag_type,
            value,
            id,
            name,
        } => {
            let mut client = FlagServiceClient::new(channel.clone());
            if flag_type.to_uppercase() == "BOOL" {
                let flag = BoolFlag {
                    id: id.clone(),
                    name,
                    enabled: true,
                    default_value: value.parse::<bool>().unwrap_or(false),
                    targeting_rules: vec![],
                };
                let request = tonic::Request::new(CreateBoolFlagRequest { flag: Some(flag) });
                let response = client.create_bool_flag(request).await?;
                println!("BoolFlag created: {:?}", response.into_inner().flag);
            } else if flag_type.to_uppercase() == "STRING" {
                let flag = StringFlag {
                    id: id.clone(),
                    name,
                    enabled: true,
                    default_value: value.clone(),
                    variants: vec![value.clone()],
                    targeting_rules: vec![],
                };
                let request = tonic::Request::new(CreateStringFlagRequest { flag: Some(flag) });
                let response = client.create_string_flag(request).await?;
                println!("StringFlag created: {:?}", response.into_inner().flag);
            } else {
                eprintln!("Invalid flag type. Use 'BOOL' or 'STRING'.");
            }
        }
        Commands::GetFlag { id } => {
            let mut client = FlagServiceClient::new(channel.clone());

            // Try to get BoolFlag
            let request = tonic::Request::new(GetBoolFlagRequest { id: id.clone() });
            match client.get_bool_flag(request).await {
                Ok(response) => {
                    println!("BoolFlag: {:?}", response.into_inner().flag);
                    return Ok(());
                }
                Err(_) => {
                    // If not found, try to get StringFlag
                }
            }

            let request = tonic::Request::new(GetStringFlagRequest { id: id.clone() });
            match client.get_string_flag(request).await {
                Ok(response) => {
                    println!("StringFlag: {:?}", response.into_inner().flag);
                }
                Err(e) => {
                    eprintln!("Flag not found: {}", e.message());
                }
            }
        }
        Commands::UpdateFlag { id, value } => {
            let mut client = FlagServiceClient::new(channel.clone());

            // Try to update BoolFlag
            let get_request = tonic::Request::new(GetBoolFlagRequest { id: id.clone() });
            match client.get_bool_flag(get_request).await {
                Ok(response) => {
                    let mut flag = response.into_inner().flag.unwrap();
                    flag.default_value = value.parse::<bool>().unwrap_or(flag.default_value);
                    flag.targeting_rules = vec![BoolTargetingRule {
                        variant: true,
                        conditions: vec![
                            Condition {
                                attribute: "user_id".to_string(),
                                operator: 0,
                                value: "123".to_string(),
                            },
                            Condition {
                                attribute: "country".to_string(),
                                operator: 0,
                                value: "US".to_string(),
                            },
                        ],
                    }];
                    let update_request =
                        tonic::Request::new(UpdateBoolFlagRequest { flag: Some(flag) });
                    let response = client.update_bool_flag(update_request).await?;
                    println!("BoolFlag updated: {:?}", response.into_inner().flag);
                    return Ok(());
                }
                Err(_) => {
                    // If not found, try to update StringFlag
                }
            }

            let get_request = tonic::Request::new(GetStringFlagRequest { id: id.clone() });
            match client.get_string_flag(get_request).await {
                Ok(response) => {
                    let mut flag = response.into_inner().flag.unwrap();
                    flag.default_value = value.clone();
                    if !flag.variants.contains(&value) {
                        flag.variants.push(value.clone());
                    }
                    let update_request =
                        tonic::Request::new(UpdateStringFlagRequest { flag: Some(flag) });
                    let response = client.update_string_flag(update_request).await?;
                    println!("StringFlag updated: {:?}", response.into_inner().flag);
                }
                Err(e) => {
                    eprintln!("Flag not found: {}", e.message());
                }
            }
        }
        Commands::DeleteFlag { id } => {
            let mut client = FlagServiceClient::new(channel.clone());
            let request = tonic::Request::new(DeleteFlagRequest { id });
            match client.delete_flag(request).await {
                Ok(response) => {
                    if response.into_inner().success {
                        println!("Flag deleted successfully.");
                    } else {
                        eprintln!("Failed to delete flag.");
                    }
                }
                Err(e) => {
                    eprintln!("Error deleting flag: {}", e.message());
                }
            }
        }
        Commands::ListFlags => {
            let mut client = FlagServiceClient::new(channel.clone());

            // List BoolFlags
            let request = tonic::Request::new(ListBoolFlagsRequest {
                page: 1,
                page_size: 100,
            });
            let response = client.list_bool_flags(request).await?;
            let bool_flags = response.into_inner().flags;
            println!("BoolFlags:");
            for flag in bool_flags {
                println!("{:?}", flag);
            }

            // List StringFlags
            let request = tonic::Request::new(ListStringFlagsRequest {
                page: 1,
                page_size: 100,
            });
            let response = client.list_string_flags(request).await?;
            let string_flags = response.into_inner().flags;
            println!("StringFlags:");
            for flag in string_flags {
                println!("{:?}", flag);
            }
        }
        Commands::GetMetrics { id } => {
            let mut client = MetricsServiceClient::new(channel.clone());
            let request = tonic::Request::new(GetMetricsRequest { flag_id: id });
            match client.get_metrics(request).await {
                Ok(response) => {
                    let metrics = response.into_inner();
                    println!("Metrics for flag:");
                    println!("Total Queries: {}", metrics.total_queries);
                    println!("True Count: {}", metrics.true_count);
                    println!("False Count: {}", metrics.false_count);
                    println!("Variant Counts:");
                    for (variant, count) in metrics.variant_counts {
                        println!("  {}: {}", variant, count);
                    }
                }
                Err(e) => {
                    eprintln!("Error fetching metrics: {}", e.message());
                }
            }
        }
    }

    Ok(())
}
