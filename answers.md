# Answers

Lastname: Mignot
Firstname: Gautier

## 2.2
La première commande permet de build le dockerfile et de créer une image avec
le nomque l'on souhaite. La deuxième commande permet de run notre application.
Le run s'effectue correctement et l'output "App listening on port 3000!" Nous le confirme

command:docker build -t node-docker-tutorial .
docker run -it -p 9000:3000 node-docker-tutorial

## 2.3
question: Cela ne marchait car le port n'est pas ouvert, pour régler ce problème 
il faut ouvrir le port dans le dockerfile
command: EXPOSE 3000 

## 2.5
question: Il se connecter à son dockerhub pour pouvoir push. Il fau ensuite changer
le nom de l'image pour matcher avec son repository
command: docker login
docker tag node-docker-tutorial:latest mgautierm/devop-labgautier:firsttry
docker push mgautierm/devop-labgautier:firsttry
## 2.6
command:

question:
command:

command:

## 2.7
question:
question:
command:

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
