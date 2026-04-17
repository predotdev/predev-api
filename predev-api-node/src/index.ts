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
	BrowserAgentTask,
	BrowserAgentTaskResult,
	BrowserAgentResponse,
	BrowserAgentEventType,
	BrowserAgentStreamEvent,
	BrowserAgentStreamResult,
	BrowserAgentSSEMessage,
	BrowserAgentStatus,
} from "./types.js";
