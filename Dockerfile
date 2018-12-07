FROM node

COPY package.json/app

RUN npm install

CMD node index.js               