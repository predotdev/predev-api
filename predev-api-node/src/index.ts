/**
 * predev-api - TypeScript/Node.js client for the Pre.dev API
 *
 * AI-powered software specs + browser automation.
 */

export { PredevAPI } from "./client.js";
export {
	PredevAPIError,
	AuthenticationError,
	RateLimitError,
} from "./exceptions.js";
export type {
	PredevAPIConfig,
	SpecGenOptions,
	SpecResponse,
	ZippedDocsUrl,
	CreditsBalanceResponse,
	SpecCoreFunctionality,
	SpecTechStackItem,
	SpecPersona,
	SpecRole,
	CodingAgentSpecJson,
	HumanSpecJson,
	SpecGraphNode,
	SpecGraphEdge,
	SpecGraph,
	SpecEnrichedTechStackItem,
	BrowserTask,
	BrowserTaskResult,
	BrowserTasksResponse,
	BrowserTaskEventType,
	BrowserTaskStreamEvent,
	BrowserTaskStreamResult,
	BrowserTaskSSEMessage,
} from "./types.js";
