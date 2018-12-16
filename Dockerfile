FROM node
RUN npm install express
RUN npm install mysql
COPY . /root/
CMD node /root/index.js
