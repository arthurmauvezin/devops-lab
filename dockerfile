FROM node
COPY index.js /root/
RUN npm install express
RUN npm install mysql
CMD node /root/index.js
