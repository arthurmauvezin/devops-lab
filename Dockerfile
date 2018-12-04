# specify the node base image with your desired version node:<version>
FROM node:10

WORKDIR /app
RUN npm init
RUN npm install express
CMD node index.js

# replace this with your application's default port
EXPOSE 3000