 FROM node
 WORKDIR /Users/clementdebailliencourt/Jet\ Brains\ Projects/Java/devops-lab
 RUN npm install express
 RUN node index.js
 EXPOSE 3000 