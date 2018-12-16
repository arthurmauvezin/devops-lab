FROM alpine:latest

WORKDIR /app

COPY project.js /app

RUN apk add nodejs-current nodejs-npm
RUN npm install express
RUN npm install mysql

EXPOSE 3000

CMD node project.js
