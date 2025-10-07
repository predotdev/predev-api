#!/bin/bash

# Script to bump version and publish Python package
# Usage: ./scripts/publish-python.sh [patch|minor|major]

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
if [ ! -f "predev-api-python/setup.py" ]; then
    print_error "This script must be run from the repository root"
    exit 1
fi

# Change to Python package directory
cd predev-api-python

# Get the version bump type (default to patch)
VERSION_TYPE=${1:-patch}

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type. Use: patch, minor, or major"
    exit 1
fi

print_status "Starting Python package publish process..."
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
CURRENT_VERSION=$(python -c "import re; print(re.search(r'version=\"([^\"]+)\"', open('setup.py').read()).group(1))")
print_status "Current version: $CURRENT_VERSION"

# Parse version components
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Calculate new version
case $VERSION_TYPE in
    patch)
        NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
        ;;
    minor)
        NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
        ;;
    major)
        NEW_VERSION="$((MAJOR + 1)).0.0"
        ;;
esac

print_status "New version: $NEW_VERSION"

# Update version in setup.py
print_status "Updating version in setup.py..."
sed -i.bak "s/version=\"$CURRENT_VERSION\"/version=\"$NEW_VERSION\"/" setup.py
rm setup.py.bak

# Check if package is already published
print_status "Checking if version $NEW_VERSION is already published..."
if pip index versions predev-api | grep -q "$NEW_VERSION"; then
    print_error "Version $NEW_VERSION is already published!"
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/ build/ *.egg-info/

# Build the package
print_status "Building package..."
python -m build

# Run tests
print_status "Running tests..."
python -m pytest

# Publish to PyPI
print_status "Publishing to PyPI..."
python -m twine upload dist/*

# Create git tag
print_status "Creating git tag..."
git add setup.py
git commit -m "chore: bump version to $NEW_VERSION"
git tag "python-v$NEW_VERSION"

print_success "Successfully published predev-api@$NEW_VERSION to PyPI!"
print_status "Don't forget to push the changes and tag:"
print_status "  git push origin main"
print_status "  git push origin python-v$NEW_VERSION"
