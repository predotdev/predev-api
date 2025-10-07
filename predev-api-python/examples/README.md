# Pre.dev API Examples

## Setup

```bash
pip install predev-api
```

Set your API key:

```bash
export PREDEV_API_KEY="your_api_key_here"
```

## Examples

### 1. Fast Sync Spec

```python
import os
from predev_api import PredevAPI

predev = PredevAPI(api_key=os.environ.get("PREDEV_API_KEY"))

result = predev.fast_spec(
    input_text="Build a task management app",
    output_format="url"
)

print(result)
```

### 2. Deep Sync Spec

```python
import os
from predev_api import PredevAPI

predev = PredevAPI(api_key=os.environ.get("PREDEV_API_KEY"))

result = predev.deep_spec(
    input_text="Build a healthcare platform",
    output_format="url"
)

print(result)
```

### 3. Fast Async Spec with Status Polling

```python
import os
import time
from predev_api import PredevAPI

predev = PredevAPI(api_key=os.environ.get("PREDEV_API_KEY"))

result = predev.fast_spec_async(
    input_text="Build an e-commerce platform",
    output_format="url"
)

print(f"Spec ID: {result.specId}")

while True:
    status = predev.get_spec_status(result.specId)
    print(f"Status: {status.get('status')}")

    if status.get("status") == "completed":
        print("Spec completed!")
        break

    time.sleep(2)
```

### 4. Deep Async Spec with Status Polling

```python
import os
import time
from predev_api import PredevAPI

predev = PredevAPI(api_key=os.environ.get("PREDEV_API_KEY"))

result = predev.deep_spec_async(
    input_text="Build a comprehensive fintech platform",
    output_format="url"
)

print(f"Spec ID: {result.specId}")

while True:
    status = predev.get_spec_status(result.specId)
    print(f"Status: {status.get('status')}")

    if status.get("status") == "completed":
        print("Spec completed!")
        break

    time.sleep(2)
```
