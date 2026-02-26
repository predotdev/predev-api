/**
 * Integration test for new graph and enriched tech stack fields
 * Run with: doppler run -- node test-graph-fields.js
 */

import { PredevAPI } from "./predev-api-node/dist/index.js";

const API_KEY = process.env.PREDEV_API_KEY || "6308d5be-66a5-4b59-ac98-721c2902751f";
const BASE_URL = process.env.PREDEV_API_URL || "http://localhost:3001";

const client = new PredevAPI({ apiKey: API_KEY, baseUrl: BASE_URL });
console.log(`Using API at ${BASE_URL}`);

async function pollUntilComplete(specId, label, timeoutMs = 300000) {
	const start = Date.now();
	console.log(`\n⏳ [${label}] Polling spec ${specId}...`);

	while (Date.now() - start < timeoutMs) {
		const status = await client.getSpecStatus(specId);

		if (status.status === "completed") {
			console.log(
				`✅ [${label}] Completed in ${((Date.now() - start) / 1000).toFixed(1)}s`
			);
			return status;
		}

		if (status.status === "failed") {
			console.error(`❌ [${label}] Failed: ${status.errorMessage}`);
			return status;
		}

		console.log(
			`   ${status.progress ?? 0}% - ${status.progressMessage ?? status.status}`
		);
		await new Promise((r) => setTimeout(r, 10000));
	}

	throw new Error(`[${label}] Timed out after ${timeoutMs / 1000}s`);
}

function validateGraph(graph, label) {
	if (!graph) {
		console.log(`   ⚠️  ${label}: missing`);
		return false;
	}
	if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
		console.log(`   ❌ ${label}: nodes/edges not arrays`);
		return false;
	}
	console.log(
		`   ✅ ${label}: ${graph.nodes.length} nodes, ${graph.edges.length} edges`
	);

	// Validate node shape
	let nodeOk = true;
	for (const n of graph.nodes) {
		if (!n.id || !n.label) {
			console.log(`      ❌ Node missing id/label: ${JSON.stringify(n)}`);
			nodeOk = false;
			break;
		}
	}
	if (nodeOk && graph.nodes.length > 0) {
		const sample = graph.nodes[0];
		console.log(
			`      Sample node: { id: "${sample.id}", label: "${sample.label}", type: "${sample.type ?? ""}", level: "${sample.level ?? ""}" }`
		);
	}

	// Validate edge shape
	let edgeOk = true;
	for (const e of graph.edges) {
		if (!e.source || !e.target) {
			console.log(`      ❌ Edge missing source/target: ${JSON.stringify(e)}`);
			edgeOk = false;
			break;
		}
	}
	if (edgeOk && graph.edges.length > 0) {
		const sample = graph.edges[0];
		console.log(
			`      Sample edge: { source: "${sample.source}", target: "${sample.target}", edgeType: "${sample.edgeType ?? ""}" }`
		);
	}

	// Verify no MongoDB internals leaked
	for (const n of graph.nodes) {
		if (n._id || n.graphId || n.projectId || n.created || n.action) {
			console.log(`      ❌ Node has MongoDB internals: ${Object.keys(n)}`);
			return false;
		}
	}
	for (const e of graph.edges) {
		if (e._id || e.graphId || e.projectId || e.created || e.action) {
			console.log(`      ❌ Edge has MongoDB internals: ${Object.keys(e)}`);
			return false;
		}
	}
	console.log(`      ✅ No MongoDB internals leaked`);

	return nodeOk && edgeOk;
}

