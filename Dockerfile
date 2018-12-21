FROM node:8.14.0-alpine
COPY . /Users/mevaranarison/Documents/GitHub/devops-lab/
RUN npm install express mysql
CMD node Users/mevaranarison/Documents/GitHub/devops-lab/projet.js
EXPOSE 3000