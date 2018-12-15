FROM node:8
WORKDIR /app
COPY package-lock.json /app
RUN npm install
COPY . /app
CMD node index.js
EXPOSE 3000