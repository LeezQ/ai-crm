FROM node:20-slim AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Install dependencies (allowing lockfile updates)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm build

# 生产环境阶段
FROM node:20-slim AS runner
WORKDIR /app

# Install production environment dependencies
RUN npm install -g pnpm

# Copy standalone output from build stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start Next.js
CMD ["node", "server.js"]