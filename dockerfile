FROM node
WORKDIR /app
COPY indexfinal.js /app
RUN npm install mysql
RUN npm install express
EXPOSE 3000
CMD node indexfinal.js