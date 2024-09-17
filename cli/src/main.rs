mod akasha {
    tonic::include_proto!("akasha");
}

use akasha::flag_service_client::FlagServiceClient;
use akasha::metrics_service_client::MetricsServiceClient;
use akasha::*;
use anyhow::Result;
use clap::{Parser, Subcommand};
use tonic::transport::Channel;
use tonic::Request;

#[derive(Parser)]
#[command(
    name = "Akasha CLI",
    version,
    author,
    about = "CLI tool for Akasha Feature Flagging System"
)]
struct Cli {
    #[arg(short, long)]
    addr: Option<String>,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a new flag
    CreateFlag {
        /// Unique identifier for the flag
        id: String,
        /// Name of the flag
        name: String,
        /// Type of the flag: BOOL or STRING
        #[arg(short, long)]
        flag_type: String,
        /// Value of the flag (for BOOL, use true or false)
        #[arg(short, long)]
        value: String,
    },
    /// Get details of a flag
    GetFlag {
        /// ID of the flag
        id: String,
    },
    /// Update an existing flag
    UpdateFlag {
        /// ID of the flag
        id: String,
        /// New name of the flag
        #[arg(short, long)]
        name: Option<String>,
        /// New type of the flag: BOOL or STRING
        #[arg(short, long)]
        flag_type: Option<String>,
        /// New value of the flag
        #[arg(short, long)]
        value: Option<String>,
    },
    /// Delete a flag
    DeleteFlag {
        /// ID of the flag
        id: String,
    },
    /// List all flags
    ListFlags {
        /// Page number
        #[arg(short = 'p', long, default_value_t = 1)]
        page: i32,
        /// Page size
        #[arg(short = 's', long, default_value_t = 10)]
        page_size: i32,
    },
    /// Get metrics for a flag
    GetMetrics {
        /// ID of the flag
        flag_id: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    let addr = cli.addr.unwrap_or_else(|| "[::1]:50051".to_string());

    let channel = Channel::from_shared(addr)?.connect().await?;

    match &cli.command {
        Commands::CreateFlag {
            id,
            name,
            flag_type,
            value,
        } => {
            let mut client = FlagServiceClient::new(channel.clone());

            let flag_type_enum = match flag_type.to_uppercase().as_str() {
                "BOOL" => FlagType::Bool,
                "STRING" => FlagType::String,
                _ => {
                    eprintln!("Invalid flag type. Use 'BOOL' or 'STRING'.");
                    return Ok(());
                }
            };

            let flag = Flag {
                id: id.clone(),
                name: name.clone(),
                r#type: flag_type_enum as i32,
                bool_value: if flag_type_enum == FlagType::Bool {
                    value.parse::<bool>().unwrap_or(false)
                } else {
                    false
                },
                string_value: if flag_type_enum == FlagType::String {
                    value.clone()
                } else {
                    "".to_string()
                },
                targeting_rules: vec![],
            };

            let request = Request::new(CreateFlagRequest { flag: Some(flag) });

            let response = client.create_flag(request).await?;

            println!("Flag created: {:?}", response.into_inner().flag);
        }
        Commands::GetFlag { id } => {
            let mut client = FlagServiceClient::new(channel.clone());

            let request = Request::new(GetFlagRequest { id: id.clone() });

            let response = client.get_flag(request).await?;

            println!("Flag details: {:?}", response.into_inner().flag);
        }
        Commands::UpdateFlag {
            id,
            name,
            flag_type,
            value,
        } => {
            let mut client = FlagServiceClient::new(channel.clone());

            // Get the existing flag
            let get_request = Request::new(GetFlagRequest { id: id.clone() });
            let get_response = client.get_flag(get_request).await?;
            let mut flag = get_response.into_inner().flag.unwrap();

            // Update fields if provided
            if let Some(new_name) = name {
                flag.name = new_name.clone();
            }
            if let Some(new_flag_type) = flag_type {
                flag.r#type = match new_flag_type.to_uppercase().as_str() {
                    "BOOL" => FlagType::Bool as i32,
                    "STRING" => FlagType::String as i32,
                    _ => {
                        eprintln!("Invalid flag type. Use 'BOOL' or 'STRING'.");
                        return Ok(());
                    }
                };
            }
            if let Some(new_value) = value {
                if let Some(flag_type_enum) = FlagType::from_i32(flag.r#type) {
                    match flag_type_enum {
                        FlagType::Bool => {
                            flag.bool_value = new_value.parse::<bool>().unwrap_or(false);
                        }
                        FlagType::String => {
                            flag.string_value = new_value.clone();
                        }
                    }
                } else {
                    eprintln!("Invalid flag type in existing flag.");
                    return Ok(());
                }
            }

            let update_request = Request::new(UpdateFlagRequest { flag: Some(flag) });

            let response = client.update_flag(update_request).await?;

            println!("Flag updated: {:?}", response.into_inner().flag);
        }
        Commands::DeleteFlag { id } => {
            let mut client = FlagServiceClient::new(channel.clone());

            let request = Request::new(DeleteFlagRequest { id: id.clone() });

            let response = client.delete_flag(request).await?;

            if response.into_inner().success {
                println!("Flag deleted successfully.");
            } else {
                println!("Failed to delete flag.");
            }
        }
        Commands::ListFlags { page, page_size } => {
            let mut client = FlagServiceClient::new(channel.clone());

            let request = Request::new(ListFlagsRequest {
                page: *page,
                page_size: *page_size,
            });

            let response = client.list_flags(request).await?;

            let flags = response.into_inner().flags;
            for flag in flags {
                println!("{:?}", flag);
            }
        }
        Commands::GetMetrics { flag_id } => {
            let mut client = MetricsServiceClient::new(channel.clone());

            let request = Request::new(GetMetricsRequest {
                flag_id: flag_id.clone(),
            });

            let response = client.get_metrics(request).await?;

            println!("Metrics: {:?}", response.into_inner());
        }
    }

    Ok(())
}
