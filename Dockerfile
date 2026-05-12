# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev) for the build
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# TODO Install only production dependencies
RUN npm install

# Copy built application from builder
# Nitro/TanStack Start outputs to .output directory
COPY --from=builder /app/.output ./.output
#COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts .

# Expose the port Nitro runs on (default 3000)
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=database_url


# Start the application
# We use a script to handle migrations before starting the app
CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]
