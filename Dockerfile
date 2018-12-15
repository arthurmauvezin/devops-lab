
FROM node:8.14.0-alpine
COPY . /root
RUN npm install express mysql
CMD node /root/project.js
EXPOSE  3002
