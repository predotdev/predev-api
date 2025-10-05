/**
 * Type definitions for the Pre.dev API client
 */

export interface PredevAPIConfig {
  apiKey: string;
  enterprise?: boolean;
  baseUrl?: string;
}

export type OutputFormat = 'url' | 'json';

export interface FastSpecOptions {
  input: string;
  outputFormat?: OutputFormat;
}

export interface DeepSpecOptions {
  input: string;
  outputFormat?: OutputFormat;
}

export interface SpecResponse {
  [key: string]: any;
}
