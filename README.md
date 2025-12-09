# pre.dev API Client Libraries

Official client libraries for the [Pre.dev Architect API](https://docs.pre.dev) in Python and Node.js/TypeScript.

Generate comprehensive software specifications using AI-powered analysis with a simple, consistent API across both languages.

## 📦 Packages

This repository contains two client libraries with matching APIs:

### Python Package (`predev-api-python/`)

Python client for the Pre.dev Architect API with full type hints support.

**Quick Start:**
```python
from predev_api import PredevAPI

predev = PredevAPI(api_key="your_api_key")
result = predev.fast_spec("Build a task management app")
```

[📖 Python Documentation](./predev-api-python/README.md)

### Node.js/TypeScript Package (`predev-api-node/`)

Modern TypeScript/Node.js client using ES6+ modules with full type definitions.

**Quick Start:**
```typescript
import { PredevAPI } from 'predev-api';

const predev = new PredevAPI({ apiKey: 'your_api_key' });
const result = await predev.fastSpec({ input: 'Build a task management app' });
```

[📖 Node.js Documentation](./predev-api-node/README.md)

## 🚀 Features

Both libraries provide:

- **Fast Spec Generation**: Comprehensive specifications quickly - perfect for MVPs and prototypes
- **Deep Spec Generation**: Ultra-detailed specifications for complex systems with enterprise-grade depth
- **Async Spec Generation**: Non-blocking async methods for long-running requests
- **Status Tracking**: Check the status of async specification generation requests
- **Enterprise Support**: Both solo and enterprise authentication methods
- **Type Safety**: Full type hints (Python) and TypeScript definitions (Node.js)
- **Direct Spec Data**: JSON + markdown payloads returned inline alongside S3 URLs
- **Error Handling**: Custom exceptions for different error scenarios
- **Modern Conventions**: Latest language features and best practices

## 🔑 Authentication

Get your API key from the [pre.dev dashboard](https://pre.dev/projects/playground)

## 📚 API Endpoints

### Fast Spec

Generate comprehensive specifications quickly with balanced depth and speed.

**Python:**
```python
result = predev.fast_spec(
    input_text="Your project description"
)
```

**TypeScript:**
```typescript
const result = await predev.fastSpec({
  input: "Your project description"
});
```

### Deep Spec

Generate ultra-detailed specifications for complex systems with comprehensive analysis.

**Python:**
```python
result = predev.deep_spec(
    input_text="Your complex project description"
)
```

**TypeScript:**
```typescript
const result = await predev.deepSpec({
  input: "Your complex project description"
});
```

### Async Spec Generation

Generate specifications asynchronously for long-running requests.

**Python:**
```python
# Fast spec async
result = predev.fast_spec_async(
    input_text="Your project description"
)
# Returns: AsyncResponse with specId

# Deep spec async
result = predev.deep_spec_async(
    input_text="Your complex project description"
)
# Returns: AsyncResponse with specId
```

**TypeScript:**
```typescript
// Fast spec async
const result = await predev.fastSpecAsync({
  input: "Your project description"
});
// Returns: AsyncResponse with specId

// Deep spec async
const result = await predev.deepSpecAsync({
  input: "Your complex project description"
});
// Returns: AsyncResponse with specId
```

### Get Spec Status

Check the status of an async specification generation request.

**Python:**
```python
status = predev.get_spec_status("spec_id")
```

**TypeScript:**
```typescript
const status = await predev.getSpecStatus("spec_id");
```

## 📖 Documentation

- [Pre.dev API Documentation](https://docs.pre.dev)
- [Python Package README](./predev-api-python/README.md)
- [Node.js Package README](./predev-api-node/README.md)

## 💡 Examples

Both packages include comprehensive examples in their respective `examples/` directories:

### Python Examples
```bash
cd predev-api-python
export PREDEV_API_KEY="your_api_key"
python examples/fast_spec_example.py
python examples/deep_spec_example.py
python examples/get_status_example.py
```

### TypeScript Examples
```bash
cd predev-api-node
export PREDEV_API_KEY="your_api_key"
npm run build
npx tsx examples/fastSpecExample.ts
npx tsx examples/deepSpecExample.ts
npx tsx examples/getStatusExample.ts
```

## 🔗 Links

- [Pre.dev Website](https://pre.dev)
- [API Documentation](https://docs.pre.dev)
- [Get API Key](https://pre.dev/projects/playground)
