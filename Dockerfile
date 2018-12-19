FROM node:8
COPY package-lock.json ./
COPY index.js ./
RUN npm install express
RUN npm install mysql
CMD ["node","index.js"]
EXPOSE 3000