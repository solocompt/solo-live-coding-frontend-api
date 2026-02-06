# Build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./dist

# Create the database directory ensuring it exists
RUN mkdir -p src/database

# Copy any existing database if needed (optional, usually handled by volume)
# COPY src/database/database.sqlite src/database/

EXPOSE 3000

# Command to run migrations and then start the app
CMD ["sh", "-c", "npm run migration:prod && npm run start:prod"]
