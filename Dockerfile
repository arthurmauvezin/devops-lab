FROM node:7
WORKDIR /app

RUN npm install express
RUN npm install MySQL
COPY . /app

CMD node zooAT.js
