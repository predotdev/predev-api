#!/usr/bin/env node

/**
 * Test file for file upload functionality
 * Tests both Node.js and web/browser file upload patterns
 */

import { PredevAPI } from './predev-api-node/dist/index.js';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.PREDEV_API_KEY || 'test_key';

async function testFileUploadNodejs() {
	console.log('\n=== TEST 1: Node.js File Upload (Buffer) ===');
	console.log('Testing: fastSpec with Node.js Buffer object');

	try {
		const client = new PredevAPI({ apiKey: API_KEY });

		// Create test file
		const testFile = path.join('.', 'test-requirements.txt');
		const content = 'Build a task management system with real-time collaboration';
		fs.writeFileSync(testFile, content);

		// Test with Buffer
		const fileBuffer = fs.readFileSync(testFile);
		console.log(`✓ File read successfully (${fileBuffer.length} bytes)`);

		const result = await client.fastSpec({
			input: 'Generate specs based on the uploaded requirements',
			file: {
				data: fileBuffer,
				name: 'requirements.txt'
			}
		});

		console.log('✓ Request sent successfully');
		console.log(`  Status: ${result.status}`);
		console.log(`  Endpoint: ${result.endpoint}`);
		console.log(`  Uploaded File: ${result.uploadedFileName || 'N/A'}`);

		// Clean up
		fs.unlinkSync(testFile);
		console.log('✓ Test passed!\n');

		return true;
	} catch (error) {
		console.log(`✗ Test failed: ${error instanceof Error ? error.message : String(error)}\n`);
		return false;
	}
}

async function testFileUploadBlob() {
	console.log('=== TEST 2: Web/Blob File Upload ===');
	console.log('Testing: deepSpec with Blob object');

	try {
		const client = new PredevAPI({ apiKey: API_KEY });

		// Create a Blob-like object (available in Node.js 15.7+)
		const content = 'Enterprise platform with HIPAA compliance and ML diagnostics';
		const blob = new Blob([content], { type: 'text/plain' });

		console.log(`✓ Blob created successfully (${blob.size} bytes)`);

		const result = await client.deepSpec({
			input: 'Create comprehensive architecture and implementation specs',
			file: blob
		});

		console.log('✓ Request sent successfully');
		console.log(`  Status: ${result.status}`);
		console.log(`  Endpoint: ${result.endpoint}`);
		console.log(`  Uploaded File: ${result.uploadedFileName || 'N/A'}`);
		console.log('✓ Test passed!\n');

		return true;
	} catch (error) {
		console.log(`✗ Test failed: ${error instanceof Error ? error.message : String(error)}\n`);
		return false;
	}
}

async function testAsyncFileUpload() {
	console.log('=== TEST 3: Async Fast Spec with File Upload ===');
	console.log('Testing: fastSpecAsync with file upload');

	try {
		const client = new PredevAPI({ apiKey: API_KEY });

		// Create test file
		const testFile = path.join('.', 'test-design.txt');
		const content = 'UI/UX design guidelines and component specifications';
		fs.writeFileSync(testFile, content);

		const fileBuffer = fs.readFileSync(testFile);
		console.log(`✓ File read successfully (${fileBuffer.length} bytes)`);

		const result = await client.fastSpecAsync({
			input: 'Generate specs based on the design documentation',
			file: {
				data: fileBuffer,
				name: 'design.txt'
			}
		});

		console.log('✓ Request submitted successfully');
		console.log(`  Spec ID: ${result.specId}`);
		console.log(`  Status: ${result.status}`);

		// Clean up
		fs.unlinkSync(testFile);
		console.log('✓ Test passed!\n');

		return true;
	} catch (error) {
		console.log(`✗ Test failed: ${error instanceof Error ? error.message : String(error)}\n`);
		return false;
	}
}

async function testWithoutFile() {
	console.log('=== TEST 4: Backward Compatibility (No File) ===');
	console.log('Testing: fastSpec without file (should use JSON payload)');

	try {
		const client = new PredevAPI({ apiKey: API_KEY });

		const result = await client.fastSpec({
			input: 'Build a simple todo app',
			currentContext: 'Existing auth system',
			docURLs: ['https://example.com/docs']
		});

		console.log('✓ Request sent successfully');
		console.log(`  Status: ${result.status}`);
		console.log(`  Endpoint: ${result.endpoint}`);
		console.log('✓ Test passed!\n');

		return true;
	} catch (error) {
		console.log(`✗ Test failed: ${error instanceof Error ? error.message : String(error)}\n`);
		return false;
	}
}

async function runAllTests() {
	console.log('\n' + '='.repeat(70));
	console.log('FILE UPLOAD FUNCTIONALITY TESTS');
	console.log('='.repeat(70));

	if (API_KEY === 'test_key') {
		console.log('\n⚠️  Warning: Using test API key. Set PREDEV_API_KEY for real API calls.');
		console.log('   Export: export PREDEV_API_KEY=your_actual_key');
	}

	const results = [];
	results.push(await testFileUploadNodejs());
	results.push(await testFileUploadBlob());
	results.push(await testAsyncFileUpload());
	results.push(await testWithoutFile());

	const passed = results.filter(r => r).length;
	const total = results.length;

	console.log('='.repeat(70));
	console.log(`RESULTS: ${passed}/${total} tests passed`);
	console.log('='.repeat(70));

	return passed === total ? 0 : 1;
}

// Run tests
runAllTests().then(code => process.exit(code)).catch(err => {
	console.error('Fatal error:', err);
	process.exit(1);
});
