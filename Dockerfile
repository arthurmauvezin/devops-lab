FROM node:7
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node projet.js
EXPOSE 8081
