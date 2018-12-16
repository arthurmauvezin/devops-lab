#FROM node:8.11.4-alpine
FROM node:alpine
#FROM alpine:latest
WORKDIR /app

#RUN apt-get update
#RUN apt-get install nodejs
#RUN apt-get install npm


COPY zooAT.js ./

RUN apk add nodejs-current nodejs-npm
RUN npm install express
RUN npm install mysql



ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=3306



#MOUNT ["/etc/mysql","/var/lib/mysql"] 
EXPOSE 3306
EXPOSE 3000
CMD node zooAT.js

