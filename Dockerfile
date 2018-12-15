FROM dockerfile/ubuntu
WORKDIR /app

RUN apt-get update
RUN apt-get install nodejs
RUN apt-get install npm
RUN apt-get install express
RUN apt-get install mysql

COPY zooAT.js ./

MOUNT ["/etc/mysql","/var/lib/mysql"] 
EXPOSE 3306
CMD node zooAT.js
