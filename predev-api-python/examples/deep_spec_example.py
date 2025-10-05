"""
Example: Generate a deep specification

This example demonstrates how to use the Pre.dev API to generate
a comprehensive, enterprise-grade deep specification for a complex project.
"""

import os
from predev_api import PredevAPI

# Get API key from environment variable or replace with your key
API_KEY = os.environ.get("PREDEV_API_KEY", "your_api_key_here")

# Initialize the client
client = PredevAPI(api_key=API_KEY)

# Example 1: Generate a deep spec for an ERP system
print("Example 1: Enterprise Resource Planning System")
print("-" * 50)

try:
    result = client.deep_spec(
        input_text="Build an enterprise resource planning (ERP) system with modules for inventory management, financial tracking, HR management, and supply chain optimization",
        output_format="url"
    )
    print("✓ Deep spec generated successfully!")
    print(f"Result: {result}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n")

# Example 2: Generate a deep spec for a healthcare platform
print("Example 2: Healthcare Management Platform")
print("-" * 50)

try:
    result = client.deep_spec(
        input_text="Create a HIPAA-compliant healthcare management platform with patient records, appointment scheduling, telemedicine capabilities, and insurance integration",
        output_format="url"
    )
    print("✓ Deep spec generated successfully!")
    print(f"Result: {result}")
except Exception as e:
    print(f"✗ Error: {e}")
