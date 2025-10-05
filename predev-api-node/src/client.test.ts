/**
 * Tests for the PredevAPI client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PredevAPI } from './client';
import { PredevAPIError, AuthenticationError, RateLimitError } from './exceptions';

// Mock the global fetch function
global.fetch = vi.fn();

describe('PredevAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with solo authentication', () => {
      const client = new PredevAPI({ apiKey: 'test_key' });
      expect(client).toBeInstanceOf(PredevAPI);
    });

    it('should initialize with enterprise authentication', () => {
      const client = new PredevAPI({ apiKey: 'enterprise_key', enterprise: true });
      expect(client).toBeInstanceOf(PredevAPI);
    });

    it('should initialize with custom base URL', () => {
      const client = new PredevAPI({ apiKey: 'test_key', baseUrl: 'https://custom.api.com/' });
      expect(client).toBeInstanceOf(PredevAPI);
    });
  });

  describe('fastSpec', () => {
    it('should successfully generate a fast spec', async () => {
      const mockResponse = {
        spec_id: '123',
        url: 'https://example.com/spec',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      const result = await client.fastSpec({ input: 'Build a todo app' });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should generate fast spec with markdown format', async () => {
      const mockResponse = { markdown: '# Spec data' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      await client.fastSpec({ input: 'Build a todo app', outputFormat: 'markdown' });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.outputFormat).toBe('markdown');
    });

    it('should throw AuthenticationError on 401', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      const client = new PredevAPI({ apiKey: 'invalid_key' });
      
      await expect(
        client.fastSpec({ input: 'Build a todo app' })
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw RateLimitError on 429', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({}),
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      
      await expect(
        client.fastSpec({ input: 'Build a todo app' })
      ).rejects.toThrow(RateLimitError);
    });

    it('should throw PredevAPIError on other errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      
      await expect(
        client.fastSpec({ input: 'Build a todo app' })
      ).rejects.toThrow(PredevAPIError);
    });
  });

  describe('deepSpec', () => {
    it('should successfully generate a deep spec', async () => {
      const mockResponse = {
        spec_id: '456',
        url: 'https://example.com/deep-spec',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      const result = await client.deepSpec({ input: 'Build an ERP system' });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should generate deep spec with URL format', async () => {
      const mockResponse = { url: 'https://example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      await client.deepSpec({ input: 'Build an ERP system', outputFormat: 'url' });

      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/deep-spec');
    });
  });

  describe('getSpecStatus', () => {
    it('should successfully get spec status', async () => {
      const mockResponse = {
        status: 'completed',
        spec_id: '123',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      const result = await client.getSpecStatus('123');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw AuthenticationError on 401', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      const client = new PredevAPI({ apiKey: 'invalid_key' });
      
      await expect(
        client.getSpecStatus('123')
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const client = new PredevAPI({ apiKey: 'test_key' });
      
      await expect(
        client.fastSpec({ input: 'Build a todo app' })
      ).rejects.toThrow(PredevAPIError);
    });

    it('should handle error responses with message', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Custom error message' }),
      });

      const client = new PredevAPI({ apiKey: 'test_key' });
      
      await expect(
        client.fastSpec({ input: 'Build a todo app' })
      ).rejects.toThrow('Custom error message');
    });
  });
});
