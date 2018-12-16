FROM node
ADD index.js /root/
RUN npm install express mysql
CMD node /root/index.js