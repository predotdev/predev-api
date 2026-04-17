"""
Client for the Pre.dev Architect API
"""

from typing import Optional, Dict, Any, Literal, List, Union, BinaryIO, Iterator
from dataclasses import dataclass
import json
import requests
from .exceptions import PredevAPIError, AuthenticationError, RateLimitError


@dataclass
class AsyncResponse:
    """Async mode response class"""
    specId: str
    status: Literal['pending', 'processing', 'completed', 'failed']


@dataclass
class ZippedDocsUrl:
    """Zipped documentation URL class"""
    platform: str
    masterZipShortUrl: str


@dataclass
class SpecCoreFunctionality:
    name: str
    description: str
    priority: Optional[str] = None


@dataclass
class SpecTechStackItem:
    name: str
    category: str


@dataclass
class SpecPersona:
    title: str
    description: str
    primaryGoals: Optional[List[str]] = None
    painPoints: Optional[List[str]] = None
    keyTasks: Optional[List[str]] = None


@dataclass
class SpecRole:
    name: str
    shortHand: str


@dataclass
class CodingAgentSubTask:
    id: Optional[str] = None
    description: str = ""
    complexity: str = ""


@dataclass
class CodingAgentStory:
    id: Optional[str] = None
    title: str = ""
    description: Optional[str] = None
    acceptanceCriteria: Optional[List[str]] = None
    complexity: Optional[str] = None
    subTasks: Optional[List[CodingAgentSubTask]] = None


@dataclass
class CodingAgentMilestone:
    milestoneNumber: int = 0
    description: str = ""
    stories: Optional[List[CodingAgentStory]] = None


@dataclass
class CodingAgentSpecJson:
    title: Optional[str] = None
    executiveSummary: str = ""
    coreFunctionalities: Optional[List[SpecCoreFunctionality]] = None
    techStack: Optional[List[SpecTechStackItem]] = None
    techStackGrouped: Optional[Dict[str, List[str]]] = None
    milestones: Optional[List[CodingAgentMilestone]] = None


@dataclass
class HumanSpecSubTask:
    id: Optional[str] = None
    description: str = ""
    hours: float = 0
    complexity: str = ""
    roles: Optional[List[SpecRole]] = None


@dataclass
class HumanSpecStory:
    id: Optional[str] = None
    title: str = ""
    description: Optional[str] = None
    acceptanceCriteria: Optional[List[str]] = None
    hours: float = 0
    complexity: Optional[str] = None
    subTasks: Optional[List[HumanSpecSubTask]] = None


@dataclass
class HumanSpecMilestone:
    milestoneNumber: int = 0
    description: str = ""
    hours: float = 0
    stories: Optional[List[HumanSpecStory]] = None


@dataclass
class HumanSpecJson:
    title: Optional[str] = None
    executiveSummary: str = ""
    coreFunctionalities: Optional[List[SpecCoreFunctionality]] = None
    personas: Optional[List[SpecPersona]] = None
    techStack: Optional[List[SpecTechStackItem]] = None
    techStackGrouped: Optional[Dict[str, List[str]]] = None
    milestones: Optional[List[HumanSpecMilestone]] = None
    totalHours: Optional[float] = None
    roles: Optional[List[SpecRole]] = None


@dataclass
class SpecGraphNode:
    id: str = ""
    label: str = ""
    type: Optional[str] = None
    description: Optional[str] = None
    level: Optional[int] = None
    hours: Optional[float] = None


@dataclass
class SpecGraphEdge:
    source: str = ""
    target: str = ""
    description: Optional[str] = None
    edgeType: Optional[str] = None


@dataclass
class SpecGraph:
    nodes: Optional[List['SpecGraphNode']] = None
    edges: Optional[List['SpecGraphEdge']] = None


@dataclass
class HelpfulLink:
    url: str = ""
    description: str = ""


@dataclass
class AlternativeTechStackItemApi:
    name: str = ""
    link: str = ""
    description: str = ""


