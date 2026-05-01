"""
Custom exceptions for the Pre.dev API client.

Browser-task gating errors carry the same shape as the Node SDK:
``code`` selects a typed exception, and ``action_url`` is a deep link
back to pre.dev that auto-opens the right billing modal (subscribe /
buy credits) when the user lands there. Older endpoints just return
``{"error": "..."}`` and surface as ``PredevAPIError``.
"""

from typing import Optional


class PredevAPIError(Exception):
    """Base exception for Pre.dev API errors."""
    pass


class AuthenticationError(PredevAPIError):
    """Raised when authentication fails (HTTP 401)."""
    pass


class RateLimitError(PredevAPIError):
    """Raised when a request is rate-limited (HTTP 429, ``code: RATE_LIMITED``)."""
    pass


class SubscriptionRequiredError(PredevAPIError):
    """HTTP 402, ``code: SUBSCRIPTION_REQUIRED``.

    Trial limit reached on this API key — the user needs an active
    subscription to keep running browser-agent tasks.

    ``action_url``, when present, is a deep link back to pre.dev that
    auto-opens the subscribe modal.
    """

    def __init__(self, message: str, action_url: Optional[str] = None):
        super().__init__(message)
        self.action_url = action_url


class InsufficientCreditsError(PredevAPIError):
    """HTTP 402, ``code: INSUFFICIENT_CREDITS``.

    Subscription is fine but the credit balance is too low to cover this
    request. ``action_url`` deep-links to the credit-purchase modal.
    """

    def __init__(self, message: str, action_url: Optional[str] = None):
        super().__init__(message)
        self.action_url = action_url


class QueueFullError(PredevAPIError):
    """HTTP 429, ``code: QUEUE_FULL`` — too many in-flight tasks for this user."""
    pass


class BatchTooLargeError(PredevAPIError):
    """HTTP 400, ``code: BATCH_TOO_LARGE`` — request had more tasks than the per-batch maximum."""
    pass


def exception_for_code(
    code: Optional[str],
    message: str,
    action_url: Optional[str] = None,
) -> PredevAPIError:
    """Map a structured error ``code`` to the right typed exception.

    Falls back to :class:`PredevAPIError` for unknown codes so callers
    that just want ``str(e)`` keep working.
    """
    if code == "SUBSCRIPTION_REQUIRED":
        return SubscriptionRequiredError(message, action_url)
    if code == "INSUFFICIENT_CREDITS":
        return InsufficientCreditsError(message, action_url)
    if code == "QUEUE_FULL":
        return QueueFullError(message)
    if code == "BATCH_TOO_LARGE":
        return BatchTooLargeError(message)
    if code == "RATE_LIMITED":
        return RateLimitError(message)
    return PredevAPIError(message)
