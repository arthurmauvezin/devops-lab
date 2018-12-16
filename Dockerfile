FROM node
EXPOSE 80
RUN npm install express
RUN npm install mysql
ADD project.js /devops-lab/
CMD node devops-lab/project.js
