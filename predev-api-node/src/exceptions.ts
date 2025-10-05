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
 * Exception raised when rate limit is exceeded
 */
export class RateLimitError extends PredevAPIError {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
