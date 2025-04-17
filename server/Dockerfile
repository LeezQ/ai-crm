FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Install ONLY production dependencies first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Install ALL dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Build the project (compiles TS to JS and resolves aliases)
RUN pnpm build

# Remove dev dependencies after build
RUN pnpm prune --prod

# Database migration (if needed)
# RUN pnpm db:migrate

EXPOSE 3002

CMD ["pnpm", "start"]