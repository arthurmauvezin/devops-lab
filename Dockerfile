FROM node
RUN npm install express
COPY . /root/
CMD node /root/index.js
