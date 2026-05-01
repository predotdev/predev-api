/**
 * Custom exceptions for the Pre.dev API client
 */

/**
 * Base exception for Pre.dev API errors
 */
export class PredevAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PredevAPIError';
    Object.setPrototypeOf(this, PredevAPIError.prototype);
  }
}

/**
 * Exception raised when authentication fails
 */
export class AuthenticationError extends PredevAPIError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Exception raised when a request is rate-limited (HTTP 429,
 * `code: RATE_LIMITED`).
 */
export class RateLimitError extends PredevAPIError {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Browser-agent gating errors. The backend serializes these as a
 * `{ error, code, actionUrl? }` JSON body (HTTP 402 / 429 / 400) and as a
 * matching SSE `error` event when streaming. The SDK parses that body and
 * throws the right typed exception so callers can do:
 *
 *     try {
 *       await client.browserAgent(tasks);
 *     } catch (e) {
 *       if (e instanceof InsufficientCreditsError) {
 *         window.open(e.actionUrl);  // bounces user to credit-purchase modal
 *       } else if (e instanceof SubscriptionRequiredError) {
 *         window.open(e.actionUrl);  // bounces user to subscribe modal
 *       }
 *     }
 *
 * `actionUrl`, when present, is a deep link back to pre.dev that auto-opens
 * the right billing modal (e.g. `?upgrade=credits` or `?upgrade=subscribe`).
 */

/** HTTP 402 — user's trial is exhausted; the API key needs an active subscription. */
export class SubscriptionRequiredError extends PredevAPIError {
  /** Deep link to pre.dev that auto-opens the subscribe modal. */
  actionUrl?: string;
  constructor(message: string, actionUrl?: string) {
    super(message);
    this.name = 'SubscriptionRequiredError';
    this.actionUrl = actionUrl;
    Object.setPrototypeOf(this, SubscriptionRequiredError.prototype);
  }
}

/** HTTP 402 — subscription is fine, but the user is out of credits. */
export class InsufficientCreditsError extends PredevAPIError {
  /** Deep link to pre.dev that auto-opens the credit-purchase modal. */
  actionUrl?: string;
  constructor(message: string, actionUrl?: string) {
    super(message);
    this.name = 'InsufficientCreditsError';
    this.actionUrl = actionUrl;
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}

/** HTTP 429 — too many in-flight tasks for this user. Wait for the queue to drain. */
export class QueueFullError extends PredevAPIError {
  constructor(message: string) {
    super(message);
    this.name = 'QueueFullError';
    Object.setPrototypeOf(this, QueueFullError.prototype);
  }
}

/** HTTP 400 — request had more tasks than the per-batch maximum. */
export class BatchTooLargeError extends PredevAPIError {
  constructor(message: string) {
    super(message);
    this.name = 'BatchTooLargeError';
    Object.setPrototypeOf(this, BatchTooLargeError.prototype);
  }
}

/**
 * Map a `code` string from the API's structured error body to the right
 * typed exception. Falls back to `PredevAPIError` for unknown codes so
 * callers that just want `e.message` keep working.
 */
export function exceptionForCode(
  code: string | undefined,
  message: string,
  actionUrl?: string,
): PredevAPIError {
  switch (code) {
    case 'SUBSCRIPTION_REQUIRED':
      return new SubscriptionRequiredError(message, actionUrl);
    case 'INSUFFICIENT_CREDITS':
      return new InsufficientCreditsError(message, actionUrl);
    case 'QUEUE_FULL':
      return new QueueFullError(message);
    case 'BATCH_TOO_LARGE':
      return new BatchTooLargeError(message);
    case 'RATE_LIMITED':
      return new RateLimitError(message);
    default:
      return new PredevAPIError(message);
  }
}
