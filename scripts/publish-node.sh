#!/bin/bash

# Script to bump version and publish Node.js package
# Usage: ./scripts/publish-node.sh [patch|minor|major] [--skip-tests] [--skip-build]
# 
# Options:
#   patch|minor|major  Version bump type (default: patch)
#   --skip-tests       Skip running tests
#   --skip-build       Skip building the package
#   --dry-run          Show what would be done without actually publishing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "predev-api-node/package.json" ]; then
    print_error "This script must be run from the repository root"
    exit 1
fi

# Change to Node.js package directory
cd predev-api-node

# Parse command line arguments
VERSION_TYPE="patch"
SKIP_TESTS=false
SKIP_BUILD=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        patch|minor|major)
            VERSION_TYPE="$1"
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            print_status "Usage: $0 [patch|minor|major] [--skip-tests] [--skip-build] [--dry-run]"
            exit 1
            ;;
    esac
done

print_status "Starting Node.js package publish process..."
print_status "Version bump type: $VERSION_TYPE"

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Working directory is not clean. Please commit or stash changes first."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Aborted."
        exit 1
    fi
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Bump version
print_status "Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_status "New version: $NEW_VERSION"

# Build the package
if [ "$SKIP_BUILD" = false ]; then
    print_status "Building package..."
    npm run build
else
    print_status "Skipping build (--skip-build flag)"
fi

# Run tests
if [ "$SKIP_TESTS" = false ]; then
    print_status "Running tests..."
    npm test
else
    print_status "Skipping tests (--skip-tests flag)"
fi

# Check if package is already published
print_status "Checking if version $NEW_VERSION is already published..."
if npm view predev-api@$NEW_VERSION version > /dev/null 2>&1; then
    print_error "Version $NEW_VERSION is already published!"
    exit 1
fi

# Publish to npm
if [ "$DRY_RUN" = true ]; then
    print_status "DRY RUN: Would publish to npm..."
    print_status "DRY RUN: Would create git tag v$NEW_VERSION"
else
    print_status "Publishing to npm..."
    npm publish
    
    # Create git tag
    print_status "Creating git tag..."
    git add package.json
    # Only add package-lock.json if it exists
    if [ -f "package-lock.json" ]; then
        git add package-lock.json
    fi
    git commit -m "chore: bump version to $NEW_VERSION"
    git tag "v$NEW_VERSION"
fi

print_success "Successfully published predev-api@$NEW_VERSION to npm!"
print_status "Don't forget to push the changes and tag:"
print_status "  git push origin main"
print_status "  git push origin v$NEW_VERSION"
