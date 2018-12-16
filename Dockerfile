FROM node
EXPOSE 80
RUN npm install express
RUN npm install mysql
ENV MYSQL_HOST "localhost"
ENV MYSQL_USER "root"
ENV MYSQL_PASSWORD ""
ENV MYSQL_DATABASE "zoo"
ENV MYSQL_PORT 3000
ADD project.js /devops-lab/
CMD node devops-lab/project.js
