FROM node:8
COPY lacave.js C:/wamp64/www/Web/lab_0/devops-lab/
RUN npm install express


RUN npm install mysql


ENV MYSQL_HOST=localhost
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=3306


EXPOSE 3000


CMD node C:/wamp64/www/Web/lab_0/devops-lab/lacave.js
