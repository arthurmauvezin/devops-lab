
FROM node:8
EXPOSE 3000
RUN npm install express
RUN npm install mysql
WORKDIR /root/devops-lab
ADD package.json /root/devops-lab/
ADD AugustinGuillot.js /root/devops-lab/

CMD node AugustinGuillot.js