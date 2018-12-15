FROM alpine:latest

WORKDIR /app

COPY index.js /app

RUN apk add nodejs-current nodejs-npm
RUN npm install express
RUN npm install mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=3306

EXPOSE 3000
EXPOSE 3306

CMD node index.js