#Use the offial node from Dockerhub FROM node

FROM node
EXPOSE 3000
WORKDIR /imagetuto
ADD index.js /imagetuto/
RUN npm install express
RUN npm install body-parser
RUN npm install mysql
CMD node index.js
