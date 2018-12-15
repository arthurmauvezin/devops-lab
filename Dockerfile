FROM node:8
WORKDIR /Users/val50/Desktop/devops-lab/image
COPY package.json /Users/val50/Desktop/devops-lab/image
RUN npm install
COPY . /Users/val50/Desktop/devops-lab/image
CMD node index.js
EXPOSE 3000