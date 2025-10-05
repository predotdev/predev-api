/**
 * Example: Generate a fast specification
 * 
 * This example demonstrates how to use the Pre.dev API to generate
 * a fast specification for a project.
 */

import { PredevAPI } from '../src/index';

// Get API key from environment variable or replace with your key
const API_KEY = process.env.PREDEV_API_KEY || 'your_api_key_here';

// Initialize the client
const client = new PredevAPI({ apiKey: API_KEY });

// Example 1: Generate a fast spec for a task management app
console.log('Example 1: Task Management App');
console.log('-'.repeat(50));

try {
  const result = await client.fastSpec({
    input: 'Build a task management app with team collaboration features including real-time updates, task assignments, and progress tracking',
    outputFormat: 'url'
  });
  
  console.log('✓ Fast spec generated successfully!');
  console.log('Result:', result);
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}

console.log('\n');

// Example 2: Generate a fast spec for an e-commerce platform
console.log('Example 2: E-commerce Platform');
console.log('-'.repeat(50));

try {
  const result = await client.fastSpec({
    input: 'Create an e-commerce platform with product catalog, shopping cart, checkout, and payment integration',
    outputFormat: 'url'
  });
  
  console.log('✓ Fast spec generated successfully!');
  console.log('Result:', result);
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}
