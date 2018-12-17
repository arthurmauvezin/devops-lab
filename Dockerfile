FROM node:lts-alpine
 COPY index.js /root
 RUN npm install express
 RUN npm install mysql
 EXPOSE 3000
 CMD node /root/index.js