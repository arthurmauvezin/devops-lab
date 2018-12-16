#FROM node:alpine
FROM alpine:latest
WORKDIR /app

COPY zooAT.js /app

#RUN apk add nodejs-current nodejs-npm
RUN npm install express
RUN npm install mysql
#RUN npm install body-parser

#ENV MYSQL_HOST=10.75.0.1
ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=3306



EXPOSE 3000
#EXPOSE 3306

#CMD ["node", "zooAT.js"]
CMD node zooAT.js
