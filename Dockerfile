FROM mhart/alpine-node
 WORKDIR /Bureau/Alannah/docker/devops-lab
 COPY package.json ./
RUN npm install express mysql
 COPY . .
 CMD node ./index2.js
