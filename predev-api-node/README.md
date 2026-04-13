# pre.dev API

TypeScript/Node.js client for the [Pre.dev API](https://docs.pre.dev) — AI-powered software specs + browser automation.

## Features

**Specs**
- 🚀 **Fast Spec**: Comprehensive specifications for MVPs and prototypes
- 🔍 **Deep Spec**: Ultra-detailed specifications for complex systems
- ⚡ **Async Spec**: Non-blocking async methods with status polling
- 📄 File upload support (PDFs, docs, images as reference context)

**Browser automation (NEW)**
- 🌐 **Browser Tasks**: Scrape, fill forms, navigate pages with structured JSON output
- 📡 **SSE streaming**: Watch execution live — screenshots, plans, actions as they happen
- ⏱ **Async mode**: Fire-and-forget, poll for progress
- 🔁 **Retrieval**: Get any past task with full timeline for audit/replay

**Quality of life**
- ✨ Full TypeScript types, modern ES modules
- 🛡 Custom exceptions for auth / rate limit / API errors

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

## File Upload Support

All `fastSpec`, `deepSpec`, `fastSpecAsync`, and `deepSpecAsync` methods support optional file uploads. This allows you to provide architecture documents, requirements files, design mockups, or other context files to improve specification generation.

### Browser/Web Environment

```typescript
// Using File input from HTML form
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await predev.fastSpec({
  input: 'Generate specs based on this design document',
  file: file // Pass the File object directly
});
```

### Node.js Environment

```typescript
import fs from 'fs';

// Method 1: Using file path (simplest)
const result = await predev.fastSpec({
  input: 'Build based on these requirements',
  file: {
    data: fs.readFileSync('requirements.pdf'),
    name: 'requirements.pdf'
  }
});

// Method 2: Using file object
const fileContent = fs.readFileSync('architecture.doc');
const result = await predev.deepSpec({
  input: 'Create comprehensive specs',
  file: {
    data: fileContent,
    name: 'architecture.doc'
  }
});
```

### Supported File Types

- PDF documents (`*.pdf`)
- Word documents (`*.doc`, `*.docx`)
- Text files (`*.txt`)
- Images (`*.jpg`, `*.png`, `*.jpeg`)

### Response with File Upload

When you upload a file, the response includes:

```typescript
{
  uploadedFileName?: string;      // Name of the uploaded file
  uploadedFileShortUrl?: string;  // URL to access the file
  codingAgentSpecUrl?: string;    // Spec optimized for AI systems
  humanSpecUrl?: string;          // Spec optimized for humans
  // ... other fields
}
```

## Authentication

The Pre.dev API uses API key authentication. Get your API key from the [pre.dev dashboard](https://pre.dev) under Settings → API Keys:

```typescript
const predev = new PredevAPI({ apiKey: 'your_api_key' });
```

## API Methods

### Synchronous Methods

#### `fastSpec(options: SpecGenOptions): Promise<SpecResponse>`

Generate a fast specification (30-40 seconds, ~5-10 credits).

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

Generate a deep specification (2-3 minutes, ~10-50 credits).

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
  totalHumanHours?: number;       // Estimated hours for human developers
  // Direct returns (new)
  codingAgentSpecJson?: CodingAgentSpecJson;   // Simplified JSON for coding tools
  codingAgentSpecMarkdown?: string;            // Simplified markdown for coding tools
  humanSpecJson?: HumanSpecJson;               // Full JSON with hours/personas/roles
  humanSpecMarkdown?: string;                  // Full markdown with all details
  executionTime?: number;         // Processing time in milliseconds

  // Integration URLs (when completed)
  predevUrl?: string;             // Link to pre.dev project

  // Documentation (when docURLs provided)
  zippedDocsUrls?: Array<{
    platform: string;             // Platform name (e.g., "stripe.com")
    masterZipShortUrl: string;    // URL to download zipped documentation
  }>;                             // Complete documentation as zipped folders
                                  // Helps coding agents stay on track with full context

  // Error handling
  errorMessage?: string;          // Error details if failed
  progress?: number;              // Overall progress percentage (0-100)
  progressMessage?: string;       // Detailed progress message

  // Credit usage - available during processing (real-time) and on completion
  // Fast spec: ~5-10 credits, Deep spec: ~10-50 credits
  creditsUsed?: number;           // Total credits consumed by this spec generation
}
```

### Direct Spec JSON structures
```typescript
interface SpecCoreFunctionality { name: string; description: string; priority?: "High" | "Medium" | "Low"; }
interface SpecTechStackItem { name: string; category: string; }
interface SpecPersona { title: string; description: string; primaryGoals?: string[]; painPoints?: string[]; keyTasks?: string[]; }
interface SpecRole { name: string; shortHand: string; }

interface CodingAgentSubTask { id?: string; description: string; complexity: string; }
interface CodingAgentStory { id?: string; title: string; description?: string; acceptanceCriteria?: string[]; complexity?: string; subTasks: CodingAgentSubTask[]; }
interface CodingAgentMilestone { milestoneNumber: number; description: string; stories: CodingAgentStory[]; }
interface CodingAgentSpecJson {
  title?: string;
  executiveSummary: string;
  coreFunctionalities: SpecCoreFunctionality[];
  techStack: SpecTechStackItem[];
  techStackGrouped: Record<string, string[]>;
  milestones: CodingAgentMilestone[];
}

interface HumanSpecSubTask { id?: string; description: string; hours: number; complexity: string; roles?: SpecRole[]; }
interface HumanSpecStory { id?: string; title: string; description?: string; acceptanceCriteria?: string[]; hours: number; complexity?: string; subTasks: HumanSpecSubTask[]; }
interface HumanSpecMilestone { milestoneNumber: number; description: string; hours: number; stories: HumanSpecStory[]; }
interface HumanSpecJson {
  title?: string;
  executiveSummary: string;
  coreFunctionalities: SpecCoreFunctionality[];
  personas: SpecPersona[];
  techStack: SpecTechStackItem[];
  techStackGrouped: Record<string, string[]>;
  milestones: HumanSpecMilestone[];
  totalHours: number;
  roles: SpecRole[];
}
```
## Browser Tasks

Run browser automation — scrape data, fill forms, navigate pages, extract structured data. Each task navigates a URL, optionally performs actions, and returns typed JSON.

### Quick start

```typescript
import { PredevAPI } from 'predev-api';

const client = new PredevAPI({ apiKey: 'your_api_key' });

const result = await client.browserTasks([
  {
    url: 'https://news.ycombinator.com',
    instruction: 'Extract the top 5 stories',
    output: {
      type: 'object',
      properties: {
        stories: {
          type: 'array',
          items: {
            type: 'object',
            properties: { title: { type: 'string' }, points: { type: 'number' } },
          },
        },
      },
    },
  },
]);

console.log(result.results[0].data.stories);
```

### Three execution modes

#### 1. Sync (default) — wait for completion

```typescript
const result = await client.browserTasks([
  { url: 'https://example.com', output: { type: 'object', properties: { heading: { type: 'string' } } } }
]);
console.log(result.results[0].data);  // { heading: "Example Domain" }
console.log(result.totalCreditsUsed); // 0.1
```

#### 2. Stream (`stream: true`) — live timeline via SSE

Returns an async iterator yielding events as the agent runs. Good for showing progress in a UI.

```typescript
for await (const msg of client.browserTasks([...tasks], { stream: true })) {
  switch (msg.event) {
    case 'task_event':
      // navigation | screenshot | plan | action | validation | done
      console.log(`[${msg.data.type}]`, msg.data.data);
      break;
    case 'task_result':
      console.log(`Task ${msg.data.taskIndex} done:`, msg.data.data);
      break;
    case 'done':
      console.log('Batch complete:', msg.data.totalCreditsUsed, 'credits');
      break;
    case 'error':
      console.error('Batch error:', msg.data);
      break;
  }
}
```

#### 3. Async (`async: true`) — fire-and-forget, poll for progress

Returns the batch ID immediately. Use for long-running batches or background jobs.

```typescript
const r = await client.browserTasks([...tasks], { async: true });
// { id: "batch_abc", status: "processing", completed: 0, total: 3 }

while (true) {
  const state = await client.getBrowserTasks(r.id);
  console.log(`${state.completed}/${state.total}`);
  for (const done of state.results) {
    console.log(`  ✓ ${done.url} → ${JSON.stringify(done.data)}`);
  }
  if (state.status === 'completed') break;
  await new Promise(res => setTimeout(res, 1000));
}
```

### Task shapes

Each task's behavior is determined by which fields are set:

| Fields | Shape | Example |
|---|---|---|
| `url` + `output` | **Scrape** | Extract structured data from a page |
| `url` + `instruction` | **Act** | Click, navigate, search |
| `url` + `instruction` + `input` | **Form fill** | Fill & submit a form |
| `url` + `instruction` + `output` | **Act + extract** | Navigate then extract data |

### Retrieving a batch with the full timeline

Every task records navigation, screenshots, LLM plans, actions, and validations. Retrieve for audit, replay, or debugging. Screenshots are uploaded to a CDN during execution — retrieved events contain `data.url`, not base64.

```typescript
const details = await client.getBrowserTasks(batchId, { includeEvents: true });
for (const result of details.results) {
  for (const ev of result.events || []) {
    if (ev.type === 'screenshot') {
      // ev.data.url is a permanent CDN URL. Use directly in an <img> tag.
      console.log(`Iter ${ev.iteration} screenshot:`, ev.data.url);
    }
    if (ev.type === 'plan') console.log(`Iter ${ev.iteration} plan: ${ev.data.notes}`);
    if (ev.type === 'action') console.log(`  action: ${ev.data.type} ${ev.data.selector || ''}`);
  }
}
```

> **Note:** The live SSE stream (`stream: true`) still sends screenshots inline as base64 (`ev.data.base64`) so live UIs render instantly. The retrieval path (`getBrowserTasks`) always returns CDN URLs.

### Parallel batch example

```typescript
// Scrape 100 URLs with 20 browsers in parallel
const urls = [...100 urls...];
const result = await client.browserTasks(
  urls.map(url => ({ url, output: { type: 'object', properties: { title: { type: 'string' } } } })),
  { concurrency: 20 }
);
console.log(`${result.completed}/${result.total} done in ${result.totalCreditsUsed} credits`);
```

### Browser task methods

| Method | Returns | Use when |
|---|---|---|
| `browserTasks(tasks, { stream: false, async: false })` | `Promise<BrowserTasksResponse>` | Default — wait for completion |
| `browserTasks(tasks, { stream: true })` | `AsyncGenerator<BrowserTaskSSEMessage>` | Live UI showing execution timeline |
| `browserTasks(tasks, { async: true })` | `Promise<BrowserTasksResponse>` (empty results, returned immediately) | Long batches, background jobs |
| `getBrowserTasks(id, { includeEvents?: boolean })` | `Promise<BrowserTasksResponse>` | Poll progress or retrieve a completed batch |

### Task result statuses

| Status | Meaning |
|---|---|
| `SUCCESS` | Task completed, data extracted |
| `BLOCKED` | Page blocked automation (bot detection) |
| `TIMEOUT` | Task exceeded time limit |
| `LOOP` | Agent detected it was stuck in a loop |
| `ERROR` | Unexpected error |
| `NO_TARGET` | Could not find target elements |
| `CAPTCHA_FAILED` | CAPTCHA solve failed |

### Pricing

- Minimum: **0.1 credits per task** ($0.01)
- 10x margin on underlying LLM + sandbox compute
- 1 credit = $0.10
