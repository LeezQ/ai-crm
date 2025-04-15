FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Database migration (if needed)
# RUN pnpm db:migrate

EXPOSE 3002

CMD ["pnpm", "start"]