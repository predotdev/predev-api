/**
 * Type definitions for the Pre.dev API client
 */

export type File = Blob | { data: Buffer; name: string };

export interface PredevAPIConfig {
	apiKey: string;
	baseUrl?: string;
}

export interface SpecCoreFunctionality {
	name: string;
	description: string;
	priority?: "High" | "Medium" | "Low";
}

export interface SpecTechStackItem {
	name: string;
	category: string;
}

export interface SpecPersona {
	title: string;
	description: string;
	primaryGoals?: string[];
	painPoints?: string[];
	keyTasks?: string[];
}

export interface SpecRole {
	name: string;
	shortHand: string;
}

export interface CodingAgentSubTask {
	id?: string;
	description: string;
	complexity: string;
}

export interface CodingAgentStory {
	id?: string;
	title: string;
	description?: string;
	acceptanceCriteria?: string[];
	complexity?: string;
	subTasks: CodingAgentSubTask[];
}

export interface CodingAgentMilestone {
	milestoneNumber: number;
	description: string;
	stories: CodingAgentStory[];
}

export interface CodingAgentSpecJson {
	title?: string;
	executiveSummary: string;
	coreFunctionalities: SpecCoreFunctionality[];
	techStack: SpecTechStackItem[];
	techStackGrouped: Record<string, string[]>;
	milestones: CodingAgentMilestone[];
}

export interface HumanSpecSubTask {
	id?: string;
	description: string;
	hours: number;
	complexity: string;
	roles?: SpecRole[];
}

export interface HumanSpecStory {
	id?: string;
	title: string;
	description?: string;
	acceptanceCriteria?: string[];
	hours: number;
	complexity?: string;
	subTasks: HumanSpecSubTask[];
}

export interface HumanSpecMilestone {
	milestoneNumber: number;
	description: string;
	hours: number;
	stories: HumanSpecStory[];
}

export interface HumanSpecJson {
	title?: string;
	executiveSummary: string;
	coreFunctionalities: SpecCoreFunctionality[];
	personas: SpecPersona[];
	techStack: SpecTechStackItem[];
	techStackGrouped: Record<string, string[]>;
	milestones: HumanSpecMilestone[];
	totalHours: number;
	roles: SpecRole[];
}

export interface SpecGenOptions {
	input: string;
	currentContext?: string;
	docURLs?: string[];
	file?: File;
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
	totalHumanHours?: number;
	codingAgentSpecJson?: CodingAgentSpecJson;
	codingAgentSpecMarkdown?: string;
	humanSpecJson?: HumanSpecJson;
	humanSpecMarkdown?: string;
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

export interface CreditsBalanceResponse {
	success: boolean;
	creditsRemaining: number;
}
