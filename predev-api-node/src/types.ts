/**
 * Type definitions for the Pre.dev API client
 */

export interface PredevAPIConfig {
	apiKey: string;
	baseUrl?: string;
}

export type OutputFormat = "url" | "markdown";

export interface FastSpecOptions {
	input: string;
	outputFormat?: OutputFormat;
	currentContext?: string;
	docURLs?: string[];
	async?: boolean;
}

export interface DeepSpecOptions {
	input: string;
	outputFormat?: OutputFormat;
	currentContext?: string;
	docURLs?: string[];
	async?: boolean;
}

export interface SpecResponse {
	[key: string]: any;
}
