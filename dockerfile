FROM node:8
COPY queries.js /root/
RUN npm install express mysql
CMD node /root/queries.js
EXPOSE 8080