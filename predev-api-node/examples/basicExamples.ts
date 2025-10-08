/// <reference types="node" />

/**
 * Basic Examples for Pre.dev API
 *
 * This file contains comprehensive examples demonstrating all features of the Pre.dev API:
 * - Synchronous and asynchronous specification generation
 * - Fast specs and deep specs
 * - Status checking for async requests
 * - Error handling
 * - Custom Claude Agent SDK integration
 */

import {
	PredevAPI,
	PredevAPIError,
	AuthenticationError,
	RateLimitError,
} from "../src/index";

// Get API key from environment variable or replace with your key
const API_KEY = process.env.PREDEV_API_KEY || "your_api_key_here";

// Initialize the predev client
const predev = new PredevAPI({ apiKey: API_KEY });

// Helper function to sleep for polling examples
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Example 1: Basic Fast Spec - New Project
 *
 * Generate a fast specification for a new project (30-40 seconds, 10 credits)
 */
async function example1_BasicFastSpec() {
	console.log("Example 1: Basic Fast Spec - New Project");
	console.log("=".repeat(50));

	try {
		const result = await predev.fastSpec({
			input:
				"Build a task management app with team collaboration features including real-time updates, task assignments, and progress tracking",
			outputFormat: "url",
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(`URL: ${(result as any).output}`);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 2: Fast Spec - Feature Addition with Context
 *
 * Generate a specification for adding features to an existing project
 */
async function example2_FastSpecFeatureAddition() {
	console.log("\nExample 2: Fast Spec - Feature Addition");
	console.log("=".repeat(50));

	try {
		const result = await predev.fastSpec({
			input: "Add a calendar view and Gantt chart visualization",
			currentContext:
				"Existing task management system with list and board views, user auth, and basic team features",
			outputFormat: "url",
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(`URL: ${(result as any).output}`);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 3: Fast Spec with Documentation URLs
 *
 * Generate a specification that references external documentation
 */
async function example3_FastSpecWithDocURLs() {
	console.log("\nExample 3: Fast Spec with Documentation URLs");
	console.log("=".repeat(50));

	try {
		const result = await predev.fastSpec({
			input:
				"Build a customer support ticketing system with priority levels and file attachments",
			docURLs: ["https://docs.pre.dev", "https://docs.stripe.com"],
			outputFormat: "url",
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(`URL: ${(result as any).output}`);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 4: Deep Spec - Enterprise Project
 *
 * Generate a comprehensive deep specification (2-3 minutes, 50 credits)
 */
async function example4_DeepSpecEnterprise() {
	console.log("\nExample 4: Deep Spec - Enterprise Healthcare Platform");
	console.log("=".repeat(50));

	try {
		const result = await predev.deepSpec({
			input:
				"Build an enterprise healthcare management platform with patient records, appointment scheduling, billing, insurance processing, and HIPAA compliance for a multi-location hospital system",
			outputFormat: "url",
		});

		console.log("✓ Deep spec generated successfully!");
		console.log(`URL: ${(result as any).output}`);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 5: Deep Spec - Feature Addition
 *
 * Add complex features to an existing platform
 */
async function example5_DeepSpecFeatureAddition() {
	console.log("\nExample 5: Deep Spec - Feature Addition");
	console.log("=".repeat(50));

	try {
		const result = await predev.deepSpec({
			input:
				"Add AI-powered diagnostics, predictive analytics, and automated treatment recommendations",
			currentContext:
				"Existing platform has patient management, scheduling, basic reporting, built with React/Node.js/PostgreSQL, serves 50+ medical practices",
			outputFormat: "url",
		});

		console.log("✓ Deep spec generated successfully!");
		console.log(`URL: ${(result as any).output}`);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 6: Fast Spec Async with Status Polling
 *
 * Generate a fast spec asynchronously and check its status
 */
async function example6_FastSpecAsync() {
	console.log("\nExample 6: Fast Spec Async with Status Polling");
	console.log("=".repeat(50));

	try {
		const result = await predev.fastSpecAsync({
			input:
				"Build a comprehensive e-commerce platform with inventory management",
			outputFormat: "url",
		});

		console.log("✓ Request submitted!");
		console.log(`Spec ID: ${result.specId}`);
		console.log(`Status: ${result.status}`);

		// Poll for completion
		console.log("\nPolling for completion...");
		let attempts = 0;
		const maxAttempts = 10;

		while (attempts < maxAttempts) {
			await sleep(3000); // Wait 3 seconds
			attempts++;

			const statusResult = await predev.getSpecStatus(result.specId);
			console.log(`Attempt ${attempts}: Status = ${statusResult.status}`);

			if (statusResult.status === "completed") {
				console.log("\n✓ Fast spec completed!");
				console.log(`URL: ${(statusResult as any).output}`);
				break;
			} else if (statusResult.status === "failed") {
				console.log("\n✗ Fast spec failed!");
				console.log(`Error: ${(statusResult as any).errorMessage}`);
				break;
			}
		}

		if (attempts >= maxAttempts) {
			console.log(
				"\n⏱️ Still processing after maximum attempts. Check status later."
			);
		}
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 7: Deep Spec Async with Status Polling
 *
 * Generate a deep spec asynchronously and check its status
 */
async function example7_DeepSpecAsync() {
	console.log("\nExample 7: Deep Spec Async with Status Polling");
	console.log("=".repeat(50));

	try {
		const result = await predev.deepSpecAsync({
			input:
				"Build a comprehensive fintech platform with banking, investments, crypto trading, regulatory compliance, and real-time market data",
			outputFormat: "url",
		});

		console.log("✓ Request submitted!");
		console.log(`Spec ID: ${result.specId}`);
		console.log(`Status: ${result.status}`);
		console.log("Note: Deep specs take 2-3 minutes to process");

		// Poll for completion (less frequently for deep specs)
		console.log("\nPolling for completion...");
		let attempts = 0;
		const maxAttempts = 15;

		while (attempts < maxAttempts) {
			await sleep(10000); // Wait 10 seconds for deep specs
			attempts++;

			const statusResult = await predev.getSpecStatus(result.specId);
			console.log(`Attempt ${attempts}: Status = ${statusResult.status}`);

			if (statusResult.status === "completed") {
				console.log("\n✓ Deep spec completed!");
				console.log(`URL: ${(statusResult as any).output}`);
				break;
			} else if (statusResult.status === "failed") {
				console.log("\n✗ Deep spec failed!");
				console.log(`Error: ${(statusResult as any).errorMessage}`);
				break;
			}
		}

		if (attempts >= maxAttempts) {
			console.log(
				"\n⏱️ Still processing after maximum attempts. Check status later."
			);
		}
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 8: Error Handling
 *
 * Demonstrate proper error handling for different error types
 */
async function example8_ErrorHandling() {
	console.log("\nExample 8: Error Handling");
	console.log("=".repeat(50));

	// Test with invalid API key
	const invalidPredev = new PredevAPI({ apiKey: "invalid_key" });

	try {
		await invalidPredev.fastSpec({
			input: "Build a test app",
			outputFormat: "url",
		});
	} catch (error) {
		if (error instanceof AuthenticationError) {
			console.log("✓ Caught AuthenticationError:", error.message);
		} else if (error instanceof RateLimitError) {
			console.log("✓ Caught RateLimitError:", error.message);
		} else if (error instanceof PredevAPIError) {
			console.log("✓ Caught PredevAPIError:", error.message);
		} else {
			console.log(
				"✓ Caught generic error:",
				error instanceof Error ? error.message : error
			);
		}
	}
}

/**
 * Example 9: Markdown Output Format
 *
 * Generate specifications in markdown format instead of URLs
 */
async function example9_MarkdownOutput() {
	console.log("\nExample 9: Markdown Output Format");
	console.log("=".repeat(50));

	try {
		const result = await predev.fastSpec({
			input:
				"Build a simple blog platform with posts, comments, and user profiles",
			outputFormat: "markdown",
		});

		console.log("✓ Fast spec generated successfully!");
		console.log("Raw markdown content:");
		console.log("-".repeat(30));
		console.log((result as any).output);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

// Main execution - run all examples
async function main() {
	console.log("Pre.dev API Basic Examples");
	console.log("=".repeat(70));
	console.log();

	if (API_KEY === "your_api_key_here") {
		console.log(
			"⚠️  Please set your PREDEV_API_KEY environment variable or update the API_KEY constant"
		);
		console.log("   Get your API key from: https://pre.dev");
		console.log();
		process.exit(1);
	}

	// Run synchronous examples
	await example1_BasicFastSpec();
	await example2_FastSpecFeatureAddition();
	await example3_FastSpecWithDocURLs();
	await example4_DeepSpecEnterprise();
	await example5_DeepSpecFeatureAddition();
	await example9_MarkdownOutput();

	// Run async examples (comment out if you don't want to wait)
	await example6_FastSpecAsync();
	await example7_DeepSpecAsync();

	// Error handling example
	await example8_ErrorHandling();

	// Claude Agent SDK example (uncomment if you have the SDK installed)
	// await example10_ClaudeAgentIntegration();

	console.log("\n🎉 All examples completed!");
	console.log("=".repeat(70));
}

// Run examples if this file is executed directly
main().catch(console.error);

export {
	example1_BasicFastSpec,
	example2_FastSpecFeatureAddition,
	example3_FastSpecWithDocURLs,
	example4_DeepSpecEnterprise,
	example5_DeepSpecFeatureAddition,
	example6_FastSpecAsync,
	example7_DeepSpecAsync,
	example8_ErrorHandling,
	example9_MarkdownOutput,
};
