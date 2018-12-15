FROM alpine:latest

WORKDIR /app

COPY index.js /app

RUN apk add nodejs-current nodejs-npm
RUN npm install express
RUN npm install mysql

COPY . /app

EXPOSE 3000 
EXPOSE 3306

CMD node index.js

