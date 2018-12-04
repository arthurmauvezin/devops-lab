FROM node
COPY index.js /
RUN npm install express mysql
CMD node index.js