FROM node

RUN npm install express mysql

COPY zoo.js /Desktop/SéptimoSemestre(París)/devops-lab

EXPOSE 8080

CMD node zoo.js
