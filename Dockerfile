
FROM node:10
EXPOSE 3000

RUN npm install express
WORKDIR C:/Users/Benjamin/Documents/DevOps/devops-lab
ADD . 
VOLUME ./app
CMD node index.js
