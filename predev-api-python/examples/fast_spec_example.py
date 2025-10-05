"""
Example: Generate a fast specification

This example demonstrates how to use the Pre.dev API to generate
a fast specification for a project.
"""

import os
from predev_api import PredevAPI

# Get API key from environment variable or replace with your key
API_KEY = os.environ.get("PREDEV_API_KEY", "your_api_key_here")

# Initialize the client
client = PredevAPI(api_key=API_KEY)

# Example 1: New Project - Task Management App
print("Example 1: New Project - Task Management App")
print("-" * 50)

try:
    result = client.fast_spec(
        input_text="Build a task management app with team collaboration features including real-time updates, task assignments, and progress tracking",
        output_format="url"
    )
    print("✓ Fast spec generated successfully!")
    print(f"URL: {result.get('output')}")
    print(f"Is New Build: {result.get('isNewBuild')}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 2: Feature Addition with Context
print("Example 2: Feature Addition - Add Calendar View")
print("-" * 50)

try:
    result = client.fast_spec(
        input_text="Add a calendar view and Gantt chart visualization",
        current_context="Existing task management system with list and board views, user auth, and basic team features",
        output_format="url"
    )
    print("✓ Fast spec generated successfully!")
    print(f"URL: {result.get('output')}")
    print(f"Is New Build: {result.get('isNewBuild')}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 3: With Documentation URLs
print("Example 3: With Documentation URLs")
print("-" * 50)

try:
    result = client.fast_spec(
        input_text="Build a customer support ticketing system with priority levels and file attachments",
        doc_urls=["https://docs.pre.dev", "https://docs.stripe.com"],
        output_format="url"
    )
    print("✓ Fast spec generated successfully!")
    print(f"URL: {result.get('output')}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 4: Async Mode
print("Example 4: Async Mode")
print("-" * 50)

try:
    result = client.fast_spec(
        input_text="Build a comprehensive e-commerce platform with inventory management",
        output_format="url",
        async_mode=True
    )
    print("✓ Request submitted!")
    print(f"Request ID: {result.get('requestId')}")
    print(f"Status: {result.get('status')}")
    print("\nUse client.get_spec_status(request_id) to check progress")
except Exception as e:
    print(f"✗ Error: {e}")
