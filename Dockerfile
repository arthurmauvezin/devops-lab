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


#MOUNT ["/etc/mysql","/var/lib/mysql"] 
#EXPOSE 3306
CMD node zooAT.js
