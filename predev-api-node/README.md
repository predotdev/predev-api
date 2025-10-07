# pre.dev Architect API - Node.js/TypeScript Client

A TypeScript/Node.js client library for the [Pre.dev Architect API](https://docs.pre.dev). Generate comprehensive software specifications using AI-powered analysis.

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

## Usage

### Fast Spec Generation

Generate comprehensive specifications quickly, ideal for MVPs and prototypes:

```typescript
import { PredevAPI } from 'predev-api';

const predev = new PredevAPI({ apiKey: 'your_api_key' });

const result = await predev.fastSpec({
  input: 'Build a task management app with team collaboration features',
  outputFormat: 'url' // or 'json'
});

console.log(result);
```

### Deep Spec Generation

Generate ultra-detailed specifications for complex systems with enterprise-grade depth:

```typescript
import { PredevAPI } from 'predev-api';

const predev = new PredevAPI({ apiKey: 'your_api_key' });

const result = await predev.deepSpec({
  input: 'Build an enterprise resource planning system with inventory, finance, and HR modules',
  outputFormat: 'url' // or 'json'
});

console.log(result);
```

### Check Specification Status

For async requests, check the status of your specification generation:

```typescript
import { PredevAPI } from 'predev-api';

const predev = new PredevAPI({ apiKey: 'your_api_key' });

const status = await predev.getSpecStatus('your_spec_id');
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

**Returns:** Promise resolving to:
```typescript
{
  output: "https://pre.dev/s/abc123",  // URL or markdown content
  outputFormat: "url",                  // Echo of format requested
  isNewBuild: true,                     // true for new projects, false for features
  fileUrl: "https://pre.dev/s/abc123"  // Direct link to spec
}
```

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

Generate a deep specification (2-3 minutes, 25 credits) with enterprise-grade depth.

**Parameters:**
- `options.input` (string, **required**): Description of what you want to build
- `options.outputFormat` ("url" | "markdown", optional): Output format - `"url"` (default) or `"markdown"`
- `options.currentContext` (string, optional): Existing project/codebase context
  - **When omitted**: Full new project spec (`isNewBuild: true`)
  - **When provided**: Feature addition spec (`isNewBuild: false`)
- `options.docURLs` (string[], optional): Documentation URLs for reference

**Returns:** Promise with same structure as `fastSpec()`

**Cost:** 50 credits per request

**Use Cases:** Complex systems, enterprise applications, comprehensive planning

**What's Generated:** Same as fastSpec but with:
- 📊 More detailed architecture diagrams and explanations
- 🔍 Deeper technical analysis
- 📈 More comprehensive risk assessment
- 🎯 More granular implementation steps
- 🏗️ Advanced infrastructure recommendations

**Example:**
```typescript
const result = await predev.deepSpec({
  input: 'Build an enterprise resource planning (ERP) system',
  docURLs: ['https://company-docs.com/architecture'],
  outputFormat: 'url'
});
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `getSpecStatus(specId: string): Promise<SpecResponse>`

Get the status of a specification generation request (for async requests).

**Parameters:**
- `specId` (string): The ID of the specification request

**Returns:** Promise resolving to status information:
```typescript
{
  requestId: "abc123",
  status: "completed",  // "pending" | "processing" | "completed" | "failed"
  progress: "Finalizing documentation...",
  output: "https://pre.dev/s/abc123",
  outputFormat: "url",
  fileUrl: "https://pre.dev/s/abc123",
  executionTimeMs: 35000
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
  output: "https://pre.dev/s/abc123",
  outputFormat: "url",
  isNewBuild: true,
  fileUrl: "https://pre.dev/s/abc123"
}
```

#### Markdown Format (`outputFormat: "markdown"`)
Returns the raw markdown content directly in the response:
```typescript
{
  markdown: "# Project Specification\n\n## Executive Summary...",
  outputFormat: "markdown",
  isNewBuild: true,
  fileUrl: "https://pre.dev/s/abc123"
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
- [API Documentation](https://docs.pre.dev)
- [Pre.dev Website](https://pre.dev)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/predev/predev-api-node).
