FROM node:lts-alpine

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install

COPY . .

ADD index.js /devops-lab/

CMD node devops-lab/index.js
