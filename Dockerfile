#Use the official node image from Dockerhub
FROM node

ENV MYSQL_HOST localhost
ENV MYSQL_PORT 3306
ENV MYSQL_DATABASE zoo
ENV MYSQL_USER root
ENV MYSQL_PASSWORD ""

COPY index.js /

EXPOSE 3000

RUN npm install express mysql body-parser

CMD node index.js
