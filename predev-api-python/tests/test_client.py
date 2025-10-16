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
    def test_fast_spec_with_markdown_format(self, mock_post):
        """Test fast_spec with markdown output format"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"markdown": "# Spec content"}
        mock_post.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.fast_spec("Build a todo app", output_format="markdown")

        # Check that the payload includes the correct output format
        call_args = mock_post.call_args
        assert call_args[1]["json"]["outputFormat"] == "markdown"

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


class TestListSpecs:
    """Test list_specs method"""

    @patch('predev_api.client.requests.get')
    def test_list_specs_success(self, mock_get):
        """Test successful list_specs call"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "specs": [
                {"_id": "1", "input": "Build a todo app", "status": "completed"},
                {"_id": "2", "input": "Build an ERP system", "status": "processing"}
            ],
            "total": 42,
            "hasMore": True
        }
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.list_specs()

        assert result["total"] == 42
        assert result["hasMore"] is True
        assert len(result["specs"]) == 2
        mock_get.assert_called_once()

    @patch('predev_api.client.requests.get')
    def test_list_specs_with_filters(self, mock_get):
        """Test list_specs with filters"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "specs": [{"_id": "1", "input": "Build a todo app", "status": "completed"}],
            "total": 1,
            "hasMore": False
        }
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.list_specs(
            status='completed',
            endpoint='fast_spec',
            limit=10,
            skip=5
        )

        # Check that the params were passed correctly
        call_args = mock_get.call_args
        assert call_args[1]["params"]["status"] == "completed"
        assert call_args[1]["params"]["endpoint"] == "fast_spec"
        assert call_args[1]["params"]["limit"] == 10
        assert call_args[1]["params"]["skip"] == 5

    @patch('predev_api.client.requests.get')
    def test_list_specs_authentication_error(self, mock_get):
        """Test list_specs with authentication error"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="invalid_key")
        with pytest.raises(AuthenticationError):
            client.list_specs()


class TestFindSpecs:
    """Test find_specs method"""

    @patch('predev_api.client.requests.get')
    def test_find_specs_success(self, mock_get):
        """Test successful find_specs call"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "specs": [
                {"_id": "1", "input": "Build a payment system", "status": "completed"}
            ],
            "total": 1,
            "hasMore": False
        }
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.find_specs(query='payment')

        assert result["total"] == 1
        assert len(result["specs"]) == 1
        mock_get.assert_called_once()

    @patch('predev_api.client.requests.get')
    def test_find_specs_with_regex_pattern(self, mock_get):
        """Test find_specs with regex pattern"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "specs": [
                {"_id": "1", "input": "Build a todo app", "status": "completed"},
                {"_id": "2", "input": "Build an ERP system", "status": "completed"}
            ],
            "total": 2,
            "hasMore": False
        }
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="test_key")
        result = client.find_specs(
            query='^Build',
            status='completed',
            limit=20
        )

        # Check that the params were passed correctly
        call_args = mock_get.call_args
        assert call_args[1]["params"]["query"] == "^Build"
        assert call_args[1]["params"]["status"] == "completed"
        assert call_args[1]["params"]["limit"] == 20

    @patch('predev_api.client.requests.get')
    def test_find_specs_authentication_error(self, mock_get):
        """Test find_specs with authentication error"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_get.return_value = mock_response

        client = PredevAPI(api_key="invalid_key")
        with pytest.raises(AuthenticationError):
            client.find_specs(query='test')


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
