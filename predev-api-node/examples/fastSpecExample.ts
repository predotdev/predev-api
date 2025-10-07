/**
 * Example: Generate a fast specification
 *
 * This example demonstrates how to use the Pre.dev API to generate
 * a fast specification for a project.
 */

import { PredevAPI } from "../src/index";

// Get API key from environment variable or replace with your key
const API_KEY = process.env.PREDEV_API_KEY || "your_api_key_here";

// Initialize the predev client
const predev = new PredevAPI({ apiKey: API_KEY });

// Example 1: New Project - Task Management App
console.log("Example 1: New Project - Task Management App");
console.log("-".repeat(50));

try {
	const result = await predev.fastSpec({
		input:
			"Build a task management app with team collaboration features including real-time updates, task assignments, and progress tracking",
		outputFormat: "url",
	});

	console.log("✓ Fast spec generated successfully!");
	console.log(`URL: ${(result as any).output}`);
	console.log(`Is New Build: ${(result as any).isNewBuild}`);
} catch (error) {
	console.error("✗ Error:", error instanceof Error ? error.message : error);
}

console.log("\n");

// Example 2: Feature Addition with Context
console.log("Example 2: Feature Addition - Add Calendar View");
console.log("-".repeat(50));

try {
	const result = await predev.fastSpec({
		input: "Add a calendar view and Gantt chart visualization",
		currentContext:
			"Existing task management system with list and board views, user auth, and basic team features",
		outputFormat: "url",
	});

	console.log("✓ Fast spec generated successfully!");
	console.log(`URL: ${(result as any).output}`);
	console.log(`Is New Build: ${(result as any).isNewBuild}`);
} catch (error) {
	console.error("✗ Error:", error instanceof Error ? error.message : error);
}

console.log("\n");

// Example 3: With Documentation URLs
console.log("Example 3: With Documentation URLs");
console.log("-".repeat(50));

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

console.log("\n");

// Example 4: Async Mode
console.log("Example 4: Async Mode");
console.log("-".repeat(50));

try {
	const result = await predev.fastSpecAsync({
		input:
			"Build a comprehensive e-commerce platform with inventory management",
		outputFormat: "url",
	});

	console.log("✓ Request submitted!");
	console.log(`Spec ID: ${result.specId}`);
	console.log(`Status: ${result.status}`);
	console.log("\nUse predev.getSpecStatus(result.specId) to check progress");
} catch (error) {
	console.error("✗ Error:", error instanceof Error ? error.message : error);
}
