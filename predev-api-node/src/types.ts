/**
 * Type definitions for the Pre.dev API client
 */

export interface PredevAPIConfig {
	apiKey: string;
	baseUrl?: string;
}

export interface SpecGenOptions {
	input: string;
	currentContext?: string;
	docURLs?: string[];
}

// Async mode response interfaces
export interface AsyncResponse {
	specId: string;
	status: "pending" | "processing" | "completed" | "failed";
}

export interface ZippedDocsUrl {
	platform: string;
	masterZipShortUrl: string;
}

// Status check response interface
export interface SpecResponse {
	_id?: string;
	created?: string;

	endpoint: "fast_spec" | "deep_spec";
	input: string;
	status: "pending" | "processing" | "completed" | "failed";
	success: boolean;

	uploadedFileShortUrl?: string;
	uploadedFileName?: string;
	codingAgentSpecUrl?: string;
	humanSpecUrl?: string;
	executionTime?: number;

	predevUrl?: string;
	lovableUrl?: string;
	cursorUrl?: string;
	v0Url?: string;
	boltUrl?: string;

	zippedDocsUrls?: ZippedDocsUrl[];

	errorMessage?: string;
	progress?: string;
}

// Error response interface
export interface ErrorResponse {
	error: string;
	message: string;
}

// List specs query parameters
export interface ListSpecsParams {
	limit?: number; // 1-100, default 20
	skip?: number; // default 0
	endpoint?: "fast_spec" | "deep_spec";
	status?: "pending" | "processing" | "completed" | "failed";
}

// Find specs query parameters
export interface FindSpecsParams {
	query: string; // REQUIRED - regex pattern
	limit?: number; // 1-100, default 20
	skip?: number; // default 0
	endpoint?: "fast_spec" | "deep_spec";
	status?: "pending" | "processing" | "completed" | "failed";
}

// List/Find specs response
export interface ListSpecsResponse {
	specs: SpecResponse[];
	total: number;
	hasMore: boolean;
}
