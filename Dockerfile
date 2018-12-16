FROM node

#sets as the working directory
WORKDIR root/devops-lab

#install node packages
RUN npm install express
RUN npm install mysql

#environment variable declaration
ENV MYSQL_HOST loaclhost
ENV MYSQL_PORT 3306
ENV MYSQL_DATABASE webproject
ENV MYSQL_USER root
ENV MYSQL_PASSWORD ''


COPY . .
#
EXPOSE 3000

CMD node project.js
