#!/bin/bash

echo "🧪 Running Pre.dev API Node.js Tests"
echo "====================================="
echo ""

# Check if Doppler is available
if ! command -v doppler &> /dev/null; then
    echo "❌ Doppler CLI is not installed. Please install Doppler first."
    exit 1
fi

# Run sync test
echo "📋 Running synchronous fast spec test..."
echo "----------------------------------------"
if doppler run -- node test-sync.js; then
    echo "✅ Sync test passed!"
else
    echo "❌ Sync test failed!"
    exit 1
fi

echo ""
echo "📋 Running asynchronous fast spec test..."
echo "------------------------------------------"
if doppler run -- node test-async.js; then
    echo "✅ Async test passed!"
else
    echo "❌ Async test failed!"
    exit 1
fi

echo ""
echo "🎉 All tests completed successfully!"
