FROM node
WORKDIR /app
COPY zoo.js /app
RUN npm install express
RUN npm install mysql
ENV MYSQL_HOST=localhost
ENV MYSQL_PORT=3306
ENV MYSQL_DATABASE=zoo
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD= 
EXPOSE 3000
CMD node zoo.js
    
