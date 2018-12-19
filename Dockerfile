FROM node:8
COPY zoo3.js C:/Users/colin/OneDrive/Documents/GitHub/devops-lab/
RUN npm install express 
RUN npm install mysql


ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root
ENV MYSQL_DATABASE=project
ENV MYSQL_PORT=3306
EXPOSE 3000

CMD node C:/Users/colin/OneDrive/Documents/GitHub/devops-lab/zoo3.js 