/**
 * Client for the Pre.dev Architect API
 */

import type {
	PredevAPIConfig,
	OutputFormat,
	SpecResponse,
	AsyncResponse,
	ErrorResponse,
} from "./types";
import {
	PredevAPIError,
	AuthenticationError,
	RateLimitError,
} from "./exceptions";

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
	private headers: Record<string, string>;

	/**
	 * Create a new Pre.dev API client
	 *
	 * @param config - Configuration options
	 * @param config.apiKey - Your API key from pre.dev settings
	 * @param config.baseUrl - Base URL for the API (default: https://api.pre.dev)
	 */
	constructor(config: PredevAPIConfig) {
		this.apiKey = config.apiKey;
		this.baseUrl = config.baseUrl?.replace(/\/$/, "") || "https://api.pre.dev";

		// Set up headers with x-api-key
		this.headers = {
			"x-api-key": this.apiKey,
			"Content-Type": "application/json",
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
	}): Promise<SpecResponse> {
		return this.makeRequest(
			"/fast-spec",
			options.input,
			options.outputFormat || "url",
			options.currentContext,
			options.docURLs
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
	}): Promise<SpecResponse> {
		return this.makeRequest(
			"/deep-spec",
			options.input,
			options.outputFormat || "url",
			options.currentContext,
			options.docURLs
		);
	}

	/**
	 * Generate a fast specification asynchronously for your project.
	 *
	 * Perfect for MVPs and prototypes with balanced depth and speed.
	 * Returns immediately with a request ID for polling the status.
	 *
	 * @param options - Options for generating the spec
	 * @param options.input - Description of the project or feature to generate specs for
	 * @param options.outputFormat - Format of the output - "url" or "markdown" (default: "url")
	 * @param options.currentContext - Existing project/codebase context. When omitted, generates full new project spec. When provided, generates feature addition spec.
	 * @param options.docURLs - Array of documentation URLs to reference (e.g., API docs, design systems)
	 * @returns Promise resolving to an AsyncResponse with specId for polling
	 *
	 * @throws {AuthenticationError} If authentication fails
	 * @throws {RateLimitError} If rate limit is exceeded
	 * @throws {PredevAPIError} For other API errors
	 *
	 * @example
	 * ```typescript
	 * const result = await client.fastSpecAsync({
	 *   input: 'Build a task management app with team collaboration',
	 *   outputFormat: 'url'
	 * });
	 * // Poll for status using result.specId
	 * const status = await client.getSpecStatus(result.specId);
	 * ```
	 */
	async fastSpecAsync(options: {
		input: string;
		outputFormat?: OutputFormat;
		currentContext?: string;
		docURLs?: string[];
	}): Promise<AsyncResponse> {
		return this.makeRequestAsync(
			"/fast-spec",
			options.input,
			options.outputFormat || "url",
			options.currentContext,
			options.docURLs
		);
	}

	/**
	 * Generate a deep specification asynchronously for your project.
	 *
	 * Ultra-detailed specifications for complex systems with enterprise-grade depth
	 * and comprehensive analysis. Returns immediately with a request ID for polling the status.
	 *
	 * @param options - Options for generating the spec
	 * @param options.input - Description of the project or feature to generate specs for
	 * @param options.outputFormat - Format of the output - "url" or "markdown" (default: "url")
	 * @param options.currentContext - Existing project/codebase context. When omitted, generates full new project spec. When provided, generates feature addition spec.
	 * @param options.docURLs - Array of documentation URLs to reference (e.g., API docs, design systems)
	 * @returns Promise resolving to an AsyncResponse with specId for polling
	 *
	 * @throws {AuthenticationError} If authentication fails
	 * @throws {RateLimitError} If rate limit is exceeded
	 * @throws {PredevAPIError} For other API errors
	 *
	 * @example
	 * ```typescript
	 * const result = await client.deepSpecAsync({
	 *   input: 'Build an enterprise resource planning system',
	 *   outputFormat: 'url'
	 * });
	 * // Poll for status using result.specId
	 * const status = await client.getSpecStatus(result.specId);
	 * ```
	 */
	async deepSpecAsync(options: {
		input: string;
		outputFormat?: OutputFormat;
		currentContext?: string;
		docURLs?: string[];
	}): Promise<AsyncResponse> {
		return this.makeRequestAsync(
			"/deep-spec",
			options.input,
			options.outputFormat || "url",
			options.currentContext,
			options.docURLs
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
		const url = `${this.baseUrl}/spec-status/${specId}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.headers,
			});

			return this.handleResponse(response) as Promise<SpecResponse>;
		} catch (error) {
			if (error instanceof PredevAPIError) {
				throw error;
			}
			throw new PredevAPIError(
				`Request failed: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
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
		docURLs?: string[]
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

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.headers,
				body: JSON.stringify(payload),
			});

			return this.handleResponse(response) as unknown as SpecResponse;
		} catch (error) {
			if (error instanceof PredevAPIError) {
				throw error;
			}
			throw new PredevAPIError(
				`Request failed: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	/**
	 * Make an async POST request to the API
	 * @private
	 */
	private async makeRequestAsync(
		endpoint: string,
		input: string,
		outputFormat: OutputFormat,
		currentContext?: string,
		docURLs?: string[]
	): Promise<AsyncResponse> {
		const url = `${this.baseUrl}${endpoint}`;
		const payload: Record<string, any> = {
			input,
			outputFormat,
			async: true,
		};

		if (currentContext !== undefined) {
			payload.currentContext = currentContext;
		}

		if (docURLs !== undefined) {
			payload.docURLs = docURLs;
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: this.headers,
				body: JSON.stringify(payload),
			});

			return this.handleResponse(response) as unknown as AsyncResponse;
		} catch (error) {
			if (error instanceof PredevAPIError) {
				throw error;
			}
			throw new PredevAPIError(
				`Request failed: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}

	/**
	 * Handle API response and raise appropriate exceptions
	 * @private
	 */
	private async handleResponse(
		response: Response
	): Promise<SpecResponse | AsyncResponse> {
		if (response.ok) {
			return (await response.json()) as SpecResponse | AsyncResponse;
		}

		if (response.status === 401) {
			throw new AuthenticationError("Invalid API key");
		}

		if (response.status === 429) {
			throw new RateLimitError("Rate limit exceeded");
		}

		let errorMessage = "Unknown error";
		try {
			const errorData = (await response.json()) as ErrorResponse;
			errorMessage =
				errorData.error || errorData.message || JSON.stringify(errorData);
		} catch {
			const textError = await response.text();
			errorMessage = textError || errorMessage;
		}

		throw new PredevAPIError(
			`API request failed with status ${response.status}: ${errorMessage}`
		);
	}
}
