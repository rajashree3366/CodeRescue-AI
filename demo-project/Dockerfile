# Use official Node.js LTS slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency manifest first for layer caching
COPY package.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the application files
COPY server.js ./
COPY CodeRescue.html ./
COPY src/ ./src/

# Expose the application port
EXPOSE 4000

# Set environment variable default
ENV PORT=4000

# Start the server
CMD ["node", "server.js"]
