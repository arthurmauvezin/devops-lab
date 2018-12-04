FROM node
RUN npm install express
RUN npm install mysql
ADD zoo.js /devops-lab/
CMD node devops-lab/zoo.j