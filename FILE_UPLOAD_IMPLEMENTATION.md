# File Upload Implementation for Pre.dev API

This document describes the file upload feature implementation for both Node.js and Python SDK packages.

## Overview

Both the Node.js and Python SDK packages now support optional file uploads for the `fastSpec`, `deepSpec`, `fastSpecAsync`, and `deepSpecAsync` methods. This allows developers to provide additional context through files (requirements documents, architecture diagrams, design documents, etc.) to improve specification generation.

## Node.js Implementation

### Type Definitions

**File:** `predev-api-node/src/types.ts`

Added new types to support both browser and Node.js environments:

```typescript
export type File = Blob | { data: Buffer; name: string };

export interface SpecGenOptions {
  input: string;
  currentContext?: string;
  docURLs?: string[];
  file?: File;  // New optional field
}
```

- **Blob**: For browser/web environments (File objects are Blobs)
- **{data: Buffer, name: string}**: For Node.js environments where buffers are used

### Client Updates

**File:** `predev-api-node/src/client.ts`

#### Method Signatures
All four main methods now accept the enhanced `SpecGenOptions`:

```typescript
async fastSpec(options: SpecGenOptions): Promise<SpecResponse>
async deepSpec(options: SpecGenOptions): Promise<SpecResponse>
async fastSpecAsync(options: SpecGenOptions): Promise<AsyncResponse>
async deepSpecAsync(options: SpecGenOptions): Promise<AsyncResponse>
```

#### Implementation Details

**Private methods added:**

1. **makeRequest** & **makeRequestAsync** (enhanced)
   - Check if file is provided
   - Route to appropriate handler (with/without file)
   - Maintain backward compatibility for non-file requests

2. **makeRequestWithFile** & **makeRequestWithFileAsync**
   - Create FormData objects for multipart uploads
   - Append form fields: input, currentContext, docURLs, file
   - Remove Content-Type header (browser/Node automatically sets it)
   - Handle file normalization

3. **normalizeFile**
   - Convert Node.js Buffer objects to Blob for consistent handling
   - Return browser Blob objects as-is

4. **getFileName**
   - Extract filename from Blob type or Buffer object
   - Fallback to default names if not available

### Usage Examples

#### Browser/Web
```typescript
const fileInput = document.querySelector('input[type="file"]');
const result = await client.fastSpec({
  input: 'Generate specs based on this document',
  file: fileInput.files[0]  // File object from input
});
```

#### Node.js
```typescript
import fs from 'fs';

const result = await client.fastSpec({
  input: 'Generate specs',
  file: {
    data: fs.readFileSync('requirements.pdf'),
    name: 'requirements.pdf'
  }
});
```

## Python Implementation

### Client Updates

**File:** `predev-api-python/predev_api/client.py`

#### Method Signatures
All four main methods now accept optional `file` parameter:

```python
def fast_spec(
    self,
    input_text: str,
    current_context: Optional[str] = None,
    doc_urls: Optional[List[str]] = None,
    file: Optional[Union[str, BinaryIO]] = None
) -> SpecResponse
```

Type supports:
- **str**: File path (e.g., "/path/to/file.pdf")
- **BinaryIO**: File-like objects (e.g., result of open())

#### Implementation Details

**Private methods added:**

1. **_make_request** & **_make_request_async** (enhanced)
   - Check if file is provided
   - Route to appropriate handler (with/without file)
   - Maintain backward compatibility

2. **_make_request_with_file** & **_make_request_with_file_async**
   - Use requests multipart form-data encoding
   - Remove Content-Type from headers (requests sets it automatically)
   - Pass data dict and files dict to requests.post
   - Handle JSON encoding for docURLs

3. **_prepare_file**
   - Handle file path strings: open and extract filename
   - Handle file-like objects: use .name attribute or default
   - Return properly formatted files dict for requests

### Usage Examples

