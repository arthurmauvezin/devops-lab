FROM node

WORKDIR root/devops-lab

COPY package*.json ./

RUN npm install express
RUN npm install mysql

COPY . .
EXPOSE 3000

CMD node ZooProject.js