@dataclass
class SpecEnrichedTechStackItem:
    name: str = ""
    useFor: str = ""
    reason: str = ""
    description: str = ""
    link: Optional[str] = None
    helpfulLinks: Optional[List['HelpfulLink']] = None
    alternatives: Optional[List['AlternativeTechStackItemApi']] = None


@dataclass
class SpecResponse:
    """Status check response class"""
    _id: Optional[str] = None
    created: Optional[str] = None

    endpoint: Optional[Literal['fast_spec', 'deep_spec']] = None
    input: Optional[str] = None
    status: Optional[Literal['pending',
                             'processing', 'completed', 'failed']] = None
    success: Optional[bool] = None

    uploadedFileShortUrl: Optional[str] = None
    uploadedFileName: Optional[str] = None
    codingAgentSpecUrl: Optional[str] = None
    humanSpecUrl: Optional[str] = None
    totalHumanHours: Optional[int] = None
    codingAgentSpecJson: Optional['CodingAgentSpecJson'] = None
    codingAgentSpecMarkdown: Optional[str] = None
    humanSpecJson: Optional['HumanSpecJson'] = None
    humanSpecMarkdown: Optional[str] = None
    executionTime: Optional[int] = None

    architectureInfographicUrl: Optional[str] = None

    predevUrl: Optional[str] = None

    zippedDocsUrls: Optional[List['ZippedDocsUrl']] = None

    errorMessage: Optional[str] = None
    progress: Optional[int] = None  # Overall progress percentage (0-100)
    progressMessage: Optional[str] = None  # Detailed progress message (e.g., "Generating User Stories...")

    # Credit usage - available during processing (real-time accumulation) and on completion
    # Fast spec: typically ~5-10 credits, Deep spec: typically ~10-50 credits
    creditsUsed: Optional[float] = None  # Total credits consumed by this spec generation

    # Graph data (only when completed)
    userFlowGraph: Optional['SpecGraph'] = None
    architectureGraph: Optional['SpecGraph'] = None
    enrichedTechStack: Optional[List['SpecEnrichedTechStackItem']] = None


@dataclass
class ErrorResponse:
    """Error response class"""
    error: str
    message: str


@dataclass
class ListSpecsResponse:
    """List/Find specs response class"""
    specs: List['SpecResponse']
    total: int
    hasMore: bool


@dataclass
class CreditsBalanceResponse:
    """Credits balance response class"""
    success: bool
    creditsRemaining: int


