"""
Example: Custom Claude Agent SDK Integration

This example demonstrates how to:
1. Generate a specification using Pre.dev API
2. Use Claude Agent SDK to implement the spec automatically

Requires: pip install claude-agent-sdk
"""

import os
import asyncio
import requests
from predev_api import PredevAPI
from claude_agent_sdk import ClaudeSDKClient

# Get API keys from environment
PREDEV_API_KEY = os.environ.get("PREDEV_API_KEY", "your_predev_api_key")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "your_anthropic_api_key")

# Set Anthropic API key for Claude SDK
os.environ["ANTHROPIC_API_KEY"] = ANTHROPIC_API_KEY

# Initialize Pre.dev client
predev_client = PredevAPI(api_key=PREDEV_API_KEY)


def get_spec_content(spec_url: str) -> str:
    """Download the markdown spec from the URL"""
    # Add .md extension to get raw markdown
    markdown_url = f"{spec_url}.md"
    response = requests.get(markdown_url)
    response.raise_for_status()
    return response.text


async def implement_with_claude(spec_content: str, task: str) -> str:
    """Use Claude Agent SDK to implement code based on the spec"""
    
    client = ClaudeSDKClient()
    
    prompt = f"""You are an expert software developer implementing a project based on this specification:

{spec_content}

Task: {task}

Please implement this following the specification exactly. Include:
- All necessary files and folder structure
- Complete, working code with proper error handling
- Comments explaining key decisions
- Any setup/installation instructions

Provide the implementation as complete, ready-to-use code."""

    response = await client.query(
        prompt,
        model="claude-sonnet-4-20250514"  # Claude Sonnet 4.5
    )
    
    return response


async def main():
    # Example: Build a todo app with Claude Agent SDK
    print("=" * 70)
    print("Claude Agent SDK Integration Example")
    print("=" * 70)
    print()

    # Step 1: Generate specification
    print("Step 1: Generating specification with Pre.dev...")
    print("-" * 70)

    spec_result = predev_client.fast_spec(
        input_text="Build a simple todo list app with add, delete, and mark complete functionality. Use vanilla JavaScript and localStorage.",
        output_format="url"
    )

    spec_url = spec_result.get('output')
    print(f"✓ Spec generated: {spec_url}")
    print()

    # Step 2: Get the spec content
    print("Step 2: Downloading specification content...")
    print("-" * 70)

    spec_content = get_spec_content(spec_url)
    print(f"✓ Spec downloaded ({len(spec_content)} characters)")
    print()

    # Step 3: Use Claude Agent SDK to implement
    print("Step 3: Using Claude Agent SDK to implement...")
    print("-" * 70)

    implementation = await implement_with_claude(
        spec_content=spec_content,
        task="Implement the first milestone: Basic todo CRUD operations with HTML/CSS/JS"
    )

    print("✓ Implementation complete!")
    print()
    print("Claude's Implementation:")
    print("=" * 70)
    print(implementation)
    print()

    # Save implementation to file
    output_file = "claude_agent_implementation.md"
    with open(output_file, "w") as f:
        f.write(f"# Todo App Implementation by Claude Agent SDK\n\n")
        f.write(f"**Spec URL**: {spec_url}\n\n")
        f.write(f"## Implementation\n\n")
        f.write(implementation)

    print(f"✓ Implementation saved to: {output_file}")
    print()
    print("Next steps:")
    print("- Review the implementation")
    print("- Extract the code files")
    print("- Test the application")
    print("- Update spec tasks: [ ] → [→] → [✓]")
    print(f"- View spec at: {spec_url}")


if __name__ == "__main__":
    asyncio.run(main())
