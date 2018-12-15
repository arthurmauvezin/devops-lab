FROM node:8
WORKDIR /app
COPY package-lock.json /app
RUN npm install express
RUN npm install mysql
COPY . /app
CMD node index.js
EXPOSE 3000
