# Use the latest LTS version of Node.js
FROM node:lts-alpine

# Create an API directory
WORKDIR /usr/src/api

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle my API's source code
COPY . .

# Enable the port used by the API
EXPOSE 3000

# Launch the Node.js server
CMD ["node", "index.js"]
