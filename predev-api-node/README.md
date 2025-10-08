# pre.dev Architect API - Node.js/TypeScript Client

A TypeScript/Node.js client library for the [Pre.dev Architect API](https://docs.pre.dev). Generate comprehensive software specifications using AI-powered analysis.

## Features

- 🚀 **Fast Spec**: Generate comprehensive specifications quickly - perfect for MVPs and prototypes
- 🔍 **Deep Spec**: Generate ultra-detailed specifications for complex systems with enterprise-grade depth
- ⚡ **Async Spec**: Non-blocking async methods for long-running requests
- 📊 **Status Tracking**: Check the status of async specification generation requests
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

// Initialize the predev client with your API key
const predev = new PredevAPI({ apiKey: 'your_api_key_here' });

// Generate a fast specification
const result = await predev.fastSpec({
  input: 'Build a task management app with team collaboration',
  outputFormat: 'url'
});

console.log(result);
```

## Authentication

The Pre.dev API uses API key authentication. Get your API key from the [pre.dev dashboard](https://pre.dev) under Settings → API Keys:

```typescript
const predev = new PredevAPI({ apiKey: 'your_api_key' });
```

## API Methods

### Synchronous Methods

#### `fastSpec(options: SpecGenOptions): Promise<SpecResponse>`

Generate a fast specification (30-40 seconds, 10 credits).

**Parameters:**
- `options.input` **(required)**: `string` - Description of what you want to build
- `options.outputFormat` **(optional)**: `"url" | "markdown"` - Output format (default: `"url"`)
- `options.currentContext` **(optional)**: `string` - Existing project context
- `options.docURLs` **(optional)**: `string[]` - Documentation URLs to reference

**Returns:** `SpecResponse` object with complete specification data

**Example:**
```typescript
const result = await predev.fastSpec({
  input: 'Build a SaaS project management tool with real-time collaboration',
  outputFormat: 'url'
});
```

#### `deepSpec(options: SpecGenOptions): Promise<SpecResponse>`

Generate a deep specification (2-3 minutes, 50 credits).

**Parameters:** Same as `fastSpec`

**Returns:** `SpecResponse` object with comprehensive specification data

**Example:**
```typescript
const result = await predev.deepSpec({
  input: 'Build a healthcare platform with HIPAA compliance',
  outputFormat: 'url'
});
```

### Asynchronous Methods

#### `fastSpecAsync(options: SpecGenOptions): Promise<AsyncResponse>`

Generate a fast specification asynchronously (returns immediately).

**Parameters:** Same as `fastSpec`

**Returns:** `AsyncResponse` object with `specId` for polling

**Example:**
```typescript
const result = await predev.fastSpecAsync({
  input: 'Build a comprehensive e-commerce platform',
  outputFormat: 'url'
});
// Returns: { specId: "spec_123", status: "pending" }
```

#### `deepSpecAsync(options: SpecGenOptions): Promise<AsyncResponse>`

Generate a deep specification asynchronously (returns immediately).

**Parameters:** Same as `fastSpec`

**Returns:** `AsyncResponse` object with `specId` for polling

**Example:**
```typescript
const result = await predev.deepSpecAsync({
  input: 'Build a fintech platform with regulatory compliance',
  outputFormat: 'url'
});
// Returns: { specId: "spec_456", status: "pending" }
```

### Status Checking

#### `getSpecStatus(specId: string): Promise<SpecResponse>`

Check the status of an async specification generation request.

**Parameters:**
- `specId` **(required)**: `string` - The specification ID from async methods

**Returns:** `SpecResponse` object with current status and data (when completed)

**Example:**
```typescript
const status = await predev.getSpecStatus('spec_123');
// Returns full SpecResponse with status: "pending" | "processing" | "completed" | "failed"
```

## Response Types

### `AsyncResponse`
```typescript
{
  specId: string;      // Unique ID for polling (e.g., "spec_abc123")
  status: "pending" | "processing" | "completed" | "failed";
}
```

### `SpecResponse`
```typescript
{
  // Basic info
  _id?: string;                    // Internal ID
  created?: string;               // ISO timestamp
  endpoint: "fast_spec" | "deep_spec";
  input: string;                  // Original input text
  status: "pending" | "processing" | "completed" | "failed";
  success: boolean;
  uploadedFileShortUrl?: string;  // URL to input file
  uploadedFileName?: string;      // Name of input file

  // Output data (when completed)
  output?: any;                   // Raw content or URL
  outputFormat: "markdown" | "url";
  outputFileUrl?: string;         // Full URL to hosted spec
  executionTime?: number;         // Processing time in milliseconds

  // Integration URLs (when completed)
  predevUrl?: string;             // Link to pre.dev project
  lovableUrl?: string;            // Link to generate with Lovable
  cursorUrl?: string;             // Link to generate with Cursor
  v0Url?: string;                 // Link to generate with v0
  boltUrl?: string;               // Link to generate with Bolt

  // Error handling
  errorMessage?: string;          // Error details if failed
  progress?: string;              // Progress information
}
```

## Examples Directory

Check out the [examples directory](https://github.com/predotdev/predev-api/tree/main/predev-api-node/examples) for detailed usage examples.

To build the TypeScript package:

```bash
# Compile TypeScript to JavaScript
npm run build

# The compiled files will be in the dist/ directory
```

## Documentation

For more information about the Pre.dev Architect API, visit:
- [API Documentation](https://docs.pre.dev)
- [pre.dev Website](https://pre.dev)

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/predotdev/predev-api).
