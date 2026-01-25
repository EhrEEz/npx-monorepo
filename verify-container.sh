#!/bin/bash
echo "=== Current working directory ==="
docker-compose exec backend pwd

echo -e "\n=== Contents of /app ==="
docker-compose exec backend ls -la /app

echo -e "\n=== Contents of /app/apps ==="
docker-compose exec backend ls -la /app/apps

echo -e "\n=== Contents of /app/apps/backend ==="
docker-compose exec backend ls -la /app/apps/backend

echo -e "\n=== Looking for payload.config.ts ==="
docker-compose exec backend find /app -name "payload.config.ts" -type f

echo -e "\n=== Looking for tsconfig.json ==="
docker-compose exec backend find /app -name "tsconfig.json" -type f
