# Akasha Feature Flagging

## Introduction
**Akasha** is a lightweight, extensible feature flagging system designed to help developers manage and control the rollout of new features in their applications. It allows you to toggle features on and off without deploying new code, enabling continuous integration and deployment workflows.

This repository contains the complete implementation of Akasha, including:

-   A **Backend** server written in Rust using gRPC.
-   A **CLI** tool for managing/inspecting feature flags.
-   A **Frontend** web application built with React and TypeScript.

## User Story: Integrating Akasha with a Python Service

### Scenario

You have a Python service where you want to control the rollout of a new feature without redeploying your code. By integrating with Akasha, you can toggle the feature on or off remotely.

1. Create a Feature Flag Using the CLI
Create a new boolean feature flag called `new_feature` with an initial value of `false`:
```bash
akasha create-flag --flag-type "BOOL" --value "false" new_feature "should_enable_new_feature"
```
2. Update your python code to respect the flag:
```python
from akasha import AkashaClient

def main():
    # Create a client to the Akasha backend server
    client = AkashaClient('akasha.example.endpoint')

    # fetch the flag from akasha, providing a 
    # default value in case the fetch fails
    flag = client.get_flag('should_enable_new_feature', False)
        
    if flag.bool_value:
        print("New feature is enabled!")
        # Place the code for the new feature here
    else:
        print("New feature is disabled.")
        # default existing behavior here

if __name__ == "__main__":
    main()
```
3. Run the python script to see that the old version is running it should print "New feature is disabled"
4. Enable the feature flag:
```bash
akasha update-flag new_feature --value "true"
```
5. Running the python code again should result in the output "New feature is enabled!"

## Components

### Backend

The backend is a gRPC server implemented in Rust using the [`tonic`](https://github.com/hyperium/tonic) framework. It provides services for creating, updating, retrieving, and deleting feature flags, as well as querying metrics about flag usage.

**Key Features:**

-   **In-Memory Storage**: Uses an in-memory data store for simplicity, which can be replaced with a persistent storage solution.
-   **Asynchronous Execution**: Utilizes `tokio` for handling asynchronous operations.
-   **Metrics Tracking**: Collects metrics on flag usage, such as total queries and true/false counts.

### CLI
The CLI is a command-line tool written in Rust that allows users to interact with the backend server to manage feature flags. This is mostly useful for developers of akasha, to quickly hit the gRPC server and manually confirm behavior. Real flag management in production will generally happen via the frontend UI.

**Capabilities:**

-   **Create Flags**: Define new feature flags with specific types and initial values.
-   **Get Flag Details**: Retrieve information about existing flags.
-   **Update Flags**: Modify the properties of existing flags.
-   **Delete Flags**: Remove flags from the system.
-   **List Flags**: Display all flags with pagination support.
-   **Get Metrics**: Fetch usage metrics for specific flags.

**Usage Example:**
```bash
# Create a new flag
cargo run --bin cli -- create-flag --flag-type "BOOL" --value "true" my_flag "My Test Flag"

# Get flag details
cargo run --bin cli -- get-flag my_flag

# Update a flag
cargo run --bin cli -- update-flag my_flag --value "false"

# Delete a flag
cargo run --bin cli -- delete-flag my_flag

# List all flags
cargo run --bin cli -- list-flags

# Get metrics for a flag
cargo run --bin cli -- get-metrics my_flag`
```
### Frontend

The frontend is a web application built with React and TypeScript. It provides a user-friendly interface for managing feature flags.

**Features:**

-   **Create Flags**: Add new feature flags through a web form.
-   **View Flags**: Display a list of all feature flags.
-   **Update Flags**: Modify existing flags directly from the UI.
-   **Delete Flags**: Remove flags with a simple click.
-   **Real-Time Updates**: Communicates with the backend using gRPC-Web for efficient data transfer.
