FROM node
RUN npm install
COPY . /app
CMD node index2.js
