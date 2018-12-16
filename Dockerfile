FROM node

RUN npm install express
RUN npm install mysql

ADD index.js /devops-lab/

CMD node devops-lab/index.js
