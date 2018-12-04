FROM node

#sets as the working directory
WORKDIR root/devops-lab

#install node packages
RUN npm install express
RUN npm install mysql


COPY . .
#
EXPOSE 3000

CMD node project.js
