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

# Example 1: Generate a fast spec for a task management app
print("Example 1: Task Management App")
print("-" * 50)

try:
    result = client.fast_spec(
        input_text="Build a task management app with team collaboration features including real-time updates, task assignments, and progress tracking",
        output_format="url"
    )
    print("✓ Fast spec generated successfully!")
    print(f"Result: {result}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 2: Generate a fast spec for an e-commerce platform
print("Example 2: E-commerce Platform")
print("-" * 50)

try:
    result = client.fast_spec(
        input_text="Create an e-commerce platform with product catalog, shopping cart, checkout, and payment integration",
        output_format="url"
    )
    print("✓ Fast spec generated successfully!")
    print(f"Result: {result}")
except Exception as e:
    print(f"✗ Error: {e}")
