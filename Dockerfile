# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Start the app
CMD ["serve", "-s", "dist", "-l", "80"]
