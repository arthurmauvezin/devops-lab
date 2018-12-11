FROM node

#set this directory as our working directory
WORKDIR root/devops-lab

#install the necessary node packages in order to run our app
RUN npm install express
RUN npm install mysql

COPY . .

#opens up port 3000 on the machine in order to listen for a connection
EXPOSE 3000

CMD node index.js