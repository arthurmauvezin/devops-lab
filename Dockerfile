

FROM node:8.14.0-jessie
 COPY index.js ./
 RUN npm install express
 RUN npm install mysql
 EXPOSE 3000
 CMD [ "node", "index.js" ]