class PredevAPI:
    """
    Client for interacting with the Pre.dev Architect API.

    The API offers two main endpoints:
    - Fast Spec: Generate comprehensive specs quickly (ideal for MVPs and prototypes)
    - Deep Spec: Generate ultra-detailed specs for complex systems (enterprise-grade depth)

    Args:
        api_key: Your API key from pre.dev settings
        base_url: Base URL for the API (default: https://api.pre.dev)

    Example:
        >>> from predev_api import PredevAPI
        >>> client = PredevAPI(api_key="your_api_key")
        >>> result = client.fast_spec("Build a task management app")
        >>> print(result)
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.pre.dev"
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

        # Set up headers with Authorization Bearer token
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def fast_spec(
        self,
        input_text: str,
        current_context: Optional[str] = None,
        doc_urls: Optional[List[str]] = None,
        file: Optional[Union[str, BinaryIO]] = None
    ) -> SpecResponse:
        """
        Generate a fast specification for your project.

        Perfect for MVPs and prototypes with balanced depth and speed.

        Args:
            input_text: Description of the project or feature to generate specs for
            current_context: Existing project/codebase context. When omitted, generates
                           full new project spec. When provided, generates feature addition spec.
            doc_urls: Array of documentation URLs to reference (e.g., API docs, design systems)
            file: Optional file to upload (file path as string or file-like object)

        Returns:
            API response as SpecResponse object

        Raises:
            AuthenticationError: If authentication fails
            RateLimitError: If rate limit is exceeded
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> result = client.fast_spec(
            ...     input_text="Build a task management app with team collaboration",
            ...     file="path/to/architecture.pdf"
            ... )
        """
        return self._make_request(
            endpoint="/fast-spec",
            input_text=input_text,
            current_context=current_context,
            doc_urls=doc_urls,
            file=file
        )

    def deep_spec(
        self,
        input_text: str,
        current_context: Optional[str] = None,
        doc_urls: Optional[List[str]] = None,
        file: Optional[Union[str, BinaryIO]] = None
    ) -> SpecResponse:
        """
        Generate a deep specification for your project.

        Ultra-detailed specifications for complex systems with enterprise-grade depth
        and comprehensive analysis.

        Args:
            input_text: Description of the project or feature to generate specs for
            current_context: Existing project/codebase context. When omitted, generates
                           full new project spec. When provided, generates feature addition spec.
            doc_urls: Array of documentation URLs to reference (e.g., API docs, design systems)
            file: Optional file to upload (file path as string or file-like object)

        Returns:
            API response as SpecResponse object

        Raises:
            AuthenticationError: If authentication fails
            RateLimitError: If rate limit is exceeded
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> result = client.deep_spec(
            ...     input_text="Build an enterprise resource planning system",
            ...     file="path/to/requirements.doc"
            ... )
        """
        return self._make_request(
            endpoint="/deep-spec",
            input_text=input_text,
            current_context=current_context,
            doc_urls=doc_urls,
            file=file
        )

    def fast_spec_async(
        self,
        input_text: str,
        current_context: Optional[str] = None,
        doc_urls: Optional[List[str]] = None,
        file: Optional[Union[str, BinaryIO]] = None
    ) -> AsyncResponse:
        """
        Generate a fast specification asynchronously for your project.

        Perfect for MVPs and prototypes with balanced depth and speed.
        Returns immediately with a request ID for polling the status.

        Args:
            input_text: Description of the project or feature to generate specs for
            current_context: Existing project/codebase context. When omitted, generates
                           full new project spec. When provided, generates feature addition spec.
            doc_urls: Array of documentation URLs to reference (e.g., API docs, design systems)
            file: Optional file to upload (file path as string or file-like object)

        Returns:
            API response as AsyncResponse object with specId for polling

        Raises:
            AuthenticationError: If authentication fails
            RateLimitError: If rate limit is exceeded
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> result = client.fast_spec_async(
            ...     input_text="Build a task management app with team collaboration",
            ...     file="path/to/architecture.pdf"
            ... )
            >>> # Poll for status using result.specId
            >>> status = client.get_spec_status(result.specId)
        """
        return self._make_request_async(
            endpoint="/fast-spec",
            input_text=input_text,
            current_context=current_context,
            doc_urls=doc_urls,
            file=file
        )

    def deep_spec_async(
        self,
        input_text: str,
        current_context: Optional[str] = None,
        doc_urls: Optional[List[str]] = None,
        file: Optional[Union[str, BinaryIO]] = None
    ) -> AsyncResponse:
        """
        Generate a deep specification asynchronously for your project.

        Ultra-detailed specifications for complex systems with enterprise-grade depth
        and comprehensive analysis. Returns immediately with a request ID for polling the status.

        Args:
            input_text: Description of the project or feature to generate specs for
            current_context: Existing project/codebase context. When omitted, generates
                           full new project spec. When provided, generates feature addition spec.
            doc_urls: Array of documentation URLs to reference (e.g., API docs, design systems)
            file: Optional file to upload (file path as string or file-like object)

        Returns:
            API response as AsyncResponse object with specId for polling

        Raises:
            AuthenticationError: If authentication fails
            RateLimitError: If rate limit is exceeded
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> result = client.deep_spec_async(
            ...     input_text="Build an enterprise resource planning system",
            ...     file="path/to/requirements.doc"
            ... )
            >>> # Poll for status using result.specId
            >>> status = client.get_spec_status(result.specId)
        """
        return self._make_request_async(
            endpoint="/deep-spec",
            input_text=input_text,
            current_context=current_context,
            doc_urls=doc_urls,
            file=file
        )

    def get_spec_status(self, spec_id: str) -> SpecResponse:
        """
        Get the status of an async specification generation request.

        Args:
            spec_id: The ID of the specification request

        Returns:
            API response with status information

        Raises:
            AuthenticationError: If authentication fails
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> status = client.get_spec_status("spec_123")
        """
        url = f"{self.base_url}/spec-status/{spec_id}"

        try:
            response = requests.get(url, headers=self.headers, timeout=60)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def list_specs(
        self,
        limit: Optional[int] = None,
        skip: Optional[int] = None,
        endpoint: Optional[Literal['fast_spec', 'deep_spec']] = None,
        status: Optional[Literal['pending',
                                 'processing', 'completed', 'failed']] = None
    ) -> ListSpecsResponse:
        """
        List all specs with optional filtering and pagination.

        Args:
            limit: Results per page (1-100, default: 20)
            skip: Offset for pagination (default: 0)
            endpoint: Filter by endpoint type
            status: Filter by status

        Returns:
            ListSpecsResponse with specs array and pagination metadata

        Raises:
            AuthenticationError: If authentication fails
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> # Get first 20 specs
            >>> result = client.list_specs()
            >>> # Get completed specs only
            >>> completed = client.list_specs(status='completed')
            >>> # Paginate: get specs 20-40
            >>> page2 = client.list_specs(skip=20, limit=20)
        """
        url = f"{self.base_url}/list-specs"
        params = {}

        if limit is not None:
            params['limit'] = limit
        if skip is not None:
            params['skip'] = skip
        if endpoint is not None:
            params['endpoint'] = endpoint
        if status is not None:
            params['status'] = status

        try:
            response = requests.get(
                url, headers=self.headers, params=params, timeout=60)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def find_specs(
        self,
        query: str,
        limit: Optional[int] = None,
        skip: Optional[int] = None,
        endpoint: Optional[Literal['fast_spec', 'deep_spec']] = None,
        status: Optional[Literal['pending',
                                 'processing', 'completed', 'failed']] = None
    ) -> ListSpecsResponse:
        """
        Search for specs using regex patterns.

        Args:
            query: REQUIRED - Regex pattern (case-insensitive)
            limit: Results per page (1-100, default: 20)
            skip: Offset for pagination (default: 0)
            endpoint: Filter by endpoint type
            status: Filter by status

        Returns:
            ListSpecsResponse with matching specs and pagination metadata

        Raises:
            AuthenticationError: If authentication fails
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> # Search for "payment" specs
            >>> result = client.find_specs(query='payment')
            >>> # Search for specs starting with "Build"
            >>> builds = client.find_specs(query='^Build')
            >>> # Search: only completed specs mentioning "auth"
            >>> auth = client.find_specs(query='auth', status='completed')
        """
        url = f"{self.base_url}/find-specs"
        params = {'query': query}

        if limit is not None:
            params['limit'] = limit
        if skip is not None:
            params['skip'] = skip
        if endpoint is not None:
            params['endpoint'] = endpoint
        if status is not None:
            params['status'] = status

        try:
            response = requests.get(
                url, headers=self.headers, params=params, timeout=60)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def get_credits_balance(self) -> CreditsBalanceResponse:
        """
        Get the current credits balance for the API key.

        Returns:
            CreditsBalanceResponse with credits remaining

        Raises:
            AuthenticationError: If authentication fails
            PredevAPIError: For other API errors

        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> balance = client.get_credits_balance()
            >>> print(balance.creditsRemaining)
        """
        url = f"{self.base_url}/credits-balance"

        try:
            response = requests.get(url, headers=self.headers, timeout=60)
            self._handle_response(response)
            data = response.json()
            return CreditsBalanceResponse(success=data['success'], creditsRemaining=data['creditsRemaining'])
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def get_browser_agent(
        self,
        batch_id: str,
        include_events: bool = False
    ) -> Dict[str, Any]:
        """
        Get the status + results of a browser-agent batch by ID.

        Works for both in-progress and completed batches - use with run_async=True
        submissions to poll for progress. Set include_events=True to get the
        full timeline (screenshots, plans, actions, validations) for each task.

        Args:
            batch_id: The batch ID returned from browser_agent()
            include_events: Include full event timeline (can be large due to screenshots)

        Returns:
            Dict with id, total, completed, results, totalCreditsUsed, status
        """
        qs = "?includeEvents=true" if include_events else ""
        url = f"{self.base_url}/browser-agent/{batch_id}{qs}"
        try:
            response = requests.get(url, headers=self.headers, timeout=60)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def list_browser_agents(
        self,
        limit: Optional[int] = None,
        skip: Optional[int] = None,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        List browser-agent runs for the authenticated caller. Sorted by most recent.

        Args:
            limit: Page size (1-100, default 20)
            skip: Offset for pagination
            status: Optional filter ('processing' | 'completed')

        Returns:
            Dict with keys: batches, total, hasMore
        """
        params: Dict[str, Any] = {}
        if limit is not None:
            params["limit"] = limit
        if skip is not None:
            params["skip"] = skip
        if status is not None:
            params["status"] = status
        url = f"{self.base_url}/list-browser-agents"
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=60)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def browser_agent_status(self) -> Dict[str, Any]:
        """
        Caller's live queue snapshot. Useful for watching in-flight work
        against the per-user queue cap (1000 live tasks).

        Returns:
            Dict with keys: userId, running, claimed, pending, total, cap
        """
        url = f"{self.base_url}/browser-agent-status"
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def browser_agent(
        self,
        tasks: List[Dict[str, Any]],
        concurrency: Optional[int] = None,
        stream: bool = False,
        run_async: bool = False
    ) -> Union[Dict[str, Any], Iterator[Dict[str, Any]]]:
        """
        Run browser-agent automation tasks - scrape data, fill forms, navigate pages.

        Always pass an array of tasks (even for a single task). Each task has a
        url and optional instruction, input, and output schema.

        Args:
            tasks: Array of tasks. Each task has:
                - url (str, required): URL to navigate to
                - instruction (str, optional): What to do on the page
                - input (dict, optional): Form values / input data
                - output (dict, optional): JSON Schema for structured output
            concurrency: Parallel browsers (default 5, max 20)
            stream: If True, returns an iterator of SSE events instead of
                    waiting for all tasks to complete
            run_async: If True, returns immediately with the batch id; poll
                    get_browser_agent(id) for progress.

        Returns:
            Without stream: Dict with id, total, completed, results, totalCreditsUsed
            With stream: Iterator yielding dicts with 'event' and 'data' keys:
                - event='task_event': real-time events (navigation, screenshot, plan, action, etc.)
                - event='task_result': a single task completed
                - event='done': batch complete (data is the full result)
                - event='error': fatal error

        Example:
            >>> # Standard mode
            >>> result = client.browser_agent([
            ...     {"url": "https://example.com", "output": {"type": "object", "properties": {"heading": {"type": "string"}}}}
            ... ])
            >>> print(result["results"][0]["data"])
            >>>
            >>> # Stream mode
            >>> for msg in client.browser_agent([...], stream=True):
            ...     if msg["event"] == "done":
            ...         print("Done:", msg["data"]["totalCreditsUsed"], "credits")
        """
        if stream:
            return self._browser_agent_stream(tasks, concurrency)

        url = f"{self.base_url}/browser-agent"
        payload: Dict[str, Any] = {"tasks": tasks}
        if concurrency is not None:
            payload["concurrency"] = concurrency
        if run_async:
            payload["async"] = True

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=300
            )
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def _browser_agent_stream(
        self,
        tasks: List[Dict[str, Any]],
        concurrency: Optional[int] = None
    ) -> Iterator[Dict[str, Any]]:
        """SSE streaming implementation for browser_agent."""
        url = f"{self.base_url}/browser-agent"
        payload: Dict[str, Any] = {"tasks": tasks, "stream": True}
        if concurrency is not None:
            payload["concurrency"] = concurrency

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                stream=True,
                timeout=300
            )
            self._handle_response(response)

            current_event = ""
            for line in response.iter_lines(decode_unicode=True):
                if not line:
                    continue
                if line.startswith(":"):
                    continue
                if line.startswith("event: "):
                    current_event = line[7:].strip()
                elif line.startswith("data: ") and current_event:
                    data = json.loads(line[6:])
                    yield {"event": current_event, "data": data}
                    current_event = ""
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def _make_request(
        self,
        endpoint: str,
        input_text: str,
        current_context: Optional[str] = None,
        doc_urls: Optional[List[str]] = None,
        file: Optional[Union[str, BinaryIO]] = None
    ) -> SpecResponse:
        """Make a POST request to the API."""
        url = f"{self.base_url}{endpoint}"

        if file:
            return self._make_request_with_file(url, input_text, current_context, doc_urls, file)

        payload = {
            "input": input_text
        }

        if current_context is not None:
            payload["currentContext"] = current_context

        if doc_urls is not None:
            payload["docURLs"] = doc_urls

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=300
            )
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def _make_request_async(
        self,
        endpoint: str,
        input_text: str,
        current_context: Optional[str] = None,
        doc_urls: Optional[List[str]] = None,
        file: Optional[Union[str, BinaryIO]] = None
    ) -> AsyncResponse:
        """Make an async POST request to the API."""
        url = f"{self.base_url}{endpoint}"

        if file:
            return self._make_request_with_file_async(url, input_text, current_context, doc_urls, file)

        payload = {
            "input": input_text,
            "async": True
        }

        if current_context is not None:
            payload["currentContext"] = current_context

        if doc_urls is not None:
            payload["docURLs"] = doc_urls

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=300
            )
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def _make_request_with_file(
        self,
        url: str,
        input_text: str,
        current_context: Optional[str],
        doc_urls: Optional[List[str]],
        file: Union[str, BinaryIO]
    ) -> SpecResponse:
        """Make a POST request with file upload."""
        headers = {key: value for key, value in self.headers.items()
                   if key.lower() != "content-type"}

        data = {
            "input": input_text
        }

        if current_context is not None:
            data["currentContext"] = current_context

        if doc_urls is not None:
            data["docURLs"] = doc_urls

        files = self._prepare_file(file)

        try:
            response = requests.post(
                url,
                headers=headers,
                data=data,
                files=files,
                timeout=300
            )
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def _make_request_with_file_async(
        self,
        url: str,
        input_text: str,
        current_context: Optional[str],
        doc_urls: Optional[List[str]],
        file: Union[str, BinaryIO]
    ) -> AsyncResponse:
        """Make an async POST request with file upload."""
        headers = {key: value for key, value in self.headers.items()
                   if key.lower() != "content-type"}

        data = {
            "input": input_text,
            "async": "true"
        }

        if current_context is not None:
            data["currentContext"] = current_context

        if doc_urls is not None:
            data["docURLs"] = doc_urls

        files = self._prepare_file(file)

        try:
            response = requests.post(
                url,
                headers=headers,
                data=data,
                files=files,
                timeout=300
            )
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e

    def _prepare_file(self, file: Union[str, BinaryIO]) -> Dict[str, Any]:
        """Prepare file for multipart upload."""
        if isinstance(file, str):
            file_handle = open(file, "rb")
            filename = file.split("/")[-1]
            return {"file": (filename, file_handle)}
        else:
            filename = getattr(file, "name", "upload.txt")
            return {"file": (filename, file)}

    def _handle_response(self, response: requests.Response) -> None:
        """Handle API response and raise appropriate exceptions."""
        if response.status_code == 200:
            return

        if response.status_code == 401:
            raise AuthenticationError("Invalid API key")

        if response.status_code == 429:
            raise RateLimitError("Rate limit exceeded")

        try:
            error_data = response.json()
            error_message = error_data.get("error") or error_data.get(
                "message") or str(error_data)
        except Exception:
            error_message = response.text or "Unknown error"

        raise PredevAPIError(
            f"API request failed with status {response.status_code}: {error_message}"
        )
