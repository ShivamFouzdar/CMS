# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (cache optimization)
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDeps for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
# Adjust this command if your build script differs (e.g., tsc)
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built artifacts from builder stage (Assuming dist/ or build/ output)
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose API port
EXPOSE 5000

# Start command (using node directly on compiled entry point)
CMD ["node", "dist/app.js"]
