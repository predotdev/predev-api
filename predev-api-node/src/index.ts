/**
 * predev-api - TypeScript/Node.js client for the Pre.dev Architect API
 *
 * Generate comprehensive software specifications using AI.
 */

export { PredevAPI } from "./client.js";
export {
	PredevAPIError,
	AuthenticationError,
	RateLimitError,
} from "./exceptions.js";
export type { PredevAPIConfig, SpecGenOptions, SpecResponse } from "./types.js";
