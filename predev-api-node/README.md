# pre.dev Architect API - Node.js/TypeScript Client

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
const result = await client.fastSpec({
  input: 'Build a SaaS project management tool with team collaboration',
  outputFormat: 'url'
});
// Returns: isNewBuild=true, includes setup and deployment
```

**Example - Feature Addition:**
```typescript
const result = await client.fastSpec({
  input: 'Add calendar view and Gantt chart visualization',
  currentContext: 'Existing task management system with list/board views, auth, team features',
  outputFormat: 'url'
});
// Returns: isNewBuild=false, focuses only on new features
```

**Example - With Documentation URLs:**
```typescript
const result = await client.fastSpec({
  input: 'Build a customer support ticketing system',
  docURLs: ['https://docs.pre.dev', 'https://docs.stripe.com'],
  outputFormat: 'markdown'
});
```

**Throws:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `deepSpec(options: DeepSpecOptions): Promise<SpecResponse>`

Generate a deep specification (2-3 minutes, 25 credits) with enterprise-grade depth.

**Parameters:**
- `options.input` (string, **required**): Description of what you want to build
- `options.outputFormat` ("url" | "markdown", optional): Output format - `"url"` (default) or `"markdown"`
- `options.currentContext` (string, optional): Existing project/codebase context
  - **When omitted**: Full new project spec (`isNewBuild: true`)
  - **When provided**: Feature addition spec (`isNewBuild: false`)
- `options.docURLs` (string[], optional): Documentation URLs for reference

**Returns:** Promise with same structure as `fastSpec()`

**Cost:** 25 credits per request

**Use Cases:** Complex systems, enterprise applications, comprehensive planning

**What's Generated:** Same as fastSpec but with:
- 📊 More detailed architecture diagrams and explanations
- 🔍 Deeper technical analysis
- 📈 More comprehensive risk assessment
- 🎯 More granular implementation steps
- 🏗️ Advanced infrastructure recommendations

**Example:**
```typescript
const result = await client.deepSpec({
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

**Markdown Example:**
```markdown
# Project Management Tool - Technical Specification

## Executive Summary
A comprehensive project management SaaS platform designed for teams to collaborate 
effectively, track tasks in real-time, manage projects, and log work hours with 
role-based access control and secure authentication.

## Core Features

### 1. Authentication & User Management
- [ ] User Registration & Login
  - [→] Email/password authentication
  - [✓] OAuth 2.0 integration (Google, GitHub)
  - [ ] Two-factor authentication (2FA)
  - [ ] Password reset functionality
- [ ] Role-Based Access Control (RBAC)
  - [ ] Admin, Project Manager, Team Member roles
  - [ ] Permission management system
  - [ ] Team invitation system

### 2. Project Management
- [ ] Project CRUD Operations
  - [ ] Create, read, update, delete projects
  - [ ] Project templates
  - [ ] Project archiving
- [ ] Project Dashboard
  - [ ] Overview metrics and statistics
  - [ ] Recent activity feed
  - [ ] Team member list

### 3. Task Tracking
- [ ] Task Management
  - [ ] Create and assign tasks
  - [ ] Task priorities (Low, Medium, High, Critical)
  - [ ] Due dates and reminders
  - [ ] Task dependencies
  - [ ] Subtasks and checklists
- [ ] Task Views
  - [ ] List view with filtering
  - [ ] Board view (Kanban)
  - [ ] Calendar view
  - [ ] Gantt chart

### 4. Real-Time Collaboration
- [ ] Live Updates
  - [ ] WebSocket connection for real-time sync
  - [ ] Presence indicators (who's online)
  - [ ] Live cursors and selections
- [ ] Comments & Mentions
  - [ ] Task comments with @mentions
  - [ ] File attachments
  - [ ] Emoji reactions
- [ ] Notifications
  - [ ] In-app notifications
  - [ ] Email notifications
  - [ ] Push notifications (PWA)

### 5. Time Logging
- [ ] Time Tracking
  - [ ] Start/stop timer
  - [ ] Manual time entry
  - [ ] Time logs per task
- [ ] Reporting
  - [ ] Daily/weekly/monthly reports
  - [ ] Time spent by user
  - [ ] Time spent by project
  - [ ] Exportable timesheets

## Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + Headless UI
- **Real-time**: Socket.io-client
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

### Backend  
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+ (primary), Redis (caching/sessions)
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Authentication**: JWT + Passport.js
- **File Storage**: AWS S3 or similar

### Infrastructure
- **Hosting**: AWS (EC2/ECS) or Vercel/Railway
- **Database**: AWS RDS or Supabase
- **CDN**: CloudFront or Cloudflare
- **Monitoring**: DataDog or New Relic
- **CI/CD**: GitHub Actions

## Implementation Milestones

### Phase 1: MVP (Weeks 1-4) - 160 hours
- [→] Authentication system setup
- [ ] Basic project and task CRUD
- [ ] Simple list view for tasks
- [ ] Core API endpoints
- [ ] Database schema and migrations
- [ ] Basic frontend layouts

### Phase 2: Core Features (Weeks 5-8) - 160 hours
- [ ] Role-based access control
- [ ] Real-time updates with WebSockets
- [ ] Task assignment and status tracking
- [ ] Comments and notifications
- [ ] Board and calendar views

### Phase 3: Advanced Features (Weeks 9-12) - 160 hours
- [ ] Time tracking and logging
- [ ] File attachments and storage
- [ ] Advanced filtering and search
- [ ] Reporting and analytics
- [ ] Email notifications

### Phase 4: Polish & Launch (Weeks 13-16) - 160 hours
- [ ] Performance optimization
- [ ] Security audit and hardening
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Documentation
- [ ] Deployment and monitoring setup
- [ ] Beta testing and feedback incorporation

**Total Estimated Effort**: 640 hours / 16 weeks

## Acceptance Criteria

### Must Have (P0)
- ✅ Users can register, login, and manage their profiles
- ✅ Projects can be created and managed by authorized users
- ✅ Tasks can be created, assigned, and tracked through completion
- ✅ Real-time updates show changes to all connected users
- ✅ Time can be logged against tasks
- ✅ Basic role-based permissions are enforced

### Should Have (P1)
- Multiple task views (list, board, calendar)
- File attachments on tasks
- Email notifications for key events
- Reporting and time tracking exports

### Nice to Have (P2)
- Gantt chart view
- Task dependencies
- Project templates
- Advanced analytics dashboard

## Risk Analysis

### Technical Risks
- **Real-time scalability**: WebSocket connections may require load balancing
  - *Mitigation*: Use Redis adapter for Socket.io, implement connection pooling
- **Database performance**: Large projects with many tasks could slow queries
  - *Mitigation*: Implement proper indexing, use pagination, add caching layer

### Security Considerations
- Implement rate limiting on all API endpoints
- Use parameterized queries to prevent SQL injection
- Encrypt sensitive data at rest
- Implement CORS properly
- Regular security audits and dependency updates
- Add CSP headers and XSS protection

## Task Status Legend
- `[ ]` Not started
- `[→]` In progress  
- `[✓]` Completed
- `[⊘]` Skipped/Descoped

**Note**: Update task statuses as development progresses to track implementation.
```

### Task Status Legend

The generated specs use checkboxes to track implementation progress:
- `[ ]` - Not started
- `[→]` - In progress
- `[✓]` - Completed
- `[⊘]` - Skipped (with reason)

**Pro Tip:** Update task statuses as your AI agent implements features to keep everyone aligned on progress.

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
