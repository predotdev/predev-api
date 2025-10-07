# Pre.dev API Node.js Tests

This folder contains integration tests for the Pre.dev API Node.js client.

## Prerequisites

- Node.js 18+
- Doppler CLI installed and configured with your Pre.dev API key

## Setup

1. Make sure Doppler is configured with your `PREDEV_API_KEY`:
   ```bash
   doppler setup
   ```

2. Build the Node.js package:
   ```bash
   cd ../predev-api-node
   npm run build
   ```

3. Install dependencies in test folder:
   ```bash
   npm install
   ```

## Running Tests

### Run all tests
```bash
./run-tests.sh
```

### Run individual tests
```bash
# Synchronous fast spec test
doppler run -- node test-sync.js

# Asynchronous fast spec test with polling
doppler run -- node test-async.js
```

## Test Descriptions

### Sync Test (`test-sync.js`)
- Tests synchronous fast spec generation
- Generates a simple todo app specification
- Verifies the response structure and success status

### Async Test (`test-async.js`)
- Tests asynchronous fast spec generation
- Generates a weather dashboard specification
- Polls the API status in a while loop until completion
- Demonstrates proper async workflow with status checking

## Expected Output

Both tests should complete successfully and provide:
- Spec ID for tracking
- Status updates (pending → processing → completed)
- Execution time
- Output URL for viewing the generated specification

## Troubleshooting

- **API Key Issues**: Make sure Doppler is properly configured with `PREDEV_API_KEY`
- **Import Errors**: Ensure the Node.js package is built (`npm run build` in `../predev-api-node/`)
- **Network Issues**: Check your internet connection and API endpoint availability
