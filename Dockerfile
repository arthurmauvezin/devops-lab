FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install express
RUN npm install mysql

COPY . .

EXPOSE 3000

CMD node webapi.js
