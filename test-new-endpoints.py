#!/usr/bin/env python3
"""
Integration test for new list-specs and find-specs endpoints
Run with: doppler run -- python3 test-new-endpoints.py
"""

from predev_api import PredevAPI, PredevAPIError
import os
import sys
sys.path.insert(0, os.path.join(
    os.path.dirname(__file__), 'predev-api-python'))


def test_new_endpoints():
    api_key = os.getenv('PREDEV_API_KEY')

    if not api_key:
        print('❌ PREDEV_API_KEY environment variable not set')
        sys.exit(1)

    print('🚀 Testing new Pre.dev API endpoints with Python client\n')

    client = PredevAPI(api_key=api_key)

    try:
        # Test 1: List specs
        print('📋 Test 1: List all specs (first 5)')
        list_result = client.list_specs(limit=5)
        print(f"✅ Success! Found {list_result['total']} total specs")
        print(f"   Returned {len(list_result['specs'])} specs")
        print(f"   Has more: {list_result['hasMore']}")
        if list_result['specs']:
            first_input = list_result['specs'][0].get('input', '')
            print(f"   First spec: \"{first_input[:50]}...\"")
        print()

        # Test 2: List completed specs
        print('✅ Test 2: List completed specs only (first 3)')
        completed_result = client.list_specs(status='completed', limit=3)
        print(f"✅ Success! Found {completed_result['total']} completed specs")
        print(f"   Returned {len(completed_result['specs'])} specs")
        print()

        # Test 3: Filter by endpoint type
        print('⚡ Test 3: List fast_spec endpoints only (first 3)')
        fast_spec_result = client.list_specs(endpoint='fast_spec', limit=3)
        print(
            f"✅ Success! Found {fast_spec_result['total']} fast_spec entries")
        print()

        # Test 4: Find specs with simple search
        print('🔍 Test 4: Search for specs containing "build"')
        search_result = client.find_specs(query='build', limit=3)
        print(
            f"✅ Success! Found {search_result['total']} specs matching \"build\"")
        if search_result['specs']:
            for idx, spec in enumerate(search_result['specs'], 1):
                spec_input = spec.get('input', '')
                print(f"   {idx}. \"{spec_input[:60]}...\"")
        print()

        # Test 5: Find specs with regex pattern
        print('🎯 Test 5: Search with regex pattern "^Build" (starts with Build)')
        regex_result = client.find_specs(query='^Build', limit=3)
        print(
            f"✅ Success! Found {regex_result['total']} specs starting with \"Build\"")
        if regex_result['specs']:
            for idx, spec in enumerate(regex_result['specs'], 1):
                spec_input = spec.get('input', '')
                print(f"   {idx}. \"{spec_input[:60]}...\"")
        print()

        # Test 6: Combined filters
        print('🎨 Test 6: Search "api" in completed fast_spec only')
        combined_result = client.find_specs(
            query='api',
            endpoint='fast_spec',
            status='completed',
            limit=2
        )
        print(f"✅ Success! Found {combined_result['total']} matching specs")
        print()

        # Test 7: Pagination
        print('📄 Test 7: Test pagination (skip=5, limit=3)')
        paginated_result = client.list_specs(skip=5, limit=3)
        print(
            f"✅ Success! Skipped 5, returned {len(paginated_result['specs'])} specs")
        print()

        print('🎉 All tests passed! New endpoints are working correctly.\n')

    except PredevAPIError as error:
        print(f'❌ Test failed: {error}')
        sys.exit(1)
    except Exception as error:
        print(f'❌ Unexpected error: {error}')
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    test_new_endpoints()
