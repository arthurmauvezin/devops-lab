FROM node

WORKDIR /Users/Rim/Desktop/devops-lab

COPY index.js /Users/Rim/Desktop/devops-lab

RUN npm install express
RUN npm install mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV MYSQL_DATABASE=nodejs
ENV MYSQL_PORT=3306

EXPOSE 3000

CMD node index.js
