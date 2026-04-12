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

// Graph data interfaces
export interface SpecGraphNode {
	id: string;
	label: string;
	type?: string;
	description?: string;
	level?: number;
	hours?: number;
}

export interface SpecGraphEdge {
	source: string;
	target: string;
	description?: string;
	edgeType?: string;
}

export interface SpecGraph {
	nodes: SpecGraphNode[];
	edges: SpecGraphEdge[];
}

export interface SpecEnrichedTechStackItem {
	name: string;
	useFor: string;
	reason: string;
	description: string;
	link?: string;
	helpfulLinks?: Array<{ url: string; description: string }>;
	alternatives?: Array<{ name: string; link: string; description: string }>;
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

	architectureInfographicUrl?: string;

	predevUrl?: string;

	zippedDocsUrls?: ZippedDocsUrl[];

	errorMessage?: string;
	progress?: number; // Overall progress percentage (0-100)
	progressMessage?: string; // Detailed progress message (e.g., "Generating User Stories...")

	// Credit usage - available during processing (real-time accumulation) and on completion
	// Fast spec: typically ~5-10 credits, Deep spec: typically ~10-50 credits
	creditsUsed?: number; // Total credits consumed by this spec generation

	// Graph data (only when completed)
	userFlowGraph?: SpecGraph;
	architectureGraph?: SpecGraph;
	enrichedTechStack?: SpecEnrichedTechStackItem[];
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

// ── Browser Tasks ─────────────────────────────────────

export interface BrowserTask {
	/** URL to navigate to */
	url: string;
	/** What to do on the page (natural language) */
	instruction?: string;
	/** Form values / input data */
	input?: Record<string, string>;
	/** JSON Schema describing the expected output shape */
	output?: Record<string, any>;
}

export interface BrowserTaskResult {
	url: string;
	status: string;
	data?: any;
	cost: number;
	creditsUsed: number;
	durationMs: number;
	error?: string;
}

export interface BrowserTasksResponse {
	id: string;
	total: number;
	completed: number;
	results: BrowserTaskResult[];
	totalCost: number;
	totalCreditsUsed: number;
	status: string;
}

// ── Streaming events ────────────────────────────────────

export type BrowserTaskEventType =
	| 'navigation'
	| 'screenshot'
	| 'plan'
	| 'validation'
	| 'action'
	| 'fallback'
	| 'done'
	| 'error';

/** A real-time event from a running task (SSE event: task_event) */
export interface BrowserTaskStreamEvent {
	taskIndex: number;
	type: BrowserTaskEventType;
	timestamp: number;
	iteration?: number;
	data: any;
}

/** Emitted when a single task completes (SSE event: task_result) */
export interface BrowserTaskStreamResult {
	taskIndex: number;
	url: string;
	status: string;
	data?: any;
	cost: number;
	creditsUsed: number;
	durationMs: number;
	error?: string;
}

/** Union of all SSE message types from browserTasksStream() */
export type BrowserTaskSSEMessage =
	| { event: 'task_event'; data: BrowserTaskStreamEvent }
	| { event: 'task_result'; data: BrowserTaskStreamResult }
	| { event: 'done'; data: BrowserTasksResponse }
	| { event: 'error'; data: { error: string } };