#### File Path (Simplest)
```python
result = predev.fast_spec(
    input_text="Generate specs based on requirements",
    file="requirements.pdf"
)
```

#### File-like Objects
```python
with open("architecture.doc", "rb") as f:
    result = predev.deep_spec(
        input_text="Create comprehensive specs",
        file=f
    )
```

#### BytesIO Objects
```python
from io import BytesIO

file_content = BytesIO(b"Design specifications...")
result = predev.fast_spec(
    input_text="Generate specs",
    file=file_content
)
```

## Supported File Types

Both implementations support:
- **PDF**: `application/pdf` (.pdf)
- **Word**: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.doc, .docx)
- **Text**: `text/plain` (.txt)
- **Images**: `image/jpeg`, `image/png`, `image/jpg` (.jpg, .jpeg, .png)

**File Size Limit**: 20MB per file

## Examples Added

### Node.js Examples (`predev-api-node/examples/basicExamples.ts`)

1. **example10_FastSpecWithFileNode**
   - Demonstrates file upload in Node.js environment
   - Uses Buffer approach with fs.readFileSync

2. **example11_DeepSpecWithFileWeb**
   - Demonstrates Blob usage in web environment
   - Shows how to use browser File objects

3. **example12_FastSpecAsyncWithFile**
   - Demonstrates async spec generation with file upload
   - Includes polling for completion

### Python Examples (`predev-api-python/examples/basicExamples.py`)

1. **example10_fast_spec_with_file**
   - Demonstrates file upload using file path
   - Creates sample file and cleans up after

2. **example11_deep_spec_with_file**
   - Demonstrates file upload using open() context manager
   - Shows BinaryIO approach

3. **example12_fast_spec_async_with_file**
   - Demonstrates async spec generation with file upload
   - Includes polling for completion

## Documentation Updates

### Node.js README
- Added "File Upload Support" section
- Browser/Web environment examples
- Node.js environment examples
- Supported file types
- Response fields related to uploads

### Python README
- Added "File Upload Support" section
- File path approach examples
- File-like object examples
- Supported file types
- Response fields demonstration

## Response Fields

When files are uploaded, the `SpecResponse` includes:

```typescript
// TypeScript
uploadedFileName?: string;      // Name of uploaded file
uploadedFileShortUrl?: string;  // URL to access the file
```

```python
# Python
result.uploadedFileName       # Name of uploaded file
result.uploadedFileShortUrl   # URL to access the file
```

## Backward Compatibility

All changes are fully backward compatible:
- File parameter is optional on all methods
- Existing code without file uploads continues to work unchanged
- JSON payload handling unchanged for requests without files
- FormData encoding only used when file is provided

## Testing

Both packages compile successfully:
- Node.js: `npm run build` ✓
- Python: `python3 -m py_compile` ✓

No linting errors in either implementation.

## Key Design Decisions

1. **Flexible File Input**
   - Node.js: Buffer object with metadata
   - Python: File path or file-like object
   - Both follow platform conventions

2. **Automatic Header Handling**
   - FormData automatically sets Content-Type with boundary
   - Manual header deletion ensures proper encoding

3. **FormData for All File Operations**
   - Consistent approach for both sync and async methods
   - Works seamlessly in browser and Node.js

4. **Backward Compatibility**
   - Optional file parameter
   - Existing JSON-based requests unchanged
   - No breaking changes to API

## Migration Guide

### From Previous Version (No File Support)

No migration needed! All existing code continues to work:

```typescript
// Still works exactly as before
const result = await client.fastSpec({
  input: 'Build a task management app'
});
```

### To Add File Support

Simply add the `file` parameter:

```typescript
// Node.js
const result = await client.fastSpec({
  input: 'Build a task management app',
  file: {
    data: fs.readFileSync('requirements.pdf'),
    name: 'requirements.pdf'
  }
});

// Python
result = predev.fast_spec(
    input_text="Build a task management app",
    file="requirements.pdf"
)
```
