FROM node

WORKDIR /Desktop/devops-lab

COPY zoo.js /Desktop/devops-lab

RUN npm install express mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_ROOT_PASSWORD=root123
ENV MYSQL_DATABASE=iban
ENV MYSQL_PORT=3306

EXPOSE 3000
EXPOSE 3306

CMD node zoo.js
