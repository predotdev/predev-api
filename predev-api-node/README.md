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

  // Output data (when completed)
  uploadedFileShortUrl?: string;  // Short URL to hosted spec
  uploadedFileName?: string;      // Filename
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

Check out the [examples directory](./examples) for detailed usage examples.

## API Reference

### `PredevAPI`

Main client class for interacting with the Pre.dev API.

#### Constructor

```typescript
new PredevAPI(config: PredevAPIConfig)
```

**Parameters:**
- `config.apiKey` (string): Your API key from pre.dev settings
- `config.baseUrl` (string, optional): Base URL for the API (default: "https://api.pre.dev")

#### Methods

##### `fastSpec(options: SpecGenOptions): Promise<SpecResponse>`

Generate a fast specification (30-40 seconds, 10 credits).

**Parameters:**
- `options.input` (string, **required**): Description of what you want to build
- `options.outputFormat` ("url" | "markdown", optional): Output format
  - `"url"` (default): Returns hosted URL to view the spec
  - `"markdown"`: Returns raw markdown content in response
- `options.currentContext` (string, optional): Existing project/codebase context
  - **When omitted**: Generates full new project spec with setup, deployment, docs, maintenance (`isNewBuild: true`)
  - **When provided**: Generates feature addition spec for existing project (`isNewBuild: false`)
- `options.docURLs` (string[], optional): Array of documentation URLs that Architect will reference when generating specifications (e.g., API docs, design systems)

**Returns:** Promise resolving to `SpecResponse`:

**Cost:** 10 credits per request

**Use Cases:** MVPs, prototypes, rapid iteration

**What's Generated:**
- ✅ Executive summary
- ✅ Feature breakdown by category
- ✅ Technical architecture recommendations
- ✅ Implementation milestones with effort estimates
- ✅ User stories and acceptance criteria
- ✅ Task checklist with progress tracking (`[ ]` → `[→]` → `[✓]` → `[⊘]`)
- ✅ Risk analysis and considerations

**Example - New Project:**
```typescript
const result = await predev.fastSpec({
  input: 'Build a SaaS project management tool with team collaboration',
  outputFormat: 'url'
});
// Returns: isNewBuild=true, includes setup and deployment
```

**Example - Feature Addition:**
```typescript
const result = await predev.fastSpec({
  input: 'Add calendar view and Gantt chart visualization',
  currentContext: 'Existing task management system with list/board views, auth, team features',
  outputFormat: 'url'
});
// Returns: isNewBuild=false, focuses only on new features
```

**Example - With Documentation URLs:**
```typescript
const result = await predev.fastSpec({
  input: 'Build a customer support ticketing system',
  docURLs: ['https://docs.pre.dev', 'https://docs.stripe.com'],
  outputFormat: 'markdown'
});
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `deepSpec(options: SpecGenOptions): Promise<SpecResponse>`

Generate a deep specification (2-3 minutes, 25 credits).

**Parameters:**
- `options.input` (string, **required**): Description of what you want to build
- `options.outputFormat` ("url" | "markdown", optional): Output format - `"url"` (default) or `"markdown"`
- `options.currentContext` (string, optional): Existing project/codebase context
  - **When omitted**: Full new project spec (`isNewBuild: true`)
  - **When provided**: Feature addition spec (`isNewBuild: false`)
- `options.docURLs` (string[], optional): Documentation URLs for reference

**Returns:** Promise resolving to `SpecResponse`

**Cost:** 50 credits per request

**Use Cases:** Complex systems, comprehensive planning

**What's Generated:** Same as fastSpec but with:
- 📊 More detailed architecture diagrams and explanations
- 🔍 Deeper technical analysis
- 📈 More comprehensive risk assessment
- 🎯 More granular implementation steps
- 🏗️ Advanced infrastructure recommendations

**Example:**
```typescript
const result = await predev.deepSpec({
  input: 'Build a resource planning (ERP) system',
  docURLs: ['https://company-docs.com/architecture'],
  outputFormat: 'url'
});
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `fastSpecAsync(options: SpecGenOptions): Promise<AsyncResponse>`

Generate a fast specification asynchronously (30-40 seconds, 10 credits).

**Parameters:**
- `options.input` (string, **required**): Description of what you want to build
- `options.outputFormat` ("url" | "markdown", optional): Output format - `"url"` (default) or `"markdown"`
- `options.currentContext` (string, optional): Existing project/codebase context
- `options.docURLs` (string[], optional): Documentation URLs for reference

