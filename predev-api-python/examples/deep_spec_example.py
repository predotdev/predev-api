"""
Example: Generate a deep specification

This example demonstrates how to use the Pre.dev API to generate
a comprehensive, enterprise-grade deep specification for a complex project.
"""

import os
from predev_api import PredevAPI

# Get API key from environment variable or replace with your key
API_KEY = os.environ.get("PREDEV_API_KEY", "your_api_key_here")

# Initialize the predev client
predev = PredevAPI(api_key=API_KEY)

# Example 1: New Enterprise Project
print("Example 1: New Enterprise Healthcare Platform")
print("-" * 50)

try:
    result = predev.deep_spec(
        input_text="Build an enterprise healthcare management platform with patient records, appointment scheduling, billing, insurance processing, and HIPAA compliance for a multi-location hospital system",
        output_format="url"
    )
    print("✓ Deep spec generated successfully!")
    print(f"URL: {result.get('output')}")
    print(f"Is New Build: {result.get('isNewBuild')}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 2: Complex Feature Addition
print("Example 2: Feature Addition - AI Diagnostics")
print("-" * 50)

try:
    result = predev.deep_spec(
        input_text="Add AI-powered diagnostics, predictive analytics, and automated treatment recommendations",
        current_context="Existing platform has patient management, scheduling, basic reporting, built with React/Node.js/PostgreSQL, serves 50+ medical practices",
        output_format="url"
    )
    print("✓ Deep spec generated successfully!")
    print(f"URL: {result.get('output')}")
    print(f"Is New Build: {result.get('isNewBuild')}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 3: Async Mode (Recommended for Deep Specs)
print("Example 3: Async Mode - Fintech Platform")
print("-" * 50)

try:
    result = predev.deep_spec(
        input_text="Build a comprehensive fintech platform with banking, investments, crypto trading, regulatory compliance, and real-time market data",
        output_format="url",
        async_mode=True
    )
    print("✓ Request submitted!")
    print(f"Request ID: {result.get('requestId')}")
    print(f"Status: {result.get('status')}")
    print("\nNote: Deep specs take 2-3 minutes to process")
    print("Use client.get_spec_status(request_id) to check progress")
except Exception as e:
    print(f"✗ Error: {e}")
