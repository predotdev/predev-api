/**
 * Client for the Pre.dev Architect API
 */

import type {
  PredevAPIConfig,
  OutputFormat,
  SpecResponse,
} from './types';
import { PredevAPIError, AuthenticationError, RateLimitError } from './exceptions';

/**
 * Client for interacting with the Pre.dev Architect API.
 * 
 * The API offers two main endpoints:
 * - Fast Spec: Generate comprehensive specs quickly (ideal for MVPs and prototypes)
 * - Deep Spec: Generate ultra-detailed specs for complex systems (enterprise-grade depth)
 * 
 * @example
 * ```typescript
 * import { PredevAPI } from 'predev-api';
 * 
 * const client = new PredevAPI({ apiKey: 'your_api_key' });
 * const result = await client.fastSpec({ input: 'Build a task management app' });
 * console.log(result);
 * ```
 */
export class PredevAPI {
  private apiKey: string;
  private baseUrl: string;
  private enterprise: boolean;
  private headers: Record<string, string>;

  /**
   * Create a new Pre.dev API client
   * 
   * @param config - Configuration options
   * @param config.apiKey - Your API key from pre.dev settings
   * @param config.enterprise - Whether to use enterprise authentication (default: false)
   * @param config.baseUrl - Base URL for the API (default: https://api.pre.dev)
   */
  constructor(config: PredevAPIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') || 'https://api.pre.dev';
    this.enterprise = config.enterprise || false;

    // Set up headers based on authentication type
    const headerKey = this.enterprise ? 'x-enterprise-api-key' : 'x-api-key';
    this.headers = {
      [headerKey]: this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generate a fast specification for your project.
   * 
   * Perfect for MVPs and prototypes with balanced depth and speed.
   * 
   * @param options - Options for generating the spec
   * @param options.input - Description of the project or feature to generate specs for
   * @param options.outputFormat - Format of the output - "url" or "markdown" (default: "url")
   * @param options.currentContext - Existing project/codebase context. When omitted, generates full new project spec. When provided, generates feature addition spec.
   * @param options.docURLs - Array of documentation URLs to reference (e.g., API docs, design systems)
   * @param options.async - If true, returns immediately with requestId for polling
   * @returns Promise resolving to the API response
   * 
   * @throws {AuthenticationError} If authentication fails
   * @throws {RateLimitError} If rate limit is exceeded
   * @throws {PredevAPIError} For other API errors
   * 
   * @example
   * ```typescript
   * const result = await client.fastSpec({
   *   input: 'Build a task management app with team collaboration',
   *   outputFormat: 'url'
   * });
   * ```
   */
  async fastSpec(options: {
    input: string;
    outputFormat?: OutputFormat;
    currentContext?: string;
    docURLs?: string[];
    async?: boolean;
  }): Promise<SpecResponse> {
    return this.makeRequest(
      '/api/fast-spec',
      options.input,
      options.outputFormat || 'url',
      options.currentContext,
      options.docURLs,
      options.async
    );
  }

  /**
   * Generate a deep specification for your project.
   * 
   * Ultra-detailed specifications for complex systems with enterprise-grade depth
   * and comprehensive analysis.
   * 
   * @param options - Options for generating the spec
   * @param options.input - Description of the project or feature to generate specs for
   * @param options.outputFormat - Format of the output - "url" or "markdown" (default: "url")
   * @param options.currentContext - Existing project/codebase context. When omitted, generates full new project spec. When provided, generates feature addition spec.
   * @param options.docURLs - Array of documentation URLs to reference (e.g., API docs, design systems)
   * @param options.async - If true, returns immediately with requestId for polling
   * @returns Promise resolving to the API response
   * 
   * @throws {AuthenticationError} If authentication fails
   * @throws {RateLimitError} If rate limit is exceeded
   * @throws {PredevAPIError} For other API errors
   * 
   * @example
   * ```typescript
   * const result = await client.deepSpec({
   *   input: 'Build an enterprise resource planning system',
   *   outputFormat: 'url'
   * });
   * ```
   */
  async deepSpec(options: {
    input: string;
    outputFormat?: OutputFormat;
    currentContext?: string;
    docURLs?: string[];
    async?: boolean;
  }): Promise<SpecResponse> {
    return this.makeRequest(
      '/api/deep-spec',
      options.input,
      options.outputFormat || 'url',
      options.currentContext,
      options.docURLs,
      options.async
    );
  }

  /**
   * Get the status of an async specification generation request.
   * 
   * @param specId - The ID of the specification request
   * @returns Promise resolving to the API response with status information
   * 
   * @throws {AuthenticationError} If authentication fails
   * @throws {PredevAPIError} For other API errors
   * 
   * @example
   * ```typescript
   * const status = await client.getSpecStatus('spec_123');
   * console.log(status);
   * ```
   */
  async getSpecStatus(specId: string): Promise<SpecResponse> {
    const url = `${this.baseUrl}/api/spec-status/${specId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof PredevAPIError) {
        throw error;
      }
      throw new PredevAPIError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Make a POST request to the API
   * @private
   */
  private async makeRequest(
    endpoint: string,
    input: string,
    outputFormat: OutputFormat,
    currentContext?: string,
    docURLs?: string[],
    asyncMode?: boolean
  ): Promise<SpecResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    const payload: Record<string, any> = {
      input,
      outputFormat,
    };

    if (currentContext !== undefined) {
      payload.currentContext = currentContext;
    }

    if (docURLs !== undefined) {
      payload.docURLs = docURLs;
    }

    if (asyncMode) {
      payload.async = true;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof PredevAPIError) {
        throw error;
      }
      throw new PredevAPIError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle API response and raise appropriate exceptions
   * @private
   */
  private async handleResponse(response: Response): Promise<SpecResponse> {
    if (response.ok) {
      return (await response.json()) as SpecResponse;
    }

    if (response.status === 401) {
      throw new AuthenticationError('Invalid API key');
    }

    if (response.status === 429) {
      throw new RateLimitError('Rate limit exceeded');
    }

    let errorMessage = 'Unknown error';
    try {
      const errorData = (await response.json()) as { error?: string };
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = (await response.text()) || errorMessage;
    }

    throw new PredevAPIError(
      `API request failed with status ${response.status}: ${errorMessage}`
    );
  }
}
