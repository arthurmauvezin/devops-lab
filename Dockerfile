FROM node

COPY . /root/

RUN npm install express mysql body-parser

CMD node /root/index.js

EXPOSE 3000