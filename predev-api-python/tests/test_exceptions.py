"""
Tests for custom exceptions
"""

import pytest
from predev_api import PredevAPIError, AuthenticationError, RateLimitError


def test_predev_api_error():
    """Test PredevAPIError exception"""
    error = PredevAPIError("Test error")
    assert str(error) == "Test error"
    assert isinstance(error, Exception)


def test_authentication_error():
    """Test AuthenticationError exception"""
    error = AuthenticationError("Auth failed")
    assert str(error) == "Auth failed"
    assert isinstance(error, PredevAPIError)
    assert isinstance(error, Exception)


def test_rate_limit_error():
    """Test RateLimitError exception"""
    error = RateLimitError("Rate limit exceeded")
    assert str(error) == "Rate limit exceeded"
    assert isinstance(error, PredevAPIError)
    assert isinstance(error, Exception)
