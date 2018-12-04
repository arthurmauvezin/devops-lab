#Use the official node image from Dockerhub
FROM node

COPY index.js /

RUN npm install express mysql body-parser

CMD node index.js
