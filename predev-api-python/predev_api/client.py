"""
Client for the Pre.dev Architect API
"""

from typing import Optional, Dict, Any, Literal
import requests
from .exceptions import PredevAPIError, AuthenticationError, RateLimitError


class PredevAPI:
    """
    Client for interacting with the Pre.dev Architect API.
    
    The API offers two main endpoints:
    - Fast Spec: Generate comprehensive specs quickly (ideal for MVPs and prototypes)
    - Deep Spec: Generate ultra-detailed specs for complex systems (enterprise-grade depth)
    
    Args:
        api_key: Your API key from pre.dev settings
        enterprise: Whether to use enterprise authentication (default: False)
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
        enterprise: bool = False,
        base_url: str = "https://api.pre.dev"
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.enterprise = enterprise
        
        # Set up headers based on authentication type
        header_key = "x-enterprise-api-key" if enterprise else "x-api-key"
        self.headers = {
            header_key: api_key,
            "Content-Type": "application/json"
        }
    
    def fast_spec(
        self,
        input_text: str,
        output_format: Literal["url", "json"] = "url"
    ) -> Dict[str, Any]:
        """
        Generate a fast specification for your project.
        
        Perfect for MVPs and prototypes with balanced depth and speed.
        
        Args:
            input_text: Description of the project or feature to generate specs for
            output_format: Format of the output - "url" or "json" (default: "url")
        
        Returns:
            API response as a dictionary
        
        Raises:
            AuthenticationError: If authentication fails
            RateLimitError: If rate limit is exceeded
            PredevAPIError: For other API errors
        
        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> result = client.fast_spec(
            ...     "Build a task management app with team collaboration",
            ...     output_format="url"
            ... )
        """
        return self._make_request(
            endpoint="/api/fast-spec",
            input_text=input_text,
            output_format=output_format
        )
    
    def deep_spec(
        self,
        input_text: str,
        output_format: Literal["url", "json"] = "url"
    ) -> Dict[str, Any]:
        """
        Generate a deep specification for your project.
        
        Ultra-detailed specifications for complex systems with enterprise-grade depth
        and comprehensive analysis.
        
        Args:
            input_text: Description of the project or feature to generate specs for
            output_format: Format of the output - "url" or "json" (default: "url")
        
        Returns:
            API response as a dictionary
        
        Raises:
            AuthenticationError: If authentication fails
            RateLimitError: If rate limit is exceeded
            PredevAPIError: For other API errors
        
        Example:
            >>> client = PredevAPI(api_key="your_key")
            >>> result = client.deep_spec(
            ...     "Build an enterprise resource planning system",
            ...     output_format="url"
            ... )
        """
        return self._make_request(
            endpoint="/api/deep-spec",
            input_text=input_text,
            output_format=output_format
        )
    
    def get_spec_status(self, spec_id: str) -> Dict[str, Any]:
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
        url = f"{self.base_url}/api/spec-status/{spec_id}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e
    
    def _make_request(
        self,
        endpoint: str,
        input_text: str,
        output_format: str
    ) -> Dict[str, Any]:
        """Make a POST request to the API."""
        url = f"{self.base_url}{endpoint}"
        payload = {
            "input": input_text,
            "outputFormat": output_format
        }
        
        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            self._handle_response(response)
            return response.json()
        except requests.RequestException as e:
            raise PredevAPIError(f"Request failed: {str(e)}") from e
    
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
            error_message = error_data.get("error", "Unknown error")
        except Exception:
            error_message = response.text or "Unknown error"
        
        raise PredevAPIError(
            f"API request failed with status {response.status_code}: {error_message}"
        )
