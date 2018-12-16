FROM node

COPY index.js /root/

RUN npm install express mysql

CMD node /root/index.js

EXPOSE 3000