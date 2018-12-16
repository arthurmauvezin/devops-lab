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

question:Pour delete les images, il faut d'abord delete les containers attachés 
aux images

command:docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images -q)


question:On creer un container vide puis on met prend l'image sur dockerhub
command:docker pull mgautierm/devop-labgautier
docker create mgautierm/devop-labgautier
docker run mgautierm/devop-labgautier
docker ps -a

## 2.7
question: Pour voir si le statut des containers on utilise docker ps -a
question: Pour rename le docker on utilise la fonction rename avec AncienNom
Nouveaunom
command: docker ps -a

command: docker rename dreamy_chandrasekhar hello

## 2.8
question:
command: docker run -it mgautierm/devop-labgautier /bin/bash
output:root@34db0eabbef1:/test# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
## 3.1
command: docker-compose up

## 3.4
command:
command:
