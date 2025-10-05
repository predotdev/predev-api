"""
Example: Check specification status

This example demonstrates how to check the status of an async
specification generation request.
"""

import os
import time
from predev_api import PredevAPI

# Get API key from environment variable or replace with your key
API_KEY = os.environ.get("PREDEV_API_KEY", "your_api_key_here")

# Initialize the client
client = PredevAPI(api_key=API_KEY)

# Example: Generate a spec and check its status
print("Generating a specification...")
print("-" * 50)

try:
    # Generate a fast spec
    result = client.fast_spec(
        input_text="Build a social media dashboard with analytics",
        output_format="url"
    )
    print("✓ Request submitted successfully!")
    print(f"Initial result: {result}")
    
    # If the response contains a spec_id, we can check its status
    if "spec_id" in result or "id" in result:
        spec_id = result.get("spec_id") or result.get("id")
        
        print(f"\nChecking status for spec ID: {spec_id}")
        print("-" * 50)
        
        # Poll for status (in a real application, you'd do this less frequently)
        max_attempts = 5
        for attempt in range(max_attempts):
            time.sleep(2)  # Wait 2 seconds between checks
            
            status_result = client.get_spec_status(spec_id)
            print(f"Attempt {attempt + 1}: {status_result}")
            
            if status_result.get("status") == "completed":
                print("\n✓ Specification generation completed!")
                break
    else:
        print("\nNote: Response format may vary. Check API documentation for details.")
        
except Exception as e:
    print(f"✗ Error: {e}")
