FROM node:lts-alpine
COPY index2.js /root/
RUN npm install express mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=8888

CMD node /root/index2.js
