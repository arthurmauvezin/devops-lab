FROM node 
#dossier ou est notre fichier
WORKDIR /root/devops-lab

#lignes pour installer les bonnes librairies
RUN npm install express
RUN npm install mysql

COPY . .


CMD node project.js