**Returns:** Promise resolving to `AsyncResponse` with specId for polling:
```typescript
{
  specId: string;
  status: "pending" | "processing" | "completed" | "failed";
}
```

**Cost:** 10 credits per request

**Example:**
```typescript
const result = await predev.fastSpecAsync({
  input: 'Build a task management app',
  outputFormat: 'url'
});
// Use result.specId with getSpecStatus() to check progress
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `deepSpecAsync(options: SpecGenOptions): Promise<AsyncResponse>`

Generate a deep specification asynchronously (2-3 minutes, 25 credits).

**Parameters:**
- `options.input` (string, **required**): Description of what you want to build
- `options.outputFormat` ("url" | "markdown", optional): Output format - `"url"` (default) or `"markdown"`
- `options.currentContext` (string, optional): Existing project/codebase context
- `options.docURLs` (string[], optional): Documentation URLs for reference

**Returns:** Promise resolving to `AsyncResponse` with specId for polling:
```typescript
{
  specId: string;
  status: "pending" | "processing" | "completed" | "failed";
}
```

**Cost:** 50 credits per request

**Example:**
```typescript
const result = await predev.deepSpecAsync({
  input: 'Build an ERP system',
  outputFormat: 'url'
});
// Use result.specId with getSpecStatus() to check progress
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `getSpecStatus(specId: string): Promise<SpecResponse>`

Get the status of a specification generation request (for async requests).

**Parameters:**
- `specId` (string): The ID of the specification request

**Returns:** Promise resolving to `SpecResponse` with status information:
```typescript
{
  _id?: string;
  created?: string;
  endpoint: "fast_spec" | "deep_spec";
  input: string;
  status: "pending" | "processing" | "completed" | "failed";
  success: boolean;
  uploadedFileShortUrl?: string;
  uploadedFileName?: string;
  output?: any;
  outputFormat: "markdown" | "url";
  outputFileUrl?: string;
  executionTime?: number;
  predevUrl?: string;
  lovableUrl?: string;
  cursorUrl?: string;
  v0Url?: string;
  boltUrl?: string;
  errorMessage?: string;
  progress?: string;
}
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `PredevAPIError`: For other API errors

### Output Formats

#### URL Format (`outputFormat: "url"`)
Returns a hosted URL where you can view the specification in a formatted interface:
```typescript
{
  output: "https://api.pre.dev/s/a6hFJRV6",
  outputFormat: "url",
  outputFileUrl: "https://api.pre.dev/s/a6hFJRV6",
  predevUrl: "https://pre.dev/projects/abc123",
  lovableUrl: "https://lovable.dev/?autosubmit=true#prompt=First%20download%20https%3A%2F%2Fapi.pre.dev%2Fs%2Fa6hFJRV6%2C%20then%20save%20it%20to%20a%20file%20called%20%22spec.md%22%20and%20then%20parse%20it%20and%20implement%20it%20step%20by%20step",
  cursorUrl: "cursor://anysphere.cursor-deeplink/prompt?text=First+download+https%3A%2F%2Fapi.pre.dev%2Fs%2Fa6hFJRV6%2C+then+save+it+to+a+file+called+%22spec.md%22+and+then+parse+it+and+implement+it+step+by+step",
  v0Url: "https://v0.dev/chat?q=First%20download%20https%3A%2F%2Fapi.pre.dev%2Fs%2Fa6hFJRV6%2C%20then%20save%20it%20to%20a%20file%20called%20%22spec.md%22%20and%20then%20parse%20it%20and%20implement%20it%20step%20by%20step",
  boltUrl: "https://bolt.new?prompt=First%20download%20https%3A%2F%2Fapi.pre.dev%2Fs%2Fa6hFJRV6%2C%20then%20save%20it%20to%20a%20file%20called%20%22spec.md%22%20and%20then%20parse%20it%20and%20implement%20it%20step%20by%20step"
}
```

#### Markdown Format (`outputFormat: "markdown"`)
Returns the raw markdown content directly in the response:
```typescript
{
  output: "# Project Specification\n\n## Executive Summary...",
  outputFormat: "markdown",
  outputFileUrl: "https://pre.dev/s/abc123"
}
```

**Fast Spec Markdown Example:**
```markdown
### - [ ] **Milestone 1**: User authentication and profile management

- [ ] **User Registration** - (M): As a: new user, I want to: register an account with email and password, So that: I can access the platform
  - **Acceptance Criteria:**
    - [ ] User can register with valid email and password
    - [ ] Email verification sent upon registration
    - [ ] Duplicate emails handled gracefully
    - [ ] Password strength requirements enforced

