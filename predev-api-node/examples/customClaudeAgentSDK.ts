/**
 * Example: Custom Claude Agent SDK Integration
 * 
 * This example demonstrates how to:
 * 1. Generate a specification using Pre.dev API
 * 2. Use Claude Agent SDK to autonomously implement the spec
 * 
 * The Claude Agent SDK has built-in file system access and can:
 * - Create/edit files directly
 * - Run bash commands
 * - Install dependencies
 * - Execute code
 * 
 * Requires: npm install claude-agent-sdk
 */

import { PredevAPI } from '../src/index';
import { query } from 'claude-agent-sdk';

// Get API keys from environment
const PREDEV_API_KEY = process.env.PREDEV_API_KEY || 'your_api_key_here';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your_anthropic_api_key';

// Set Anthropic API key for Claude SDK
process.env.ANTHROPIC_API_KEY = ANTHROPIC_API_KEY;

// Initialize Pre.dev client
const predevClient = new PredevAPI({ apiKey: PREDEV_API_KEY });

/**
 * Use Claude Agent SDK to autonomously implement a spec.
 * 
 * Claude will:
 * 1. Download and read the spec from the URL
 * 2. Create all necessary files and folder structure
 * 3. Write complete implementation code
 * 4. Run any setup commands if needed
 */
async function implementSpecWithClaude(specUrl: string, projectDir: string): Promise<void> {
  const prompt = `I have a project specification at: ${specUrl}

Please implement this project completely:

1. Download the spec by fetching ${specUrl}.md (add .md extension to get raw markdown)
2. Read and understand all requirements, architecture, and acceptance criteria
3. Create the project in the directory: ${projectDir}
4. Implement ALL files needed according to the spec
5. Follow the exact folder structure and file organization specified
6. Write complete, production-ready code with error handling
7. Add comments explaining key decisions
8. Create any config files needed (package.json, requirements.txt, etc.)
9. Report progress as you create each file

Work through the spec milestone by milestone. Create all files for each milestone before moving to the next.`;

  console.log(`🤖 Claude Agent SDK is now implementing the spec...`);
  console.log(`📁 Project directory: ${projectDir}`);
  console.log('-'.repeat(70));
  console.log();

  // Query the agent - it will autonomously create files and implement
  for await (const message of query({ prompt })) {
    // Print progress messages from Claude as it works
    console.log(message);
  }
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
      input: 'Build a simple todo list app with add, delete, and mark complete functionality. Use vanilla JavaScript and localStorage.'
    });

    const specUrl = specResult.humanSpecUrl;
    console.log(`✓ Spec generated: ${specUrl}`);
    console.log();

    // Step 2: Define project directory
    const projectDir = './todo-app-implementation';
    console.log('Step 2: Setting up implementation...');
    console.log('-'.repeat(70));
    console.log(`Project will be created in: ${projectDir}`);
    console.log();

    // Step 3: Let Claude Agent SDK implement everything
    console.log('Step 3: Claude Agent SDK implementing the specification...');
    console.log('-'.repeat(70));
    console.log();

    await implementSpecWithClaude(specUrl, projectDir);

    console.log();
    console.log('='.repeat(70));
    console.log('✓ Implementation complete!');
    console.log('='.repeat(70));
    console.log();
    console.log(`Check the ${projectDir} directory for all generated files.`);
    console.log(`View the original spec at: ${specUrl}`);

  } catch (error) {
    console.error('✗ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
})();