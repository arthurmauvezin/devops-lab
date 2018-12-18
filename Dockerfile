FROM node:8.14.0-alpine
copy index3.js ./
RUN npm install express mysql
CMD node index3.js  
EXPOSE 3010 