# getting Base Image from 
FROM node:8.14.0-stretch

WORKDIR /app

RUN npm install express
RUN npm install mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=3306


EXPOSE 3000
EXPOSE 3306

COPY . /app

CMD node project.js