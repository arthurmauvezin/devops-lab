FROM node:lts-alpine
COPY index2.js /root/
RUN npm install express mysql
CMD node /root/index2.js
