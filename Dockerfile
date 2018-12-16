#use official Node ligh alpine runtime as a parent image
FROM node:lts-alpine

#install needed packages (express for node & mysql for db)
RUN npm install express
RUN npm install mysql



#copy the current directory contents into the container at /app
COPY . .

ENV MYSQL_HOST = 172.17.0.1
ENV MYSQL_USER = root
ENV MYSQL_PASSWORD =root
ENV MYSQL_DATABASE = webServices
ENV MYSQL_PORT =3306

#make port 3000 available 
EXPOSE 3000

#run the zoo project
CMD node projet.js
