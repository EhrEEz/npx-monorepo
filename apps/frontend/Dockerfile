# 1. Base Layer
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies Layer
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
# Use --frozen-lockfile for deterministic builds
RUN npm ci

# 3. Builder Layer
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
# Copy only necessary workspace files to avoid context bloat
COPY . .
WORKDIR /app/apps/frontend

ARG PUBLIC_API_URL
ARG PUBLIC_CLIENT_URL
ARG PUBLIC_WEB3FORMS_ACCESS_KEY
ENV NODE_ENV=production
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_CLIENT_URL=${PUBLIC_CLIENT_URL}
ENV PUBLIC_WEB3FORMS_ACCESS_KEY=${PUBLIC_WEB3FORMS_ACCESS_KEY}

RUN npm run build

# 4. Runner Layer
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 svelte

# Only copy the build output and the minimal adapter files
# SvelteKit Node adapter usually requires package.json to resolve modules
COPY --from=builder --chown=svelte:nodejs /app/apps/frontend/build ./build
COPY --from=builder --chown=svelte:nodejs /app/apps/frontend/package.json ./package.json

# If using @sveltejs/adapter-node, you need production deps
# Instead of a fresh install, copy pruned modules if possible, 
# or install strictly what is needed.
RUN npm install --omit=dev --ignore-scripts && \
    npm cache clean --force

USER svelte
EXPOSE 5173
CMD ["node", "build/index.js"]