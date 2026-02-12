#!/bin/bash

# Configuration
DOCKER_USERNAME="bfdevs2025"
REPO="nepaxis"
VERSION="1.0.0"

echo "🔨 Building AMD64 images for EC2..."

# Create builder if not exists
docker buildx create --name amd64builder --use 2>/dev/null || docker buildx use amd64builder

# Build and push backend
echo "📦 Building backend for AMD64..."
docker buildx build \
  --platform linux/amd64 \
  -f apps/backend/Dockerfile \
  -t $DOCKER_USERNAME/$REPO:backend-latest \
  -t $DOCKER_USERNAME/$REPO:backend-v$VERSION \
  --push \
  .

# Build and push frontend
echo "📦 Building frontend for AMD64..."
docker buildx build \
  --platform linux/amd64 \
  -f apps/frontend/Dockerfile \
  -t $DOCKER_USERNAME/$REPO:frontend-latest \
  -t $DOCKER_USERNAME/$REPO:frontend-v$VERSION \
  --push \
  .

echo "✅ AMD64 images built and pushed!"
echo ""
echo "Ready to deploy on EC2!"