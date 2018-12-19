From node:8
COPY package-lock.json ./
COPY projet.js ./
Run npm install express
Run npm install mysql
CMD ["node","projet.js"]