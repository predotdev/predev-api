/**
 * Tests for custom exceptions
 */

import { describe, it, expect } from 'vitest';
import { PredevAPIError, AuthenticationError, RateLimitError } from './exceptions';

describe('Exceptions', () => {
  describe('PredevAPIError', () => {
    it('should create error with message', () => {
      const error = new PredevAPIError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('PredevAPIError');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('AuthenticationError', () => {
    it('should create error with message', () => {
      const error = new AuthenticationError('Auth failed');
      expect(error.message).toBe('Auth failed');
      expect(error.name).toBe('AuthenticationError');
      expect(error).toBeInstanceOf(PredevAPIError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('RateLimitError', () => {
    it('should create error with message', () => {
      const error = new RateLimitError('Rate limit exceeded');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.name).toBe('RateLimitError');
      expect(error).toBeInstanceOf(PredevAPIError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
