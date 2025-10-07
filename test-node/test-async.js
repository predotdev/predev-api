/**
 * Test: Asynchronous fast spec generation with status polling
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

// Helper function to sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log("🚀 Testing asynchronous fast spec generation with polling...");
console.log("=".repeat(60));

try {
	// Start async request
	console.log("📤 Submitting async fast spec request...");
	const asyncResult = await client.fastSpecAsync({
		input: "Build a weather dashboard with charts and location-based forecasts",
		outputFormat: "url",
	});

	console.log("✅ Async request submitted successfully!");
	console.log(`🆔 Spec ID: ${asyncResult.specId}`);
	console.log(`📊 Initial Status: ${asyncResult.status}`);
	console.log("\n⏳ Polling for completion...\n");

	// Poll for status in a while loop
	let statusResult;
	let attempts = 0;
	const maxAttempts = 30; // 30 attempts * 2 seconds = 1 minute max
	const pollInterval = 2000; // 2 seconds

	while (attempts < maxAttempts) {
		attempts++;
		console.log(`🔄 Attempt ${attempts}/${maxAttempts}: Checking status...`);

		try {
			statusResult = await client.getSpecStatus(asyncResult.specId);

			console.log(`   📊 Status: ${statusResult.status}`);
			console.log(`   ✅ Success: ${statusResult.success}`);
			console.log(`   📋 Progress: ${statusResult.progress || "N/A"}`);

			if (statusResult.status === "completed") {
				console.log("\n🎉 Specification generation completed!");
				console.log(
					`⏱️  Execution Time: ${statusResult.executionTime || "N/A"}ms`
				);
				console.log(
					`🔗 Output URL: ${
						statusResult.output || statusResult.outputFileUrl || "N/A"
					}`
				);
				break;
			} else if (statusResult.status === "failed") {
				console.log("\n❌ Specification generation failed!");
				console.log(
					`📝 Error: ${statusResult.errorMessage || "Unknown error"}`
				);
				process.exit(1);
			}

			// Wait before next poll
			console.log(
				`   💤 Waiting ${pollInterval / 1000}s before next check...\n`
			);
			await sleep(pollInterval);
		} catch (pollError) {
			console.log(`   ❌ Error checking status: ${pollError.message}`);
			console.log(`   💤 Waiting ${pollInterval / 1000}s before retry...\n`);
			await sleep(pollInterval);
		}
	}

	if (attempts >= maxAttempts) {
		console.error("❌ Async test timed out after maximum polling attempts");
		process.exit(1);
	}

	console.log("\n🎉 Async test completed successfully!\n");
} catch (error) {
	console.error("❌ Async fast spec test failed:");
	console.error(error.message);
	process.exit(1);
}
