FROM node
EXPOSE 3000
WORKDIR /test
ADD project.js /test/
RUN npm install express
RUN npm install mysql
CMD node project.js