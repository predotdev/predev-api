# Pre.dev API - Node.js/TypeScript Client

A TypeScript/Node.js client library for the [Pre.dev Architect API](https://docs.pre.dev/api-reference/introduction). Generate comprehensive software specifications using AI-powered analysis.

## Features

- 🚀 **Fast Spec**: Generate comprehensive specifications quickly - perfect for MVPs and prototypes
- 🔍 **Deep Spec**: Generate ultra-detailed specifications for complex systems with enterprise-grade depth
- 📊 **Status Tracking**: Check the status of async specification generation requests
- 🔒 **Enterprise Support**: Both solo and enterprise authentication methods
- ✨ **Full TypeScript Support**: Complete type definitions for better IDE support
- 🛡️ **Error Handling**: Custom exceptions for different error scenarios
- 🌐 **Modern ES Modules**: Uses ES6+ import/export syntax

## Installation

```bash
npm install predev-api
```

## Quick Start

```typescript
import { PredevAPI } from 'predev-api';

// Initialize the client with your API key
const client = new PredevAPI({ apiKey: 'your_api_key_here' });

// Generate a fast specification
const result = await client.fastSpec({
  input: 'Build a task management app with team collaboration',
  outputFormat: 'url'
});

console.log(result);
```

## Authentication

The Pre.dev API supports two authentication methods:

### Solo Authentication

Use your user ID from [pre.dev settings](https://pre.dev/settings):

```typescript
const client = new PredevAPI({ apiKey: 'your_user_id' });
```

### Enterprise Authentication

Use your organization's API key:

```typescript
const client = new PredevAPI({ 
  apiKey: 'your_org_api_key',
  enterprise: true 
});
```

Get your API key from the [pre.dev dashboard](https://pre.dev) under Settings → API Keys.

## Usage

### Fast Spec Generation

Generate comprehensive specifications quickly, ideal for MVPs and prototypes:

```typescript
import { PredevAPI } from 'predev-api';

const client = new PredevAPI({ apiKey: 'your_api_key' });

const result = await client.fastSpec({
  input: 'Build a task management app with team collaboration features',
  outputFormat: 'url' // or 'json'
});

console.log(result);
```

### Deep Spec Generation

Generate ultra-detailed specifications for complex systems with enterprise-grade depth:

```typescript
import { PredevAPI } from 'predev-api';

const client = new PredevAPI({ apiKey: 'your_api_key' });

const result = await client.deepSpec({
  input: 'Build an enterprise resource planning system with inventory, finance, and HR modules',
  outputFormat: 'url' // or 'json'
});

console.log(result);
```

### Check Specification Status

For async requests, check the status of your specification generation:

```typescript
import { PredevAPI } from 'predev-api';

const client = new PredevAPI({ apiKey: 'your_api_key' });

const status = await client.getSpecStatus('your_spec_id');
console.log(status);
```

## Examples

Check out the [examples directory](./examples) for more detailed usage examples:

- `fastSpecExample.ts` - Generate fast specifications
- `deepSpecExample.ts` - Generate deep specifications
- `getStatusExample.ts` - Check specification status

To run the examples:

```bash
# Set your API key
export PREDEV_API_KEY="your_api_key_here"

# Build the package first
npm run build

# Run an example with Node.js (since it's TypeScript, you'll need to compile or use tsx)
npx tsx examples/fastSpecExample.ts
```

## API Reference

### `PredevAPI`

Main client class for interacting with the Pre.dev API.

#### Constructor

```typescript
new PredevAPI(config: PredevAPIConfig)
```

**Parameters:**
- `config.apiKey` (string): Your API key from pre.dev settings
- `config.enterprise` (boolean, optional): Whether to use enterprise authentication (default: false)
- `config.baseUrl` (string, optional): Base URL for the API (default: "https://api.pre.dev")

#### Methods

##### `fastSpec(options: FastSpecOptions): Promise<SpecResponse>`

Generate a fast specification.

**Parameters:**
- `options.input` (string): Description of the project or feature
- `options.outputFormat` (string, optional): Format of the output - "url" or "json" (default: "url")

**Returns:** Promise resolving to the API response

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `deepSpec(options: DeepSpecOptions): Promise<SpecResponse>`

Generate a deep specification.

**Parameters:**
- `options.input` (string): Description of the project or feature
- `options.outputFormat` (string, optional): Format of the output - "url" or "json" (default: "url")

**Returns:** Promise resolving to the API response

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `getSpecStatus(specId: string): Promise<SpecResponse>`

Get the status of a specification generation request.

**Parameters:**
- `specId` (string): The ID of the specification request

**Returns:** Promise resolving to status information

**Throws:**
- `AuthenticationError`: If authentication fails
- `PredevAPIError`: For other API errors

## Error Handling

The library provides custom exceptions for different error scenarios:

```typescript
import { 
  PredevAPI, 
  PredevAPIError, 
  AuthenticationError, 
  RateLimitError 
} from 'predev-api';

const client = new PredevAPI({ apiKey: 'your_api_key' });

try {
  const result = await client.fastSpec({ input: 'Build a mobile app' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
  } else if (error instanceof PredevAPIError) {
    console.error('API error:', error.message);
  }
}
```

## Requirements

- Node.js 18.0.0 or higher
- TypeScript 5.0+ (for development)

## TypeScript

This package is written in TypeScript and includes full type definitions. You can import types for better IDE support:

```typescript
import { PredevAPI, PredevAPIConfig, SpecResponse } from 'predev-api';

const config: PredevAPIConfig = {
  apiKey: 'your_api_key',
  enterprise: false
};

const client = new PredevAPI(config);
```

## Development & Testing

### Running Tests

The package includes a comprehensive test suite using Vitest. To run the tests:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:
- Client initialization with solo and enterprise authentication
- Fast spec generation
- Deep spec generation
- Spec status checking
- Error handling (authentication errors, rate limits, API errors)
- Custom exceptions

Current test coverage: **93%**

### Building the Package

To build the TypeScript package:

```bash
# Compile TypeScript to JavaScript
npm run build

# The compiled files will be in the dist/ directory
```

## Documentation

For more information about the Pre.dev Architect API, visit:
- [API Documentation](https://docs.pre.dev/api-reference/introduction)
- [Pre.dev Website](https://pre.dev)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/predev/predev-api-node).
