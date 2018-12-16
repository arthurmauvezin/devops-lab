

FROM node:lts-alpine

COPY index.js /root/

RUN npm install express mysql

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_PORT=8889
ENV MYSQL_DATABASE=project
ENV MYSQL_LOGIN=root
ENV MYSQL_PASSWORD=root

EXPOSE 3000

CMD node /root/index.js