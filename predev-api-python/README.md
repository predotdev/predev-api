# pre.dev Architect API - Python Client

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

##### `fast_spec(input_text: str, output_format: Literal["url", "markdown"] = "url", current_context: Optional[str] = None, doc_urls: Optional[List[str]] = None) -> Dict[str, Any]`

Generate a fast specification (30-40 seconds, 10 credits).

**Parameters:**
- `input_text` (str, **required**): Description of what you want to build
- `output_format` (str, optional): Output format
  - `"url"` (default): Returns hosted URL to view the spec
  - `"markdown"`: Returns raw markdown content in response
- `current_context` (str, optional): Existing project/codebase context
  - **When omitted**: Generates full new project spec with setup, deployment, docs, maintenance (`isNewBuild: true`)
  - **When provided**: Generates feature addition spec for existing project (`isNewBuild: false`)
- `doc_urls` (List[str], optional): Array of documentation URLs that Architect will reference when generating specifications (e.g., API docs, design systems)

**Returns:** Dictionary containing:
```python
{
    "output": "https://pre.dev/s/abc123",  # URL or markdown content
    "outputFormat": "url",                  # Echo of format requested
    "isNewBuild": True,                     # True for new projects, False for features
    "fileUrl": "https://pre.dev/s/abc123"  # Direct link to spec
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
```python
result = client.fast_spec(
    input_text="Build a SaaS project management tool with team collaboration",
    output_format="url"
)
# Returns: isNewBuild=True, includes setup and deployment
```

**Example - Feature Addition:**
```python
result = client.fast_spec(
    input_text="Add calendar view and Gantt chart visualization",
    current_context="Existing task management system with list/board views, auth, team features",
    output_format="url"
)
# Returns: isNewBuild=False, focuses only on new features
```

**Example - With Documentation URLs:**
```python
result = client.fast_spec(
    input_text="Build a customer support ticketing system",
    doc_urls=["https://docs.pre.dev", "https://docs.stripe.com"],
    output_format="markdown"
)
```

**Raises:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `deep_spec(input_text: str, output_format: Literal["url", "markdown"] = "url", current_context: Optional[str] = None, doc_urls: Optional[List[str]] = None) -> Dict[str, Any]`

Generate a deep specification (2-3 minutes, 25 credits) with enterprise-grade depth.

**Parameters:**
- `input_text` (str, **required**): Description of what you want to build
- `output_format` (str, optional): Output format - `"url"` (default) or `"markdown"`
- `current_context` (str, optional): Existing project/codebase context
  - **When omitted**: Full new project spec (`isNewBuild: true`)
  - **When provided**: Feature addition spec (`isNewBuild: false`)
- `doc_urls` (List[str], optional): Documentation URLs for reference

**Returns:** Dictionary with same structure as `fast_spec()`

**Cost:** 25 credits per request

**Use Cases:** Complex systems, enterprise applications, comprehensive planning

**What's Generated:** Same as fast_spec but with:
- 📊 More detailed architecture diagrams and explanations
- 🔍 Deeper technical analysis
- 📈 More comprehensive risk assessment
- 🎯 More granular implementation steps
- 🏗️ Advanced infrastructure recommendations

**Example:**
```python
result = client.deep_spec(
    input_text="Build an enterprise resource planning (ERP) system",
    doc_urls=["https://company-docs.com/architecture"],
    output_format="url"
)
```

**Raises:**
- `AuthenticationError`: If authentication fails
- `RateLimitError`: If rate limit is exceeded
- `PredevAPIError`: For other API errors

##### `get_spec_status(spec_id: str) -> Dict[str, Any]`

Get the status of a specification generation request (for async requests).

**Parameters:**
- `spec_id` (str): The ID of the specification request

**Returns:** Dictionary with status information
```python
{
    "requestId": "abc123",
    "status": "completed",  # pending | processing | completed | failed
    "progress": "Finalizing documentation...",
    "output": "https://pre.dev/s/abc123",
    "outputFormat": "url",
    "fileUrl": "https://pre.dev/s/abc123",
    "executionTimeMs": 35000
}
```

**Raises:**
- `AuthenticationError`: If authentication fails
- `PredevAPIError`: For other API errors

### Output Formats

#### URL Format (`output_format="url"`)
Returns a hosted URL where you can view the specification in a formatted interface:
```python
{
    "output": "https://pre.dev/s/abc123",
    "outputFormat": "url",
    "isNewBuild": true,
    "fileUrl": "https://pre.dev/s/abc123"
}
```

#### Markdown Format (`output_format="markdown"`)
Returns the raw markdown content directly in the response:
```python
{
    "markdown": "# Project Specification\n\n## Executive Summary...",
    "outputFormat": "markdown",
    "isNewBuild": true,
    "fileUrl": "https://pre.dev/s/abc123"
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
