FROM node : 8
WORKDIR /app
COPY index.js /Users/yannisbelcaidleguyader/devops-lab/app
RUN npm install mysql
RUN npm install express
COPY /app
EXPOSE 3000
CMD node index.js
