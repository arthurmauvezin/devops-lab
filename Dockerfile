FROM node:alpine

RUN npm install express
RUN npm install mysql
RUN npm install body-parser

ENV MYSQL_HOST=172.17.0.1
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root
ENV MYSQL_DATABASE=zooCorr
ENV MYSQL_PORT=3306

COPY . .

EXPOSE 3000
EXPOSE 3306

CMD ["node", "index.js"]
