# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Set environment variables if needed
# ENV NEXT_PUBLIC_API_URL=http://localhost:3002/api

RUN pnpm build

# Stage 2: Serve static files with Nginx
FROM nginx:stable-alpine

# Copy built static files from the builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy Nginx configuration
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]