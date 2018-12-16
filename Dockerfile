# specify the node base image with your desired version node:<version>
FROM node:7

WORKDIR /app

# copy application to /app directory and install dependencies
COPY package.json /app
RUN npm install
COPY . /app

#sets environement variables
ENV MYSQL_HOST '172.17.0.1/16'
ENV MYSQL_PORT '3306'
ENV MYSQL_DATABASE 'zoo'
ENV MYSQL_USER 'root'
ENV MYSQL_PASSWORD ''

# executed when the Docker image is launching
CMD node index.js

# replace this with your application's default port
EXPOSE 3000
