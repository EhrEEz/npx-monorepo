#!/bin/bash

# Configuration
DOCKER_USERNAME="bfdevs2025"
REPO="nepaxis"
VERSION="1.2.0"

# Initial State
BUILD_FRONTEND=false
BUILD_BACKEND=false
PUSH_FLAG="--load"

# Parse flags
while getopts "fbp" opt; do
    case $opt in
        f) BUILD_FRONTEND=true ;;
        b) BUILD_BACKEND=true ;;
        p) PUSH_FLAG="--push" ;;
        *) echo "Usage: $0 [-f] [-b] [-p]"; exit 1 ;;
    esac
done

# If neither -f nor -b is specified, build both
if [ "$BUILD_FRONTEND" = false ] && [ "$BUILD_BACKEND" = false ]; then
    BUILD_FRONTEND=true
    BUILD_BACKEND=true
fi

# Ensure builder exists
docker buildx create --name amd64builder --use 2>/dev/null || docker buildx use amd64builder

echo "🔨 Starting AMD64 build process..."
[ "$PUSH_FLAG" == "--push" ] && echo "🚀 Push mode enabled."

# Backend Build
if [ "$BUILD_BACKEND" = true ]; then
    echo "📦 Building backend..."
    docker buildx build \
        --platform linux/amd64 \
        -f apps/backend/Dockerfile \
        -t $DOCKER_USERNAME/$REPO:backend-latest \
        -t $DOCKER_USERNAME/$REPO:backend-v$VERSION \
        $PUSH_FLAG .
fi

# Frontend Build
if [ "$BUILD_FRONTEND" = true ]; then
    echo "📦 Building frontend..."
    docker buildx build \
        --platform linux/amd64 \
        -f apps/frontend/Dockerfile \
        -t $DOCKER_USERNAME/$REPO:frontend-latest \
        -t $DOCKER_USERNAME/$REPO:frontend-v$VERSION \
        $PUSH_FLAG .
fi

echo "✅ Task completed using $PUSH_FLAG"
