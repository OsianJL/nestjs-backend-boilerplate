# Dockerfile
FROM node:20-alpine

# Set workdir
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Build the app
RUN npm run build

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
