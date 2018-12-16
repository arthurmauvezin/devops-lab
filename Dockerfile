FROM node:8

WORKDIR /app
RUN npm install express
RUN npm install mysql
RUN npm install body-parser

COPY project.js /app

CMD node /app/project.js

EXPOSE 3000