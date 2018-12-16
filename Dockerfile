FROM node

WORKDIR /root/

RUN npm install express mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=zoo
ENV MYSQL_PORT=3306

EXPOSE 3000
EXPOSE 3306

COPY . /root/


CMD node zoo.js