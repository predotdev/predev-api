# Pre.dev API Examples

## Setup

```bash
npm install
```

Set your API key:

```bash
export PREDEV_API_KEY="your_api_key_here"
```

## Running the Examples

Run all examples:

```bash
npx tsx basicExamples.ts
```

Or run individual examples by importing them:

```typescript
import { example1_BasicFastSpec } from './basicExamples';

// Run just one example
await example1_BasicFastSpec();
```

## Examples Overview

The `basicExamples.ts` file contains comprehensive examples demonstrating all Pre.dev API features:

### Synchronous Methods
- **Fast Spec**: Generate specifications quickly (30-40 seconds, 10 credits)
- **Deep Spec**: Generate comprehensive specifications (2-3 minutes, 50 credits)
- **Feature Addition**: Add features to existing projects using `currentContext`
- **Documentation References**: Include external docs with `docURLs`
- **Output Formats**: URL format (default) and markdown format

### Asynchronous Methods
- **Async Fast/Deep Specs**: Non-blocking generation with immediate response
- **Status Polling**: Check progress of async requests with `getSpecStatus`

### Advanced Features
- **Error Handling**: Custom exceptions for different error types
- **Claude Agent SDK Integration**: Autonomous implementation (requires separate setup)

### Example Categories

1. **Basic Fast Spec** - New project generation
2. **Feature Addition** - Adding features to existing projects
3. **Documentation URLs** - Reference external documentation
4. **Enterprise Deep Spec** - Complex enterprise projects
5. **Async Generation** - Non-blocking requests with polling
6. **Error Handling** - Proper exception handling
7. **Output Formats** - URL vs markdown outputs

## Quick Examples

### Generate a Fast Spec
```typescript
import { PredevAPI } from "../src/index";

const predev = new PredevAPI({ apiKey: process.env.PREDEV_API_KEY! });

const result = await predev.fastSpec({
  input: "Build a task management app",
});

console.log(result);
```

### Generate a Deep Spec
```typescript
const result = await predev.deepSpec({
  input: "Build a healthcare platform",
});

console.log(result);
```

### Async Generation with Status Polling
```typescript
const result = await predev.fastSpecAsync({
  input: "Build an e-commerce platform",
});

console.log(`Spec ID: ${result.specId}`);

while (true) {
  const status = await predev.getSpecStatus(result.specId);
  console.log(`Status: ${status.status}`);

  if (status.status === "completed") {
    console.log("Spec completed!");
    break;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
}
```
