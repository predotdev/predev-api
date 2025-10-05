# Pre.dev API - Python Client

A Python client library for the [Pre.dev Architect API](https://docs.pre.dev/api-reference/introduction). Generate comprehensive software specifications using AI-powered analysis.

## Features

- 🚀 **Fast Spec**: Generate comprehensive specifications quickly - perfect for MVPs and prototypes
- 🔍 **Deep Spec**: Generate ultra-detailed specifications for complex systems with enterprise-grade depth
- 📊 **Status Tracking**: Check the status of async specification generation requests
- 🔒 **Enterprise Support**: Both solo and enterprise authentication methods
- ✨ **Type Hints**: Full type annotations for better IDE support
- 🛡️ **Error Handling**: Custom exceptions for different error scenarios

## Installation

```bash
pip install predev-api
```

## Quick Start

```python
from predev_api import PredevAPI

# Initialize the client with your API key
client = PredevAPI(api_key="your_api_key_here")

# Generate a fast specification
result = client.fast_spec(
    input_text="Build a task management app with team collaboration",
    output_format="url"
)

print(result)
```

## Authentication

The Pre.dev API supports two authentication methods:

### Solo Authentication

Use your user ID from [pre.dev settings](https://pre.dev/settings):

```python
client = PredevAPI(api_key="your_user_id")
```

### Enterprise Authentication

Use your organization's API key:

```python
client = PredevAPI(api_key="your_org_api_key", enterprise=True)
```

Get your API key from the [pre.dev dashboard](https://pre.dev) under Settings → API Keys.

## Usage

### Fast Spec Generation

Generate comprehensive specifications quickly, ideal for MVPs and prototypes:

```python
from predev_api import PredevAPI

client = PredevAPI(api_key="your_api_key")

result = client.fast_spec(
    input_text="Build a task management app with team collaboration features",
    output_format="url"  # or "json"
)

print(result)
```

### Deep Spec Generation

Generate ultra-detailed specifications for complex systems with enterprise-grade depth:

```python
from predev_api import PredevAPI

client = PredevAPI(api_key="your_api_key")

result = client.deep_spec(
    input_text="Build an enterprise resource planning system with inventory, finance, and HR modules",
    output_format="url"  # or "json"
)

print(result)
```

### Check Specification Status

For async requests, check the status of your specification generation:

```python
from predev_api import PredevAPI

client = PredevAPI(api_key="your_api_key")

status = client.get_spec_status(spec_id="your_spec_id")
print(status)
```

## Examples

Check out the [examples directory](./examples) for more detailed usage examples:

- `fast_spec_example.py` - Generate fast specifications
- `deep_spec_example.py` - Generate deep specifications
- `get_status_example.py` - Check specification status

To run the examples:

```bash
# Set your API key
export PREDEV_API_KEY="your_api_key_here"

# Run an example
python examples/fast_spec_example.py
```

## API Reference

### `PredevAPI`

Main client class for interacting with the Pre.dev API.

#### Constructor

```python
PredevAPI(api_key: str, enterprise: bool = False, base_url: str = "https://api.pre.dev")
```

**Parameters:**
- `api_key` (str): Your API key from pre.dev settings
- `enterprise` (bool): Whether to use enterprise authentication (default: False)
- `base_url` (str): Base URL for the API (default: "https://api.pre.dev")

#### Methods

##### `fast_spec(input_text: str, output_format: Literal["url", "json"] = "url") -> Dict[str, Any]`

Generate a fast specification.

**Parameters:**
- `input_text` (str): Description of the project or feature
- `output_format` (str): Format of the output - "url" or "json" (default: "url")

**Returns:** Dictionary with the API response

**Raises:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `deep_spec(input_text: str, output_format: Literal["url", "json"] = "url") -> Dict[str, Any]`

Generate a deep specification.

**Parameters:**
- `input_text` (str): Description of the project or feature
- `output_format` (str): Format of the output - "url" or "json" (default: "url")

**Returns:** Dictionary with the API response

**Raises:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `get_spec_status(spec_id: str) -> Dict[str, Any]`

Get the status of a specification generation request.

**Parameters:**
- `spec_id` (str): The ID of the specification request

**Returns:** Dictionary with status information

**Raises:**
- `AuthenticationError`: If authentication fails
- `PredevAPIError`: For other API errors

## Error Handling

The library provides custom exceptions for different error scenarios:

```python
from predev_api import PredevAPI, PredevAPIError, AuthenticationError, RateLimitError

client = PredevAPI(api_key="your_api_key")

try:
    result = client.fast_spec("Build a mobile app")
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
except RateLimitError as e:
    print(f"Rate limit exceeded: {e}")
except PredevAPIError as e:
    print(f"API error: {e}")
```

## Requirements

- Python 3.8 or higher
- requests >= 2.25.0

## Development & Testing

### Running Tests

The package includes a comprehensive test suite using pytest. To run the tests:

```bash
# Install dependencies (including test dependencies)
pip install -r requirements.txt

# Run all tests
python -m pytest

# Run tests with coverage report
python -m pytest --cov=predev_api --cov-report=term-missing

# Run tests in verbose mode
python -m pytest -v
```

### Test Coverage

The test suite covers:
- Client initialization with solo and enterprise authentication
- Fast spec generation
- Deep spec generation  
- Spec status checking
- Error handling (authentication errors, rate limits, API errors)
- Custom exceptions

Current test coverage: **94%**

## Documentation

For more information about the Pre.dev Architect API, visit:
- [API Documentation](https://docs.pre.dev/api-reference/introduction)
- [Pre.dev Website](https://pre.dev)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/predev/predev-api-python).