function validateTechStack(stack, label) {
	if (!stack) {
		console.log(`   ⚠️  ${label}: missing`);
		return false;
	}
	if (!Array.isArray(stack)) {
		console.log(`   ❌ ${label}: not an array`);
		return false;
	}
	console.log(`   ✅ ${label}: ${stack.length} items`);

	let ok = true;
	for (const item of stack) {
		if (!item.name || !item.useFor || !item.reason || !item.description) {
			console.log(
				`      ❌ Item missing required fields: ${JSON.stringify(item)}`
			);
			ok = false;
			break;
		}
	}

	if (ok && stack.length > 0) {
		const sample = stack[0];
		console.log(
			`      Sample: { name: "${sample.name}", useFor: "${sample.useFor}", reason: "${sample.reason?.substring(0, 60)}...", link: "${sample.link ?? "none"}" }`
		);
		if (sample.alternatives?.length > 0) {
			console.log(
				`      Alternatives: ${sample.alternatives.map((a) => a.name).join(", ")}`
			);
		}
		if (sample.helpfulLinks?.length > 0) {
			console.log(`      Helpful links: ${sample.helpfulLinks.length}`);
		}
	}

	return ok;
}

function validateListSpecsOmitsGraphs(specs) {
	let ok = true;
	for (const spec of specs) {
		if (spec.userFlowGraph || spec.architectureGraph || spec.enrichedTechStack) {
			console.log(
				`   ❌ listSpecs returned graph fields for spec ${spec._id}`
			);
			ok = false;
		}
	}
	if (ok) {
		console.log(
			`   ✅ listSpecs correctly omits graph fields (checked ${specs.length} specs)`
		);
	}
	return ok;
}

async function runTest(specType) {
	console.log(`\n${"=".repeat(60)}`);
	console.log(`🚀 Testing ${specType} with async mode`);
	console.log("=".repeat(60));

	// Submit async spec
	const input = "Build a simple todo app with user authentication, task CRUD, and a dashboard";
	let asyncResult;
	if (specType === "fast_spec") {
		asyncResult = await client.fastSpecAsync({ input });
	} else {
		asyncResult = await client.deepSpecAsync({ input });
	}

	console.log(`📝 Submitted: specId = ${asyncResult.specId}`);

	// Poll until complete
	const result = await pollUntilComplete(asyncResult.specId, specType);

	if (result.status !== "completed") {
		console.log(`\n❌ [${specType}] Spec did not complete, skipping validation`);
		return false;
	}

	// Validate new fields
	console.log(`\n📊 Validating new fields for ${specType}:`);

	const ufOk = validateGraph(result.userFlowGraph, "userFlowGraph");
	const archOk = validateGraph(result.architectureGraph, "architectureGraph");
	const tsOk = validateTechStack(result.enrichedTechStack, "enrichedTechStack");

	// Verify existing fields still present
	const existingOk =
		result.codingAgentSpecJson && result.humanSpecJson && result.predevUrl;
	console.log(
		`   ${existingOk ? "✅" : "❌"} Existing fields still present (codingAgentSpecJson, humanSpecJson, predevUrl)`
	);

	const allOk = ufOk && archOk && tsOk && existingOk;
	console.log(`\n${allOk ? "✅" : "❌"} [${specType}] ${allOk ? "PASSED" : "FAILED"}`);
	return allOk;
}

async function main() {
	console.log("🧪 Integration test: Graph & Enriched Tech Stack fields\n");

	let allPassed = true;

	// Test fast spec
	try {
		const fastOk = await runTest("fast_spec");
		allPassed = allPassed && fastOk;
	} catch (err) {
		console.error("❌ fast_spec test error:", err.message);
		allPassed = false;
	}

	// Test deep spec
	try {
		const deepOk = await runTest("deep_spec");
		allPassed = allPassed && deepOk;
	} catch (err) {
		console.error("❌ deep_spec test error:", err.message);
		allPassed = false;
	}

	// Test that listSpecs omits graph fields
	console.log(`\n${"=".repeat(60)}`);
	console.log("📋 Testing listSpecs omits graph fields");
	console.log("=".repeat(60));
	try {
		const list = await client.listSpecs({ limit: 5, status: "completed" });
		validateListSpecsOmitsGraphs(list.specs);
	} catch (err) {
		console.error("❌ listSpecs test error:", err.message);
		allPassed = false;
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log(allPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED");
	console.log("=".repeat(60));
	process.exit(allPassed ? 0 : 1);
}

main();
