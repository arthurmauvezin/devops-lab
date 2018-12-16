FROM node:lts-alpine
WORKDIR /app
COPY index.js /app
RUN npm install mysql
RUN npm install express
CMD node index.js