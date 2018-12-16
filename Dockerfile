FROM node
EXPOSE 3000
WORKDIR /test
ADD app.js /test/
RUN npm install express
RUN npm install mysql
CMD node app.js