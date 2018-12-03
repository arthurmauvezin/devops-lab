FROM node:8
EXPOSE 3306

COPY index.js /root/

RUN npm install express
RUN npm install mysql

CMD node /root/index.js