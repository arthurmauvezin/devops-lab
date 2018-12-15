FROM node
WORKDIR root/devops-lab

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_PORT=3306
ENV MYSQL_DATABASE=project
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=

RUN npm install express
RUN npm install mysql 

ADD index.js ./

RUN ls
EXPOSE 3000

CMD node index.