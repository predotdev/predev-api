/**
 * Example: Custom Claude Agent SDK Integration
 * 
 * This example demonstrates how to:
 * 1. Generate a specification using Pre.dev API
 * 2. Use Claude Agent SDK to implement the spec automatically
 * 
 * Requires: npm install @anthropic-ai/claude-agent-sdk
 */

import { PredevAPI } from '../src/index';
import { ClaudeClient } from '@anthropic-ai/claude-agent-sdk';

// Get API keys from environment
const PREDEV_API_KEY = process.env.PREDEV_API_KEY || 'your_predev_api_key';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your_anthropic_api_key';

// Set Anthropic API key for Claude SDK
process.env.ANTHROPIC_API_KEY = ANTHROPIC_API_KEY;

// Initialize Pre.dev client
const predevClient = new PredevAPI({ apiKey: PREDEV_API_KEY });

/**
 * Download the markdown spec from the URL
 */
async function getSpecContent(specUrl: string): Promise<string> {
  // Add .md extension to get raw markdown
  const markdownUrl = `${specUrl}.md`;
  const response = await fetch(markdownUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spec: ${response.statusText}`);
  }
  
  return response.text();
}

/**
 * Use Claude Agent SDK to implement code based on the spec
 */
async function implementWithClaude(
  specContent: string,
  task: string
): Promise<string> {
  const client = new ClaudeClient();

  const prompt = `You are an expert software developer implementing a project based on this specification:

${specContent}

Task: ${task}

Please implement this following the specification exactly. Include:
- All necessary files and folder structure
- Complete, working code with proper error handling
- Comments explaining key decisions
- Any setup/installation instructions

Provide the implementation as complete, ready-to-use code.`;

  const response = await client.query({
    prompt: prompt,
    model: 'claude-sonnet-4-20250514' // Claude Sonnet 4.5
  });

  return response;
}

// Main execution
(async () => {
  console.log('='.repeat(70));
  console.log('Claude Agent SDK Integration Example');
  console.log('='.repeat(70));
  console.log();

  try {
    // Step 1: Generate specification
    console.log('Step 1: Generating specification with Pre.dev...');
    console.log('-'.repeat(70));

    const specResult = await predevClient.fastSpec({
      input: 'Build a simple todo list app with add, delete, and mark complete functionality. Use vanilla JavaScript and localStorage.',
      outputFormat: 'url'
    });

    const specUrl = (specResult as any).output;
    console.log(`✓ Spec generated: ${specUrl}`);
    console.log();

    // Step 2: Get the spec content
    console.log('Step 2: Downloading specification content...');
    console.log('-'.repeat(70));

    const specContent = await getSpecContent(specUrl);
    console.log(`✓ Spec downloaded (${specContent.length} characters)`);
    console.log();

    // Step 3: Use Claude Agent SDK to implement
    console.log('Step 3: Using Claude Agent SDK to implement...');
    console.log('-'.repeat(70));

    const implementation = await implementWithClaude(
      specContent,
      'Implement the first milestone: Basic todo CRUD operations with HTML/CSS/JS'
    );

    console.log('✓ Implementation complete!');
    console.log();
    console.log("Claude's Implementation:");
    console.log('='.repeat(70));
    console.log(implementation);
    console.log();

    // Save implementation to file
    const fs = await import('fs/promises');
    const outputFile = 'claude_agent_implementation.md';
    const content = `# Todo App Implementation by Claude Agent SDK

**Spec URL**: ${specUrl}

## Implementation

${implementation}`;

    await fs.writeFile(outputFile, content);

    console.log(`✓ Implementation saved to: ${outputFile}`);
    console.log();
    console.log('Next steps:');
    console.log('- Review the implementation');
    console.log('- Extract the code files');
    console.log('- Test the application');
    console.log('- Update spec tasks: [ ] → [→] → [✓]');
    console.log(`- View spec at: ${specUrl}`);

  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
})();
