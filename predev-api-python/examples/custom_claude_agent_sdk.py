"""
Example: Custom Claude Agent SDK Integration

This example demonstrates how to:
1. Generate a specification using Pre.dev API
2. Use Claude Agent SDK to autonomously implement the spec

The Claude Agent SDK has built-in file system access and can:
- Create/edit files directly
- Run bash commands
- Install dependencies
- Execute code

Requires: pip install claude-agent-sdk
"""

import os
import anyio
from predev_api import PredevAPI
from claude_agent_sdk import query

# Get API keys from environment
PREDEV_API_KEY = os.environ.get("PREDEV_API_KEY", "your_api_key_here")
ANTHROPIC_API_KEY = os.environ.get(
    "ANTHROPIC_API_KEY", "your_anthropic_api_key")

# Set Anthropic API key for Claude SDK
os.environ["ANTHROPIC_API_KEY"] = ANTHROPIC_API_KEY

# Initialize Pre.dev client
predev_client = PredevAPI(api_key=PREDEV_API_KEY)


async def implement_spec_with_claude(spec_url: str, project_dir: str):
    """
    Use Claude Agent SDK to autonomously implement a spec.

    Claude will:
    1. Download and read the spec from the URL
    2. Create all necessary files and folder structure
    3. Write complete implementation code
    4. Run any setup commands if needed
    """

    prompt = f"""I have a project specification at: {spec_url}

Please implement this project completely:

1. Download the spec by fetching {spec_url}.md (add .md extension to get raw markdown)
2. Read and understand all requirements, architecture, and acceptance criteria
3. Create the project in the directory: {project_dir}
4. Implement ALL files needed according to the spec
5. Follow the exact folder structure and file organization specified
6. Write complete, production-ready code with error handling
7. Add comments explaining key decisions
8. Create any config files needed (package.json, requirements.txt, etc.)
9. Report progress as you create each file

Work through the spec milestone by milestone. Create all files for each milestone before moving to the next."""

    print(f"🤖 Claude Agent SDK is now implementing the spec...")
    print(f"📁 Project directory: {project_dir}")
    print("-" * 70)
    print()

    # Query the agent - it will autonomously create files and implement
    async for message in query(prompt=prompt):
        # Print progress messages from Claude as it works
        print(message)


async def main():
    print("=" * 70)
    print("Claude Agent SDK Integration Example")
    print("=" * 70)
    print()

    # Step 1: Generate specification
    print("Step 1: Generating specification with Pre.dev...")
    print("-" * 70)

    spec_result = predev_client.fast_spec(
        input_text="Build a simple todo list app with add, delete, and mark complete functionality. Use vanilla JavaScript and localStorage."
    )

    spec_url = spec_result.get('humanSpecUrl') or spec_result.get('codingAgentSpecUrl')
    print(f"✓ Spec generated: {spec_url}")
    print()

    # Step 2: Define project directory
    project_dir = "./todo-app-implementation"
    print("Step 2: Setting up implementation...")
    print("-" * 70)
    print(f"Project will be created in: {project_dir}")
    print()

    # Step 3: Let Claude Agent SDK implement everything
    print("Step 3: Claude Agent SDK implementing the specification...")
    print("-" * 70)
    print()

    await implement_spec_with_claude(spec_url, project_dir)

    print()
    print("=" * 70)
    print("✓ Implementation complete!")
    print("=" * 70)
    print()
    print(f"Check the {project_dir} directory for all generated files.")
    print(f"View the original spec at: {spec_url}")


if __name__ == "__main__":
    anyio.run(main)
