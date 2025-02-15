# Use Node.js as base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "dev"]