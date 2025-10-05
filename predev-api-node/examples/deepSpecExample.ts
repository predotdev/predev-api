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

// Example 1: Generate a deep spec for an ERP system
console.log('Example 1: Enterprise Resource Planning System');
console.log('-'.repeat(50));

try {
  const result = await client.deepSpec({
    input: 'Build an enterprise resource planning (ERP) system with modules for inventory management, financial tracking, HR management, and supply chain optimization',
    outputFormat: 'url'
  });
  
  console.log('✓ Deep spec generated successfully!');
  console.log('Result:', result);
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}

console.log('\n');

// Example 2: Generate a deep spec for a healthcare platform
console.log('Example 2: Healthcare Management Platform');
console.log('-'.repeat(50));

try {
  const result = await client.deepSpec({
    input: 'Create a HIPAA-compliant healthcare management platform with patient records, appointment scheduling, telemedicine capabilities, and insurance integration',
    outputFormat: 'url'
  });
  
  console.log('✓ Deep spec generated successfully!');
  console.log('Result:', result);
} catch (error) {
  console.error('✗ Error:', error instanceof Error ? error.message : error);
}
