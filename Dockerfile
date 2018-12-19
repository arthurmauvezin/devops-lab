FROM node:8.14.0-alpine
copy zoo.js /root/
RUN npm install express mysql
CMD node /root/zoo.js
EXPOSE 3010