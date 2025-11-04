/**
 * Client for the Pre.dev Architect API
 */

import type {
	PredevAPIConfig,
	SpecResponse,
	AsyncResponse,
	ErrorResponse,
	ListSpecsParams,
	FindSpecsParams,
	ListSpecsResponse,
	File,
	SpecGenOptions,
	CreditsBalanceResponse,
} from "./types.js";
import {
	PredevAPIError,
	AuthenticationError,
	RateLimitError,
} from "./exceptions.js";

/**
 * Client for interacting with the Pre.dev Architect API.
 *
 * The API offers two main endpoints:
 * - Fast Spec: Generate comprehensive specs quickly (ideal for MVPs and prototypes)
 * - Deep Spec: Generate ultra-detailed specs for complex systems (enterprise-grade depth)
 *
 * File Upload Support:
 * - Browser/Web: Pass File or Blob objects directly
 * - Node.js: Pass {data: Buffer, name: string} objects
 * - Both environments automatically handle multipart/form-data encoding
 *
 * @example
 * ```typescript
 * import { PredevAPI } from 'predev-api';
 *
 * // Web/Browser usage
 * const client = new PredevAPI({ apiKey: 'your_api_key' });
 * const fileInput = document.querySelector('input[type="file"]');
 * const result = await client.fastSpec({
 *   input: 'Build a task management app',
 *   file: fileInput.files[0]  // Pass File directly
 * });
 *
 * // Node.js usage
 * import fs from 'fs';
 * const result = await client.fastSpec({
 *   input: 'Build based on these requirements',
 *   file: {
 *     data: fs.readFileSync('requirements.pdf'),
 *     name: 'requirements.pdf'
 *   }
 * });
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

		// Set up headers with Authorization Bearer token
		this.headers = {
			Authorization: `Bearer ${this.apiKey}`,
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
	 * @param options.currentContext - Existing project/codebase context. When omitted, generates full new project spec. When provided, generates feature addition spec.
	 * @param options.docURLs - Array of documentation URLs to reference (e.g., API docs, design systems)
	 * @param options.file - Optional file to upload (Blob in browsers, or {data: Buffer, name: string} in Node.js)
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
	 *   file: blob // Browser: File or Blob; Node.js: {data: Buffer, name: string}
	 * });
	 * ```
	 */
	async fastSpec(options: SpecGenOptions): Promise<SpecResponse> {
		return this.makeRequest(
			"/fast-spec",
			options.input,
			options.currentContext,
			options.docURLs,
			options.file
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
	 * @param options.currentContext - Existing project/codebase context. When omitted, generates full new project spec. When provided, generates feature addition spec.
	 * @param options.docURLs - Array of documentation URLs to reference (e.g., API docs, design systems)
	 * @param options.file - Optional file to upload (Blob in browsers, or {data: Buffer, name: string} in Node.js)
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
	 *   file: blob // Browser: File or Blob; Node.js: {data: Buffer, name: string}
	 * });
	 * ```
	 */
	async deepSpec(options: SpecGenOptions): Promise<SpecResponse> {
		return this.makeRequest(
			"/deep-spec",
			options.input,
			options.currentContext,
			options.docURLs,
			options.file
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
	 *   input: 'Build a task management app with team collaboration'
	 * });
	 * // Poll for status using result.specId
	 * const status = await client.getSpecStatus(result.specId);
	 * ```
	 */
	async fastSpecAsync(options: SpecGenOptions): Promise<AsyncResponse> {
		return this.makeRequestAsync(
			"/fast-spec",
			options.input,
			options.currentContext,
			options.docURLs,
			options.file
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
	 *   input: 'Build an enterprise resource planning system'
	 * });
	 * // Poll for status using result.specId
	 * const status = await client.getSpecStatus(result.specId);
	 * ```
	 */
	async deepSpecAsync(options: SpecGenOptions): Promise<AsyncResponse> {
		return this.makeRequestAsync(
			"/deep-spec",
			options.input,
			options.currentContext,
			options.docURLs,
			options.file
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
	 * List all specs with optional filtering and pagination.
	 *
	 * @param params - Query parameters for filtering and pagination
	 * @param params.limit - Results per page (1-100, default: 20)
	 * @param params.skip - Offset for pagination (default: 0)
	 * @param params.endpoint - Filter by endpoint: "fast_spec" or "deep_spec"
	 * @param params.status - Filter by status: "pending", "processing", "completed", or "failed"
	 * @returns Promise resolving to list of specs with metadata
	 *
	 * @throws {AuthenticationError} If authentication fails
	 * @throws {PredevAPIError} For other API errors
	 *
	 * @example
	 * ```typescript
	 * // Get first 20 specs
	 * const result = await client.listSpecs();
	 *
	 * // Get completed specs only
	 * const completed = await client.listSpecs({ status: 'completed' });
	 *
	 * // Paginate: get specs 20-40
	 * const page2 = await client.listSpecs({ skip: 20, limit: 20 });
	 * ```
	 */
	async listSpecs(params?: ListSpecsParams): Promise<ListSpecsResponse> {
		const queryParams = new URLSearchParams();

		if (params?.limit !== undefined) {
			queryParams.append("limit", params.limit.toString());
		}
		if (params?.skip !== undefined) {
			queryParams.append("skip", params.skip.toString());
		}
		if (params?.endpoint !== undefined) {
			queryParams.append("endpoint", params.endpoint);
		}
		if (params?.status !== undefined) {
			queryParams.append("status", params.status);
		}

		const queryString = queryParams.toString();
		const url = `${this.baseUrl}/list-specs${
			queryString ? `?${queryString}` : ""
		}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.headers,
			});

			return this.handleResponse(response) as Promise<ListSpecsResponse>;
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
	 * Search for specs using regex patterns.
	 *
	 * @param params - Query parameters for searching
	 * @param params.query - REQUIRED - Regex pattern (case-insensitive)
	 * @param params.limit - Results per page (1-100, default: 20)
	 * @param params.skip - Offset for pagination (default: 0)
	 * @param params.endpoint - Filter by endpoint: "fast_spec" or "deep_spec"
	 * @param params.status - Filter by status: "pending", "processing", "completed", or "failed"
	 * @returns Promise resolving to matching specs with metadata
	 *
	 * @throws {AuthenticationError} If authentication fails
	 * @throws {PredevAPIError} For other API errors
	 *
	 * @example
	 * ```typescript
	 * // Search for "payment" specs
	 * const result = await client.findSpecs({ query: 'payment' });
	 *
	 * // Search for specs starting with "Build"
	 * const builds = await client.findSpecs({ query: '^Build' });
	 *
	 * // Search: only completed specs mentioning "auth"
	 * const auth = await client.findSpecs({ query: 'auth', status: 'completed' });
	 * ```
	 */
	async findSpecs(params: FindSpecsParams): Promise<ListSpecsResponse> {
		const queryParams = new URLSearchParams();

		queryParams.append("query", params.query);

		if (params.limit !== undefined) {
			queryParams.append("limit", params.limit.toString());
		}
		if (params.skip !== undefined) {
			queryParams.append("skip", params.skip.toString());
		}
		if (params.endpoint !== undefined) {
			queryParams.append("endpoint", params.endpoint);
		}
		if (params.status !== undefined) {
			queryParams.append("status", params.status);
		}

		const url = `${this.baseUrl}/find-specs?${queryParams.toString()}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.headers,
			});

			return this.handleResponse(response) as Promise<ListSpecsResponse>;
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
	 * Get the current credits balance for the API key.
	 *
	 * @returns Promise resolving to the API response with credits balance
	 *
	 * @throws {AuthenticationError} If authentication fails
	 * @throws {PredevAPIError} For other API errors
	 *
	 * @example
	 * ```typescript
	 * const balance = await client.getCreditsBalance();
	 * console.log(balance);
	 * ```
	 */
	async getCreditsBalance(): Promise<CreditsBalanceResponse> {
		const url = `${this.baseUrl}/credits-balance`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.headers,
			});

			return this.handleResponse(response) as Promise<CreditsBalanceResponse>;
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
		currentContext?: string,
		docURLs?: string[],
		file?: File
	): Promise<SpecResponse> {
		const url = `${this.baseUrl}${endpoint}`;

		if (file) {
			return this.makeRequestWithFile(
				url,
				input,
				currentContext,
				docURLs,
				file
			);
		}

		const payload: Record<string, any> = {
			input,
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
		currentContext?: string,
		docURLs?: string[],
		file?: File
	): Promise<AsyncResponse> {
		const url = `${this.baseUrl}${endpoint}`;

		if (file) {
			return this.makeRequestWithFileAsync(
				url,
				input,
				currentContext,
				docURLs,
				file
			);
		}

		const payload: Record<string, any> = {
			input,
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

	private async makeRequestWithFile(
		url: string,
		input: string,
		currentContext: string | undefined,
		docURLs: string[] | undefined,
		file: File
	): Promise<SpecResponse> {
		const formData = new FormData();
		formData.append("input", input);

		if (currentContext !== undefined) {
			formData.append("currentContext", currentContext);
		}

		if (docURLs !== undefined) {
			formData.append("docURLs", JSON.stringify(docURLs));
		}

		const fileToUpload = await this.normalizeFile(file);
		formData.append("file", fileToUpload, this.getFileName(file));

		const headers: Record<string, string> = {
			Authorization: this.headers.Authorization,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers,
				body: formData,
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

	private async makeRequestWithFileAsync(
		url: string,
		input: string,
		currentContext: string | undefined,
		docURLs: string[] | undefined,
		file: File
	): Promise<AsyncResponse> {
		const formData = new FormData();
		formData.append("input", input);
		formData.append("async", "true");

		if (currentContext !== undefined) {
			formData.append("currentContext", currentContext);
		}

		if (docURLs !== undefined) {
			formData.append("docURLs", JSON.stringify(docURLs));
		}

		const fileToUpload = await this.normalizeFile(file);
		formData.append("file", fileToUpload, this.getFileName(file));

		const headers: Record<string, string> = {
			Authorization: this.headers.Authorization,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers,
				body: formData,
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

	private async normalizeFile(file: File): Promise<Blob> {
		if (file instanceof Blob) {
			return file;
		}
		return new Blob([file.data], { type: "application/octet-stream" });
	}

	private getFileName(file: File): string {
		if (file instanceof Blob && file.type) {
			const ext = file.type === "application/pdf" ? ".pdf" : ".txt";
			return `upload${ext}`;
		}
		return (file as any).name || "upload.txt";
	}

	/**
	 * Handle API response and raise appropriate exceptions
	 * @private
	 */
	private async handleResponse(
		response: Response
	): Promise<
		SpecResponse | AsyncResponse | ListSpecsResponse | CreditsBalanceResponse
	> {
		if (response.ok) {
			return (await response.json()) as
				| SpecResponse
				| AsyncResponse
				| ListSpecsResponse
				| CreditsBalanceResponse;
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
			try {
				const textError = await response.text();
				errorMessage = textError || errorMessage;
			} catch {
				errorMessage = `HTTP ${response.status}`;
			}
		}

		throw new PredevAPIError(
			`API request failed with status ${response.status}: ${errorMessage}`
		);
	}
}
