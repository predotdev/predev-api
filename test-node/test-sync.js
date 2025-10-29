/**
 * Test: Synchronous fast spec generation
 */

import { PredevAPI } from "../predev-api-node/dist/index.js";

// Get API key from Doppler
const API_KEY = process.env.PREDEV_API_KEY;

if (!API_KEY) {
	console.error("❌ PREDEV_API_KEY environment variable is not set");
	console.error("Make sure Doppler is configured and running");
	process.exit(1);
}

// Initialize the client
const client = new PredevAPI({ apiKey: API_KEY });

console.log("🚀 Testing synchronous fast spec generation...");
console.log("=".repeat(50));

try {
	const result = await client.fastSpec({
		input: "Build a simple todo app with React and TypeScript",
	});

	console.log("✅ Sync fast spec test passed!");
	console.log(`📋 Spec ID: ${result._id || "N/A"}`);
	console.log(`📊 Status: ${result.status}`);
	console.log(`⏱️  Execution Time: ${result.executionTime || "N/A"}ms`);
	console.log(
		`🔗 Coding Agent Spec URL: ${result.codingAgentSpecUrl || "N/A"}`
	);
	console.log(
		`🔗 Human Spec URL: ${result.humanSpecUrl || "N/A"}`
	);

	if (result.success) {
		console.log("✅ Specification generation was successful");
	} else {
		console.log("⚠️  Specification generation completed with warnings");
	}
} catch (error) {
	console.error("❌ Sync fast spec test failed:");
	console.error(error.message);
	process.exit(1);
}

console.log("\n🎉 Sync test completed successfully!\n");
