FROM node

WORKDIR root/devops-lab

RUN npm install express
RUN npm install mysql

COPY . .

EXPOSE 3000

CMD node index.js