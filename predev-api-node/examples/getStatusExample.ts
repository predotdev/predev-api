/**
 * Example: Check specification status
 * 
 * This example demonstrates how to check the status of an async
 * specification generation request.
 */

import { PredevAPI } from '../src/index';

// Get API key from environment variable or replace with your key
const API_KEY = process.env.PREDEV_API_KEY || 'your_api_key_here';

// Initialize the client
const client = new PredevAPI({ apiKey: API_KEY });

// Helper function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Example: Generate a spec and check its status
console.log('Generating a specification...');
console.log('-'.repeat(50));

try {
  // Generate a fast spec
  const result = await client.fastSpec({
    input: 'Build a social media dashboard with analytics',
    outputFormat: 'url'
  });
  
  console.log('✓ Request submitted successfully!');
  console.log('Initial result:', result);
  
  // If the response contains a spec_id, we can check its status
  const specId = (result as any).spec_id || (result as any).id;
  
  if (specId) {
    console.log(`\nChecking status for spec ID: ${specId}`);
    console.log('-'.repeat(50));
    
    // Poll for status (in a real application, you'd do this less frequently)
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await sleep(2000); // Wait 2 seconds between checks
      
      const statusResult = await client.getSpecStatus(specId);
      console.log(`Attempt ${attempt + 1}:`, statusResult);
      
      if ((statusResult as any).status === 'completed') {
        console.log('\n✓ Specification generation completed!');
        break;
      }
    }
  } else {
    console.log('\nNote: Response format may vary. Check API documentation for details.');
  }
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}
