FROM node:8.14.0-alpine
WORKDIR /app
COPY package-lock.json /app
RUN npm install express
RUN npm install mysql
COPY . /app
ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=zoo
ENV MYSQL_PORT=3306
EXPOSE 3000
EXPOSE 3306
CMD node index.js
