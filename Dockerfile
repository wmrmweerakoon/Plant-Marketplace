# Multi-stage build for the Plant Marketplace application

# Stage 1: Build the client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Setup the server
FROM node:20-alpine
WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm install

# Copy server source code
COPY server/ .

# Copy the built client from the previous stage
COPY --from=client-build /app/client/dist ./../client/dist

# Expose the server port (Render will use the PORT environment variable)
EXPOSE $PORT

# Start the server
CMD ["node", "server.js"]
