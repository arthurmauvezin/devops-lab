FROM node
COPY express.js /root
COPY package*.json ./
RUN npm install express
CMD npm start


