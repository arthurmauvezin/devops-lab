FROM node:8-jessie

copy zoo.js /root/

RUN npm install express mysql

CMD node /root/zoo.js