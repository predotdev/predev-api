/**
 * Example: Generate a deep specification
 * 
 * This example demonstrates how to use the Pre.dev API to generate
 * a comprehensive, enterprise-grade deep specification for a complex project.
 */

import { PredevAPI } from '../src/index';

// Get API key from environment variable or replace with your key
const API_KEY = process.env.PREDEV_API_KEY || 'your_api_key_here';

// Initialize the client
const client = new PredevAPI({ apiKey: API_KEY });

// Example 1: New Enterprise Project
console.log('Example 1: New Enterprise Healthcare Platform');
console.log('-'.repeat(50));

try {
  const result = await client.deepSpec({
    input: 'Build an enterprise healthcare management platform with patient records, appointment scheduling, billing, insurance processing, and HIPAA compliance for a multi-location hospital system',
    outputFormat: 'url'
  });
  
  console.log('✓ Deep spec generated successfully!');
  console.log(`URL: ${(result as any).output}`);
  console.log(`Is New Build: ${(result as any).isNewBuild}`);
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}

console.log('\n');

// Example 2: Complex Feature Addition
console.log('Example 2: Feature Addition - AI Diagnostics');
console.log('-'.repeat(50));

try {
  const result = await client.deepSpec({
    input: 'Add AI-powered diagnostics, predictive analytics, and automated treatment recommendations',
    currentContext: 'Existing platform has patient management, scheduling, basic reporting, built with React/Node.js/PostgreSQL, serves 50+ medical practices',
    outputFormat: 'url'
  });
  
  console.log('✓ Deep spec generated successfully!');
  console.log(`URL: ${(result as any).output}`);
  console.log(`Is New Build: ${(result as any).isNewBuild}`);
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}

console.log('\n');

// Example 3: Async Mode (Recommended for Deep Specs)
console.log('Example 3: Async Mode - Fintech Platform');
console.log('-'.repeat(50));

try {
  const result = await client.deepSpec({
    input: 'Build a comprehensive fintech platform with banking, investments, crypto trading, regulatory compliance, and real-time market data',
    outputFormat: 'url',
    async: true
  });
  
  console.log('✓ Request submitted!');
  console.log(`Request ID: ${(result as any).requestId}`);
  console.log(`Status: ${(result as any).status}`);
  console.log('\nNote: Deep specs take 2-3 minutes to process');
  console.log('Use client.getSpecStatus(requestId) to check progress');
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}
