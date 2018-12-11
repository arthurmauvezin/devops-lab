FROM node

WORKDIR root/devops-lab

COPY package*.json ./

RUN npm install express
RUN npm install mysql

RUN ./entrypoint.sh 

COPY . .
EXPOSE 3000

CMD node ZooProject.js