- [ ] **User Login** - (S): As a: registered user, I want to: log in securely, So that: I can access my account
  - **Acceptance Criteria:**
    - [ ] User can log in with correct credentials
    - [ ] Invalid credentials rejected with clear message
    - [ ] Session persists across browser tabs
    - [ ] Password reset option available

- [ ] **User Profile** - (M): As a: registered user, I want to: manage my profile, So that: I can update my information
  - **Acceptance Criteria:**
    - [ ] User can view and edit profile details
    - [ ] Shipping addresses can be saved
    - [ ] Password can be changed with re-authentication
    - [ ] Account can be deactivated
```

**Deep Spec Markdown Example (includes subtasks):**
```markdown
### - [ ] **Milestone 2**: User authentication and profile management

- [ ] **User Registration** - (M): As a: new user, I want to: register an account with email and password, So that: I can access the platform
  - **Acceptance Criteria:**
    - [ ] User can register with valid email and password
    - [ ] Email verification sent upon registration
    - [ ] Duplicate emails handled gracefully
    - [ ] Password strength requirements enforced
  - [ ] DB: Create/verify table_users migration - (M)
  - [ ] Infra: Configure Clerk (external_clerk) & auth settings - (M)
  - [ ] FE: Implement /RegisterPage UI comp_registerPage_mainForm - (M)
  - [ ] FE: Add client-side validation & reCAPTCHA on register form - (M)
  - [ ] API: Implement registerWithEmail mutation in router_route_registerPage - (M)
  - [ ] Backend: Create user record in table_users and auth_methods - (M)
  - [ ] Integration: Connect API to Clerk for email confirmation/session - (M)
  - [ ] QA: Write unit and integration tests for registration flow - (M)
  - [ ] Docs: Document registration API and front-end behavior - (M)

- [ ] **Password Reset** - (M): As a: registered user, I want to: reset my password securely, So that: I can regain access
  - **Acceptance Criteria:**
    - [ ] User can request password reset link via valid email
    - [ ] Reset link expires after a defined period
    - [ ] New password must meet strength requirements
    - [ ] System invalidates existing sessions after password change
  - [ ] DB: Create password_resets table migration - (M)
  - [ ] API: Implement requestPasswordReset mutation (validate, create token) - (M)
  - [ ] API: Implement verifyResetToken and finalizeReset mutation - (M)
  - [ ] Frontend: Add Password Reset Request page (/auth/password-reset) - (M)
  - [ ] Frontend: Add Password Reset Form page (/auth/reset?token=) - (M)
  - [ ] Auth Integration: Wire Clerk for account lookup and session invalidation - (M)
  - [ ] Infra: Email service integration and template for reset link - (M)
  - [ ] Security: Add reCAPTCHA and rate limiting to request endpoint - (M)
  - [ ] Testing: End-to-end tests for reset flow - (M)
  - [ ] Docs: Document API, pages, and operational runbook - (M)
```

**Key Differences:**
- **Fast Spec**: Milestones → User Stories with Acceptance Criteria
- **Deep Spec**: Milestones → User Stories → Granular Subtasks (DB, API, FE, QA, Docs)
- Complexity estimates: (XS, S, M, L, XL)

### Task Status Legend

Task status legend: `[ ]` → `[→]` → `[✓]` → `[⊘]`

Update as your agent completes work to keep both you and AI aligned on progress.

## Error Handling

The library provides custom exceptions for different error scenarios:

```typescript
import { 
  PredevAPI, 
  PredevAPIError, 
  AuthenticationError, 
  RateLimitError 
} from 'predev-api';

const predev = new PredevAPI({ apiKey: 'your_api_key' });

try {
  const result = await predev.fastSpec({ input: 'Build a mobile app' });
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
import { 
  PredevAPI, 
  PredevAPIConfig, 
  SpecResponse, 
  AsyncSpecResponse,
  ErrorResponse 
} from 'predev-api';

const config: PredevAPIConfig = {
  apiKey: 'your_api_key',
  baseUrl: 'https://api.pre.dev'
};

const client = new PredevAPI(config);

// Type-safe async response handling
const result = await client.fastSpec({
  input: 'Build a task management app',
  async: true
});

if ('specId' in result) {
  // This is an AsyncSpecResponse
  console.log('Async request started:', result.specId);
} else {
  // This is a SpecResponse
  console.log('Sync response:', result.output);
}
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
- Client initialization and authentication
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
- [API Documentation](https://docs.pre.dev)
- [Pre.dev Website](https://pre.dev)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/predev/predev-api-node).
