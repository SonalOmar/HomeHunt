FROM node:18-bullseye
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies ignoring optional native modules
RUN npm install --legacy-peer-deps --ignore-optional

# Copy rest of the files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite in dev mode
CMD ["npm", "run", "dev"]
