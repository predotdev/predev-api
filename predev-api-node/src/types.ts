/**
 * Type definitions for the Pre.dev API client
 */

export interface PredevAPIConfig {
	apiKey: string;
	baseUrl?: string;
}

export type OutputFormat = "url" | "markdown";

export interface SpecGenOptions {
	input: string;
	outputFormat?: OutputFormat;
	currentContext?: string;
	docURLs?: string[];
	async?: boolean;
}

// Async mode response interfaces
export interface AsyncSpecResponse {
	specId: string;
	status: "pending" | "processing" | "completed" | "failed";
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
	output?: any;
	outputFormat: "markdown" | "url";
	outputFileUrl?: string;
	executionTime?: number;

	predevUrl?: string;
	lovableUrl?: string;
	cursorUrl?: string;
	v0Url?: string;
	boltUrl?: string;

	errorMessage?: string;
	progress?: string;
}

// Error response interface
export interface ErrorResponse {
	error: string;
	message: string;
}
