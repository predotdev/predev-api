/**
 * Integration test for new list-specs and find-specs endpoints
 * Run with: doppler run -- node test-new-endpoints.js
 */

import { PredevAPI } from "./predev-api-node/dist/index.js";

async function testNewEndpoints() {
	const apiKey = process.env.PREDEV_API_KEY;

	if (!apiKey) {
		console.error("❌ PREDEV_API_KEY environment variable not set");
		process.exit(1);
	}

	console.log("🚀 Testing new Pre.dev API endpoints with Node.js client\n");

	const client = new PredevAPI({ apiKey });

	try {
		// Test 1: List specs
		console.log("📋 Test 1: List all specs (first 5)");
		const listResult = await client.listSpecs({ limit: 5 });
		console.log(`✅ Success! Found ${listResult.total} total specs`);
		console.log(`   Returned ${listResult.specs.length} specs`);
		console.log(`   Has more: ${listResult.hasMore}`);
		if (listResult.specs.length > 0) {
			console.log(
				`   First spec: "${listResult.specs[0].input?.substring(0, 50)}..."`
			);
		}
		console.log();

		// Test 2: List completed specs
		console.log("✅ Test 2: List completed specs only (first 3)");
		const completedResult = await client.listSpecs({
			status: "completed",
			limit: 3,
		});
		console.log(`✅ Success! Found ${completedResult.total} completed specs`);
		console.log(`   Returned ${completedResult.specs.length} specs`);
		console.log();

		// Test 3: Filter by endpoint type
		console.log("⚡ Test 3: List fast_spec endpoints only (first 3)");
		const fastSpecResult = await client.listSpecs({
			endpoint: "fast_spec",
			limit: 3,
		});
		console.log(`✅ Success! Found ${fastSpecResult.total} fast_spec entries`);
		console.log();

		// Test 4: Find specs with simple search
		console.log('🔍 Test 4: Search for specs containing "build"');
		const searchResult = await client.findSpecs({
			query: "build",
			limit: 3,
		});
		console.log(
			`✅ Success! Found ${searchResult.total} specs matching "build"`
		);
		if (searchResult.specs.length > 0) {
			searchResult.specs.forEach((spec, idx) => {
				console.log(`   ${idx + 1}. "${spec.input?.substring(0, 60)}..."`);
			});
		}
		console.log();

		// Test 5: Find specs with regex pattern
		console.log(
			'🎯 Test 5: Search with regex pattern "^Build" (starts with Build)'
		);
		const regexResult = await client.findSpecs({
			query: "^Build",
			limit: 3,
		});
		console.log(
			`✅ Success! Found ${regexResult.total} specs starting with "Build"`
		);
		if (regexResult.specs.length > 0) {
			regexResult.specs.forEach((spec, idx) => {
				console.log(`   ${idx + 1}. "${spec.input?.substring(0, 60)}..."`);
			});
		}
		console.log();

		// Test 6: Combined filters
		console.log('🎨 Test 6: Search "api" in completed fast_spec only');
		const combinedResult = await client.findSpecs({
			query: "api",
			endpoint: "fast_spec",
			status: "completed",
			limit: 2,
		});
		console.log(`✅ Success! Found ${combinedResult.total} matching specs`);
		console.log();

		// Test 7: Pagination
		console.log("📄 Test 7: Test pagination (skip=5, limit=3)");
		const paginatedResult = await client.listSpecs({
			skip: 5,
			limit: 3,
		});
		console.log(
			`✅ Success! Skipped 5, returned ${paginatedResult.specs.length} specs`
		);
		console.log();

		console.log("🎉 All tests passed! New endpoints are working correctly.\n");
	} catch (error) {
		console.error("❌ Test failed:", error.message);
		if (error.stack) {
			console.error(error.stack);
		}
		process.exit(1);
	}
}

testNewEndpoints();
