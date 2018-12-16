FROM node:8.11.4-alpine
#WORKDIR /app

#RUN apt-get update
#RUN apt-get install nodejs
#RUN apt-get install npm
RUN npm install express
RUN npm install mysql

COPY zooAT.js ./

#MOUNT ["/etc/mysql","/var/lib/mysql"] 
EXPOSE 3306
#CMD node zooAT.js
