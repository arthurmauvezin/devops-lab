FROM node:8.14.0-alpine
RUN npm install express mysql
CMD node /index3.js  
EXPOSE 3010 