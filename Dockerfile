From node:8
COPY package-lock.json ./
COPY index.js ./
Run npm install express
Run npm install mysql
CMD ["node","index.js"]