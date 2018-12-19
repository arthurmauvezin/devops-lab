FROM node:8.14.0-alpine
COPY . /root/
RUN npm install express mysql
CMD node /root/index.js
EXPOSE  3000