#!/bin/bash

# Unified deployment script for both Node.js and Python packages
# Usage: ./scripts/deploy.sh [patch|minor|major] [options]
# 
# Options:
#   patch|minor|major  Version bump type (default: patch)
#   --node-only        Deploy only Node.js package
#   --python-only      Deploy only Python package
#   --skip-tests       Skip running tests for both packages
#   --skip-build       Skip building both packages
#   --dry-run          Show what would be done without actually publishing
#   --use-doppler      Use Doppler for PyPI credentials (default: true)
#   --sequential       Run deployments sequentially instead of in parallel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_node() {
    echo -e "${CYAN}[NODE]${NC} $1"
}

print_python() {
    echo -e "${YELLOW}[PYTHON]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "predev-api-node/package.json" ] || [ ! -f "predev-api-python/setup.py" ]; then
    print_error "This script must be run from the repository root"
    exit 1
fi

# Parse command line arguments
VERSION_TYPE="patch"
NODE_ONLY=false
PYTHON_ONLY=false
SKIP_TESTS=false
SKIP_BUILD=false
DRY_RUN=false
USE_DOPPLER=true
SEQUENTIAL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        patch|minor|major)
            VERSION_TYPE="$1"
            shift
            ;;
        --node-only)
            NODE_ONLY=true
            shift
            ;;
        --python-only)
            PYTHON_ONLY=true
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
        --use-doppler)
            USE_DOPPLER=true
            shift
            ;;
        --no-doppler)
            USE_DOPPLER=false
            shift
            ;;
        --sequential)
            SEQUENTIAL=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            print_status "Usage: $0 [patch|minor|major] [--node-only] [--python-only] [--skip-tests] [--skip-build] [--dry-run] [--use-doppler|--no-doppler] [--sequential]"
            exit 1
            ;;
    esac
done

# Validate arguments
if [ "$NODE_ONLY" = true ] && [ "$PYTHON_ONLY" = true ]; then
    print_error "Cannot use both --node-only and --python-only"
    exit 1
fi

print_status "Starting unified deployment process..."
print_status "Version bump type: $VERSION_TYPE"
print_status "Deploy Node.js: $([ "$PYTHON_ONLY" = true ] && echo "false" || echo "true")"
print_status "Deploy Python: $([ "$NODE_ONLY" = true ] && echo "false" || echo "true")"
print_status "Use Doppler: $USE_DOPPLER"
print_status "Sequential: $SEQUENTIAL"
print_status "Dry run: $DRY_RUN"

# Build command arguments
SCRIPT_ARGS="$VERSION_TYPE"
if [ "$SKIP_TESTS" = true ]; then
    SCRIPT_ARGS="$SCRIPT_ARGS --skip-tests"
fi
if [ "$SKIP_BUILD" = true ]; then
    SCRIPT_ARGS="$SCRIPT_ARGS --skip-build"
fi
if [ "$DRY_RUN" = true ]; then
    SCRIPT_ARGS="$SCRIPT_ARGS --dry-run"
fi

# Function to deploy Node.js package
deploy_node() {
    print_node "Starting Node.js deployment..."
    if [ "$USE_DOPPLER" = true ]; then
        doppler run -- ./scripts/publish-node.sh $SCRIPT_ARGS
    else
        ./scripts/publish-node.sh $SCRIPT_ARGS
    fi
    print_node "Node.js deployment completed!"
}

# Function to deploy Python package
deploy_python() {
    print_python "Starting Python deployment..."
    if [ "$USE_DOPPLER" = true ]; then
        doppler run -- ./scripts/publish-python.sh $SCRIPT_ARGS
    else
        ./scripts/publish-python.sh $SCRIPT_ARGS
    fi
    print_python "Python deployment completed!"
}

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

# Deploy packages
if [ "$SEQUENTIAL" = true ]; then
    # Sequential deployment
    if [ "$PYTHON_ONLY" != true ]; then
        deploy_node
    fi
    if [ "$NODE_ONLY" != true ]; then
        deploy_python
    fi
else
    # Parallel deployment
    if [ "$PYTHON_ONLY" = true ]; then
        deploy_python
    elif [ "$NODE_ONLY" = true ]; then
        deploy_node
    else
        # Deploy both in parallel
        print_status "Deploying both packages in parallel..."
        
        # Start both deployments in background
        deploy_node &
        NODE_PID=$!
        
        deploy_python &
        PYTHON_PID=$!
        
        # Wait for both to complete
        wait $NODE_PID
        NODE_EXIT_CODE=$?
        
        wait $PYTHON_PID
        PYTHON_EXIT_CODE=$?
        
        # Check if both succeeded
        if [ $NODE_EXIT_CODE -eq 0 ] && [ $PYTHON_EXIT_CODE -eq 0 ]; then
            print_success "Both packages deployed successfully!"
        else
            print_error "Deployment failed!"
            if [ $NODE_EXIT_CODE -ne 0 ]; then
                print_error "Node.js deployment failed with exit code $NODE_EXIT_CODE"
            fi
            if [ $PYTHON_EXIT_CODE -ne 0 ]; then
                print_error "Python deployment failed with exit code $PYTHON_EXIT_CODE"
            fi
            exit 1
        fi
    fi
fi

print_success "Unified deployment completed successfully!"
print_status "Don't forget to push the changes and tags:"
print_status "  git push origin main"
if [ "$PYTHON_ONLY" != true ]; then
    print_status "  git push origin v*"
fi
if [ "$NODE_ONLY" != true ]; then
    print_status "  git push origin python-v*"
fi
