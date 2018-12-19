# Answers

Lastname: Kicinski
Firstname: Ghislain

## 2.2
command: docker run app

## 2.3
question:l'appel du service avec postman ne fonctionne pas car le port n'est pas ouvert.
command: docker run -p 3000:3000

## 2.5
question: il faut changer le nom de l'image pour correspondre au repository.
command: docker login

## 2.6
command: sudo docker system prune -a

question: sudo docker pull GKicinski97/devops_lab

command: sudo docker create GKicinski97/devops_lab

command: sudo docker run GKicinski97/devops_lab

## 2.7
question: la commande sudo docker ps -a permet d'avoir les conteneurs
question:
command: sudo docker ps-a

command: sudo docker start -d --name docker_zoo_api GKicinski97/devops_lab

## 2.8
question: sudo docker run -it GKicinski97/devops_lab /bin/bash
output: NAME:"ALPINE LINUX"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d

command: sudo docker-compose logs
