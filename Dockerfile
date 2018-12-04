FROM node
RUN npm install express
COPY . /root/
CMD node index.js
