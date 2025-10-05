# Pre.dev API Client Libraries

Official client libraries for the [Pre.dev Architect API](https://docs.pre.dev/api-reference/introduction) in Python and Node.js/TypeScript.

Generate comprehensive software specifications using AI-powered analysis with a simple, consistent API across both languages.

## 📦 Packages

This repository contains two client libraries with matching APIs:

### Python Package (`predev-api-python/`)

Python client for the Pre.dev Architect API with full type hints support.

**Quick Start:**
```python
from predev_api import PredevAPI

client = PredevAPI(api_key="your_api_key")
result = client.fast_spec("Build a task management app")
```

[📖 Python Documentation](./predev-api-python/README.md)

### Node.js/TypeScript Package (`predev-api-node/`)

Modern TypeScript/Node.js client using ES6+ modules with full type definitions.

**Quick Start:**
```typescript
import { PredevAPI } from 'predev-api';

const client = new PredevAPI({ apiKey: 'your_api_key' });
const result = await client.fastSpec({ input: 'Build a task management app' });
```

[📖 Node.js Documentation](./predev-api-node/README.md)

## 🚀 Features

Both libraries provide:

- **Fast Spec Generation**: Comprehensive specifications quickly - perfect for MVPs and prototypes
- **Deep Spec Generation**: Ultra-detailed specifications for complex systems with enterprise-grade depth
- **Status Tracking**: Check the status of async specification generation requests
- **Enterprise Support**: Both solo and enterprise authentication methods
- **Type Safety**: Full type hints (Python) and TypeScript definitions (Node.js)
- **Error Handling**: Custom exceptions for different error scenarios
- **Modern Conventions**: Latest language features and best practices

## 🔑 Authentication

Get your API key from the [pre.dev dashboard](https://pre.dev) under Settings → API Keys.

The API supports two authentication methods:

1. **Solo Authentication**: Use your user ID for personal projects
2. **Enterprise Authentication**: Use your organization's API key for team projects

## 📚 API Endpoints

### Fast Spec

Generate comprehensive specifications quickly with balanced depth and speed.

**Python:**
```python
result = client.fast_spec(
    input_text="Your project description",
    output_format="url"  # or "json"
)
```

**TypeScript:**
```typescript
const result = await client.fastSpec({
  input: "Your project description",
  outputFormat: "url"  // or "json"
});
```

### Deep Spec

Generate ultra-detailed specifications for complex systems with comprehensive analysis.

**Python:**
```python
result = client.deep_spec(
    input_text="Your complex project description",
    output_format="url"  # or "json"
)
```

**TypeScript:**
```typescript
const result = await client.deepSpec({
  input: "Your complex project description",
  outputFormat: "url"  // or "json"
});
```

### Get Spec Status

Check the status of an async specification generation request.

**Python:**
```python
status = client.get_spec_status("spec_id")
```

**TypeScript:**
```typescript
const status = await client.getSpecStatus("spec_id");
```

## 📖 Documentation

- [Pre.dev API Documentation](https://docs.pre.dev/api-reference/introduction)
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

## 🎯 Design Philosophy

Both libraries are designed with consistency in mind:

- **Consistent Naming**: Similar method names across languages (snake_case for Python, camelCase for TypeScript)
- **Consistent Parameters**: Same parameter names and options across both libraries
- **Consistent Error Handling**: Similar exception hierarchy and error messages
- **Modern Best Practices**: Latest language features and conventions
- **Complete Documentation**: Comprehensive docs, examples, and type definitions

## 🛠️ Development

### Python Package
```bash
cd predev-api-python
pip install -r requirements.txt
python setup.py develop

# Run tests
python -m pytest
python -m pytest --cov=predev_api  # with coverage
```

### Node.js Package
```bash
cd predev-api-node
npm install
npm run build

# Run tests
npm test
npm run test:coverage  # with coverage
```

### Test Results

Both packages include comprehensive test suites:

- **Python**: 16 tests, 94% coverage ✅
- **Node.js/TypeScript**: 17 tests, 93% coverage ✅

Tests cover:
- Client initialization and configuration
- API method calls (fast_spec/fastSpec, deep_spec/deepSpec, get_spec_status/getSpecStatus)
- Authentication (solo and enterprise)
- Error handling (authentication errors, rate limits, API errors)
- Custom exceptions

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues, questions, or contributions:
- Python: [GitHub Issues](https://github.com/predev/predev-api-python/issues)
- Node.js: [GitHub Issues](https://github.com/predev/predev-api-node/issues)
- Documentation: [Pre.dev Docs](https://docs.pre.dev)

## 🔗 Links

- [Pre.dev Website](https://pre.dev)
- [API Documentation](https://docs.pre.dev/api-reference/introduction)
- [Get API Key](https://pre.dev/settings)
