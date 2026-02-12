FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/backend/package.json ./apps/backend/
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/apps/backend
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3010

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 payload

# Copy standalone output
COPY --from=builder --chown=payload:nodejs /app/apps/backend/.next/standalone ./
COPY --from=builder --chown=payload:nodejs /app/apps/backend/.next/static ./apps/backend/.next/static
COPY --from=builder --chown=payload:nodejs /app/apps/backend/public ./apps/backend/public

USER payload

EXPOSE 3010

CMD ["node", "apps/backend/server.js"]