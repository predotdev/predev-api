# pre.dev Architect API

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
  input: 'Build a task management app with team collaboration'
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
- `options.currentContext` **(optional)**: `string` - Existing project context
- `options.docURLs` **(optional)**: `string[]` - Documentation URLs to reference (e.g., Stripe docs, framework docs)

**Returns:** `SpecResponse` object with complete specification data

**Example:**
```typescript
const result = await predev.fastSpec({
  input: 'Build a SaaS project management tool with real-time collaboration'
});
```

**Example with Documentation URLs:**
```typescript
const result = await predev.fastSpec({
  input: 'Build a payment processing integration with Stripe',
  docURLs: ['https://stripe.com/docs/api']
});

// When docURLs are provided, the response includes zippedDocsUrls:
// result.zippedDocsUrls = [
//   {
//     platform: "stripe.com",
//     masterZipShortUrl: "https://api.pre.dev/s/xyz789"
//   }
// ]
// These zipped documentation folders can be downloaded and help coding agents
// stay on track by providing complete, up-to-date documentation context.
```

#### `deepSpec(options: SpecGenOptions): Promise<SpecResponse>`

Generate a deep specification (2-3 minutes, 50 credits).

**Parameters:** Same as `fastSpec`

**Returns:** `SpecResponse` object with comprehensive specification data

**Example:**
```typescript
const result = await predev.deepSpec({
  input: 'Build a healthcare platform with HIPAA compliance'
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
  input: 'Build a comprehensive e-commerce platform'
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
  input: 'Build a fintech platform with regulatory compliance'
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

### Listing and Searching Specs

#### `listSpecs(params?: ListSpecsParams): Promise<ListSpecsResponse>`

List all specs with optional filtering and pagination.

**Parameters:**
- `params.limit` **(optional)**: `number` - Results per page (1-100, default: 20)
- `params.skip` **(optional)**: `number` - Offset for pagination (default: 0)
- `params.endpoint` **(optional)**: `"fast_spec" | "deep_spec"` - Filter by endpoint type
- `params.status` **(optional)**: `"pending" | "processing" | "completed" | "failed"` - Filter by status

**Returns:** `ListSpecsResponse` object with specs array and pagination metadata

**Examples:**
```typescript
// Get first 20 specs
const result = await predev.listSpecs();

// Get completed specs only
const completed = await predev.listSpecs({ status: 'completed' });

// Paginate: get specs 20-40
const page2 = await predev.listSpecs({ skip: 20, limit: 20 });

// Filter by endpoint type
const fastSpecs = await predev.listSpecs({ endpoint: 'fast_spec' });
```

#### `findSpecs(params: FindSpecsParams): Promise<ListSpecsResponse>`

Search for specs using regex patterns.

**Parameters:**
- `params.query` **(required)**: `string` - Regex pattern (case-insensitive)
- `params.limit` **(optional)**: `number` - Results per page (1-100, default: 20)
- `params.skip` **(optional)**: `number` - Offset for pagination (default: 0)
- `params.endpoint` **(optional)**: `"fast_spec" | "deep_spec"` - Filter by endpoint type
- `params.status` **(optional)**: `"pending" | "processing" | "completed" | "failed"` - Filter by status

**Returns:** `ListSpecsResponse` object with matching specs and pagination metadata

**Examples:**
```typescript
// Search for "payment" specs
const paymentSpecs = await predev.findSpecs({ query: 'payment' });

// Search for specs starting with "Build"
const buildSpecs = await predev.findSpecs({ query: '^Build' });

// Search: only completed specs mentioning "auth"
const authSpecs = await predev.findSpecs({ 
  query: 'auth', 
  status: 'completed' 
});

// Complex regex: find SaaS or SASS projects
const saasSpecs = await predev.findSpecs({ query: 'saas|sass' });
```

**Regex Pattern Examples:**

| Pattern | Matches |
|---------|---------|
| `payment` | "payment", "Payment", "make payment" |
| `^Build` | Specs starting with "Build" |
| `platform$` | Specs ending with "platform" |
| `(API\|REST)` | Either "API" or "REST" |
| `auth.*system` | "auth" then anything then "system" |
| `\\d{3,}` | 3+ digits (budgets, quantities) |
| `saas\|sass` | SaaS or SASS |

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

  // Output URLs (when completed)
  codingAgentSpecUrl?: string;    // Spec optimized for AI/LLM systems
  humanSpecUrl?: string;          // Spec optimized for human readers
  executionTime?: number;         // Processing time in milliseconds

  // Integration URLs (when completed)
  predevUrl?: string;             // Link to pre.dev project
  lovableUrl?: string;            // Link to generate with Lovable
  cursorUrl?: string;             // Link to generate with Cursor
  v0Url?: string;                 // Link to generate with v0
  boltUrl?: string;               // Link to generate with Bolt

  // Documentation (when docURLs provided)
  zippedDocsUrls?: Array<{
    platform: string;             // Platform name (e.g., "stripe.com")
    masterZipShortUrl: string;    // URL to download zipped documentation
  }>;                             // Complete documentation as zipped folders
                                  // Helps coding agents stay on track with full context

  // Error handling
  errorMessage?: string;          // Error details if failed
  progress?: string;              // Progress information
}
```