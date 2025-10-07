"""
Tests for the PredevAPI client
"""

import pytest
from unittest.mock import Mock, patch
from predev_api import PredevAPI, PredevAPIError, AuthenticationError, RateLimitError


class TestPredevAPIInit:
    """Test PredevAPI initialization"""

    def test_init_with_solo_auth(self):
        """Test initialization with solo authentication"""
        client = PredevAPI(api_key="test_key")
        assert client.api_key == "test_key"
        assert "x-api-key" in client.headers
        assert client.headers["x-api-key"] == "test_key"

    def test_init_with_custom_base_url(self):
        """Test initialization with custom base URL"""
        client = PredevAPI(api_key="test_key",
                           base_url="https://custom.api.com/")
        assert client.base_url == "https://custom.api.com"


class TestFastSpec:
    """Test fast_spec method"""

    @patch('predev_api.client.requests.post')
    def test_fast_spec_success(self, mock_post):
        """Test successful fast_spec call"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "spec_id": "123", "url": "https://example.com/spec"}
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.fast_spec("Build a todo app")

        assert result["spec_id"] == "123"
        assert result["url"] == "https://example.com/spec"
        mock_post.assert_called_once()

    @patch('predev_api.client.requests.post')
    def test_fast_spec_with_json_format(self, mock_post):
        """Test fast_spec with JSON output format"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"spec": "data"}
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.fast_spec("Build a todo app", output_format="json")

        # Check that the payload includes the correct output format
        call_args = mock_post.call_args
        assert call_args[1]["json"]["outputFormat"] == "json"

    @patch('predev_api.client.requests.post')
    def test_fast_spec_authentication_error(self, mock_post):
        """Test fast_spec with authentication error"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="invalid_key")
        with pytest.raises(AuthenticationError):
            client.fast_spec("Build a todo app")

    @patch('predev_api.client.requests.post')
    def test_fast_spec_rate_limit_error(self, mock_post):
        """Test fast_spec with rate limit error"""
        mock_response = Mock()
        mock_response.status_code = 429
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        with pytest.raises(RateLimitError):
            client.fast_spec("Build a todo app")


class TestDeepSpec:
    """Test deep_spec method"""

    @patch('predev_api.client.requests.post')
    def test_deep_spec_success(self, mock_post):
        """Test successful deep_spec call"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "spec_id": "456", "url": "https://example.com/deep-spec"}
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.deep_spec("Build an ERP system")

        assert result["spec_id"] == "456"
        assert result["url"] == "https://example.com/deep-spec"
        mock_post.assert_called_once()

    @patch('predev_api.client.requests.post')
    def test_deep_spec_with_url_format(self, mock_post):
        """Test deep_spec with URL output format"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"url": "https://example.com"}
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.deep_spec("Build an ERP system", output_format="url")

        # Check that the endpoint is correct
        call_args = mock_post.call_args
        assert "/deep-spec" in call_args[0][0]


class TestGetSpecStatus:
    """Test get_spec_status method"""

    @patch('predev_api.client.requests.get')
    def test_get_spec_status_success(self, mock_get):
        """Test successful get_spec_status call"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "status": "completed", "spec_id": "123"}
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.get_spec_status("123")

        assert result["status"] == "completed"
        assert result["spec_id"] == "123"
        mock_get.assert_called_once()

    @patch('predev_api.client.requests.get')
    def test_get_spec_status_authentication_error(self, mock_get):
        """Test get_spec_status with authentication error"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="invalid_key")
        with pytest.raises(AuthenticationError):
            client.get_spec_status("123")


class TestErrorHandling:
    """Test error handling"""

    @patch('predev_api.client.requests.post')
    def test_generic_api_error(self, mock_post):
        """Test generic API error"""
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.json.return_value = {"error": "Internal server error"}
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        with pytest.raises(PredevAPIError) as exc_info:
            client.fast_spec("Build a todo app")

        assert "500" in str(exc_info.value)

    @patch('predev_api.client.requests.post')
    def test_network_error(self, mock_post):
        """Test network error"""
        import requests
        mock_post.side_effect = requests.RequestException("Network error")

        client = PredevAPI(api_key="test_key")
        with pytest.raises(PredevAPIError) as exc_info:
            client.fast_spec("Build a todo app")

        assert "Request failed" in str(exc_info.value)
