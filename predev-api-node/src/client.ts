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
	BrowserTask,
	BrowserTasksResponse,
	BrowserTaskSSEMessage,
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
	 * Run browser automation tasks — scrape data, fill forms, navigate pages.
	 *
	 * Always pass an array of tasks (even for a single task). Each task has a URL
	 * and optional instruction, input data, and output schema.
	 *
	 * @param tasks - Array of tasks to run
	 * @param options - Options for execution
	 * @param options.concurrency - Number of parallel browsers (default 5, max 20)
	 * @returns Promise resolving to batch result with per-task results
	 *
	 * @example
	 * ```typescript
	 * // Single scrape
	 * const result = await client.browserTasks([
	 *   { url: 'https://example.com', output: { type: 'object', properties: { heading: { type: 'string' } } } }
	 * ]);
	 *
	 * // Batch with concurrency
	 * const result = await client.browserTasks([
	 *   { url: 'https://a.com', instruction: 'Extract pricing', output: { ... } },
	 *   { url: 'https://b.com', instruction: 'Fill contact form', input: { name: 'Alice' } },
	 * ], { concurrency: 10 });
	 *
	 * console.log(result.results[0].data);       // extracted data
	 * console.log(result.results[0].creditsUsed); // credits charged
	 *
	 * // Stream mode — pass stream: true to get real-time SSE events
	 * for await (const msg of client.browserTasks([
	 *   { url: 'https://example.com', output: { type: 'object', properties: { heading: { type: 'string' } } } }
	 * ], { stream: true })) {
	 *   if (msg.event === 'task_event') console.log(`[${msg.data.type}]`, msg.data.data);
	 *   if (msg.event === 'done') console.log('Done:', msg.data.totalCreditsUsed, 'credits');
	 * }
	 * ```
	 */
	browserTasks(
		tasks: BrowserTask[],
		options: { concurrency?: number; stream: true; async?: boolean }
	): AsyncGenerator<BrowserTaskSSEMessage>;
	browserTasks(
		tasks: BrowserTask[],
		options?: { concurrency?: number; stream?: false; async?: boolean }
	): Promise<BrowserTasksResponse>;
	browserTasks(
		tasks: BrowserTask[],
		options?: { concurrency?: number; stream?: boolean; async?: boolean }
	): Promise<BrowserTasksResponse> | AsyncGenerator<BrowserTaskSSEMessage> {
		if (options?.stream) {
			return this._browserTasksStream(tasks, options);
		}

		const url = `${this.baseUrl}/api/v1/browser-tasks`;

		return (async () => {
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: this.headers,
					body: JSON.stringify({
						tasks,
						concurrency: options?.concurrency,
						async: options?.async,
					}),
				});

				return this.handleResponse(response) as unknown as Promise<BrowserTasksResponse>;
			} catch (error) {
				if (error instanceof PredevAPIError) {
					throw error;
				}
				throw new PredevAPIError(
					`Request failed: ${error instanceof Error ? error.message : String(error)}`
				);
			}
		})();
	}

	/**
	 * Get the status + results of a browser tasks batch by ID.
	 * Works for both in-progress and completed batches — use with async: true submissions
	 * to poll for progress. Pass includeEvents=true to get the full timeline (screenshots,
	 * plans, actions, validations) for each task.
	 */
	async getBrowserTasks(
		id: string,
		options?: { includeEvents?: boolean }
	): Promise<BrowserTasksResponse> {
		const qs = options?.includeEvents ? "?includeEvents=true" : "";
		const url = `${this.baseUrl}/api/v1/browser-tasks/${id}${qs}`;
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.headers,
			});
			return this.handleResponse(response) as unknown as Promise<BrowserTasksResponse>;
		} catch (error) {
			if (error instanceof PredevAPIError) throw error;
			throw new PredevAPIError(
				`Request failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	/** @private SSE streaming implementation */
	private async *_browserTasksStream(
		tasks: BrowserTask[],
		options?: { concurrency?: number }
	): AsyncGenerator<BrowserTaskSSEMessage> {
		const url = `${this.baseUrl}/api/v1/browser-tasks`;

		const response = await fetch(url, {
			method: "POST",
			headers: this.headers,
			body: JSON.stringify({
				tasks,
				concurrency: options?.concurrency,
				stream: true,
			}),
		});

		if (!response.ok) {
			if (response.status === 401) throw new AuthenticationError("Invalid API key");
			if (response.status === 429) throw new RateLimitError("Rate limit exceeded");
			const text = await response.text().catch(() => `HTTP ${response.status}`);
			throw new PredevAPIError(`API request failed with status ${response.status}: ${text}`);
		}

		const reader = response.body?.getReader();
		if (!reader) throw new PredevAPIError("No response body");

		const decoder = new TextDecoder();
		let buffer = "";

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";

				let currentEvent = "";
				for (const line of lines) {
					if (line.startsWith("event: ")) {
						currentEvent = line.slice(7).trim();
					} else if (line.startsWith("data: ") && currentEvent) {
						const data = JSON.parse(line.slice(6));
						yield { event: currentEvent, data } as BrowserTaskSSEMessage;
						currentEvent = "";
					}
				}
			}
		} finally {
			reader.releaseLock();
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
