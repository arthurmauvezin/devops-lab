FROM node

COPY package.json/app

RUN npm install

COPY . /app

CMD node index.js               