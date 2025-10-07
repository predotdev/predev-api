#!/bin/bash

# Script to bump version and publish Node.js package
# Usage: ./scripts/publish-node.sh [patch|minor|major]

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

# Get the version bump type (default to patch)
VERSION_TYPE=${1:-patch}

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type. Use: patch, minor, or major"
    exit 1
fi

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
print_status "Building package..."
npm run build

# Run tests
print_status "Running tests..."
npm test

# Check if package is already published
print_status "Checking if version $NEW_VERSION is already published..."
if npm view predev-api@$NEW_VERSION version > /dev/null 2>&1; then
    print_error "Version $NEW_VERSION is already published!"
    exit 1
fi

# Publish to npm
print_status "Publishing to npm..."
npm publish

# Create git tag
print_status "Creating git tag..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

print_success "Successfully published predev-api@$NEW_VERSION to npm!"
print_status "Don't forget to push the changes and tag:"
print_status "  git push origin main"
print_status "  git push origin v$NEW_VERSION"
