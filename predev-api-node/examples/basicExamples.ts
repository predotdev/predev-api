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
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Total Human Hours: ${result.totalHumanHours}`);
		console.log(
			`Architecture Infographic: ${result.architectureInfographicUrl}`
		);

		// New: Direct JSON and Markdown returns
		if (result.codingAgentSpecJson) {
			console.log("\n--- Coding Agent Spec JSON (Preview) ---");
			console.log(`Title: ${result.codingAgentSpecJson.title}`);
			console.log(
				`Executive Summary: ${result.codingAgentSpecJson.executiveSummary?.substring(
					0,
					100
				)}...`
			);
			console.log(
				`Tech Stack: ${result.codingAgentSpecJson.techStack
					?.map((t) => t.name)
					.join(", ")}`
			);
			console.log(
				`Milestones: ${result.codingAgentSpecJson.milestones?.length || 0}`
			);
		}

		if (result.humanSpecJson) {
			console.log("\n--- Human Spec JSON (Preview) ---");
			console.log(`Title: ${result.humanSpecJson.title}`);
			console.log(`Total Hours: ${result.humanSpecJson.totalHours}`);
			console.log(`Personas: ${result.humanSpecJson.personas?.length || 0}`);
			console.log(
				`Roles: ${result.humanSpecJson.roles?.map((r) => r.name).join(", ")}`
			);
		}

		if (result.codingAgentSpecMarkdown) {
			console.log(
				`\nCoding Agent Markdown Length: ${result.codingAgentSpecMarkdown.length} chars`
			);
		}

		if (result.humanSpecMarkdown) {
			console.log(
				`Human Spec Markdown Length: ${result.humanSpecMarkdown.length} chars`
			);
		}
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
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Total Human Hours: ${result.totalHumanHours}`);
		console.log(
			`Architecture Infographic: ${result.architectureInfographicUrl}`
		);
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
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Total Human Hours: ${result.totalHumanHours}`);
		console.log(
			`Architecture Infographic: ${result.architectureInfographicUrl}`
		);
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
		});

		console.log("✓ Deep spec generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Total Human Hours: ${result.totalHumanHours}`);
		console.log(
			`Architecture Infographic: ${result.architectureInfographicUrl}`
		);
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
		});

		console.log("✓ Deep spec generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Total Human Hours: ${result.totalHumanHours}`);
		console.log(
			`Architecture Infographic: ${result.architectureInfographicUrl}`
		);
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
				console.log(
					`Coding Agent Spec URL: ${statusResult.codingAgentSpecUrl}`
				);
				console.log(`Human Spec URL: ${statusResult.humanSpecUrl}`);
				console.log(`Total Human Hours: ${statusResult.totalHumanHours}`);
				console.log(
					`Architecture Infographic: ${statusResult.architectureInfographicUrl}`
				);
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
				console.log(
					`Coding Agent Spec URL: ${statusResult.codingAgentSpecUrl}`
				);
				console.log(`Human Spec URL: ${statusResult.humanSpecUrl}`);
				console.log(`Total Human Hours: ${statusResult.totalHumanHours}`);
				console.log(
					`Architecture Infographic: ${statusResult.architectureInfographicUrl}`
				);
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
 * Example 13: Check Credits Balance
 *
 * Check the remaining prototype credits balance for the API key
 */
async function example13_GetCreditsBalance() {
	console.log("\nExample 13: Check Credits Balance");
	console.log("=".repeat(50));

	try {
		const balance = await predev.getCreditsBalance();

		console.log("✓ Credits balance retrieved successfully!");
		console.log(`Success: ${balance.success}`);
		console.log(`Credits Remaining: ${balance.creditsRemaining}`);
	} catch (error) {
		if (error instanceof AuthenticationError) {
			console.log("✗ Authentication error:", error.message);
		} else if (error instanceof PredevAPIError) {
			console.log("✗ API error:", error.message);
		} else {
			console.log("✗ Error:", error instanceof Error ? error.message : error);
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
		});

		console.log("✓ Fast spec generated successfully!");
		console.log(
			"Coding Agent Spec URL: " + (result.codingAgentSpecUrl || "N/A")
		);
		console.log("Human Spec URL: " + (result.humanSpecUrl || "N/A"));
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 10: Fast Spec with File Upload (Node.js)
 *
 * Generate a specification by uploading a file (requirements, architecture doc, etc.)
 */
async function example10_FastSpecWithFileNode() {
	console.log("\nExample 10: Fast Spec with File Upload (Node.js)");
	console.log("=".repeat(50));

	try {
		const fs = await import("fs");
		const path = await import("path");

		// Create a sample file for this example
		const sampleFile = path.join(".", "sample_requirements.txt");
		if (!fs.existsSync(sampleFile)) {
			fs.writeFileSync(
				sampleFile,
				"Build a task management system with real-time collaboration, priorities, and team features"
			);
		}

		// Upload file as Node.js Buffer
		const fileBuffer = fs.readFileSync(sampleFile);
		const result = await predev.fastSpec({
			input: "Generate specifications based on the uploaded requirements",
			file: {
				data: fileBuffer,
				name: "requirements.txt",
			},
		});

		console.log("✓ Fast spec with file generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Uploaded File: ${result.uploadedFileName}`);

		// Clean up
		fs.unlinkSync(sampleFile);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 11: Deep Spec with File Upload (Web)
 *
 * Generate a specification by uploading a file from web (browser)
 */
async function example11_DeepSpecWithFileWeb() {
	console.log("\nExample 11: Deep Spec with File Upload (Web/Browser)");
	console.log("=".repeat(50));

	try {
		// This example would work in a browser environment with File objects
		// For Node.js simulation, we create a Blob
		const content =
			"Enterprise healthcare platform with patient records, HIPAA compliance, and ML diagnostics";
		const blob = new Blob([content], { type: "text/plain" });

		const result = await predev.deepSpec({
			input: "Create comprehensive architecture and implementation specs",
			file: blob,
		});

		console.log("✓ Deep spec with file generated successfully!");
		console.log(`Coding Agent Spec URL: ${result.codingAgentSpecUrl}`);
		console.log(`Human Spec URL: ${result.humanSpecUrl}`);
		console.log(`Total Human Hours: ${result.totalHumanHours}`);
	} catch (error) {
		console.error("✗ Error:", error instanceof Error ? error.message : error);
	}
}

/**
 * Example 12: Async Fast Spec with File Upload
 *
 * Generate an async fast specification with file upload
 */
async function example12_FastSpecAsyncWithFile() {
	console.log("\nExample 12: Async Fast Spec with File Upload");
	console.log("=".repeat(50));

	try {
		const fs = await import("fs");
		const path = await import("path");

		// Create a sample file
		const sampleFile = path.join(".", "design_doc.txt");
		if (!fs.existsSync(sampleFile)) {
			fs.writeFileSync(
				sampleFile,
				"UI/UX design guidelines and component specifications"
			);
		}

		const fileBuffer = fs.readFileSync(sampleFile);
		const result = await predev.fastSpecAsync({
			input: "Generate specs based on the design documentation",
			file: {
				data: fileBuffer,
				name: "design_doc.txt",
			},
		});

		console.log("✓ Async request submitted!");
		console.log(`Spec ID: ${result.specId}`);
		console.log(`Status: ${result.status}`);

		// Poll for completion
		console.log("\nPolling for completion...");
		let attempts = 0;
		const maxAttempts = 10;

		while (attempts < maxAttempts) {
			await sleep(3000);
			attempts++;

			const statusResult = await predev.getSpecStatus(result.specId);
			console.log(`Attempt ${attempts}: Status = ${statusResult.status}`);

			if (statusResult.status === "completed") {
				console.log("\n✓ Spec completed!");
				console.log(`Uploaded File: ${statusResult.uploadedFileName}`);
				console.log(
					`Coding Agent Spec URL: ${statusResult.codingAgentSpecUrl}`
				);
				break;
			} else if (statusResult.status === "failed") {
				console.log("\n✗ Spec failed!");
				console.log(`Error: ${(statusResult as any).errorMessage}`);
				break;
			}
		}

		// Clean up
		fs.unlinkSync(sampleFile);
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

	// File upload examples (optional, requires file I/O access)
	// Uncomment to run:
	// await example10_FastSpecWithFileNode();
	// await example11_DeepSpecWithFileWeb();

	// Async examples (comment out if you don't want to wait)
	await example6_FastSpecAsync();
	await example7_DeepSpecAsync();

	// Error handling example
	await example8_ErrorHandling();

	// Check credits balance
	await example13_GetCreditsBalance();

	// Async file upload example (uncomment to run)
	// await example12_FastSpecAsyncWithFile();

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
	example10_FastSpecWithFileNode,
	example11_DeepSpecWithFileWeb,
	example12_FastSpecAsyncWithFile,
	example13_GetCreditsBalance,
};
