# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies) to build the app
RUN npm ci

# Copy the entire project code
COPY . .

# Build the client SPA bundles and server bundles
RUN npm run build

# Remove development files and devDependencies for lightweight production runtime
RUN npm prune --production


# --- Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary production artifacts from build stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# The container will run on port 3000
EXPOSE 3000

# Start command
CMD ["npm", "start"]
