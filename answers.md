# Answers

Lastname:BERTHET BONDET
Firstname: Aldric

## 2.2
command: docker run aldric 

## 2.3
question: L'accès n'est pas autorisé pour cause de port non ouvert. Il faut alors relancer notre container en ouvrant le port concerné 
command:  sudo docker run -p 3000:3000 -td aldric 

## 2.5
question: Il faut changer le tag 
command: docker tag 77d21cd3e40d hogun/devops-lab:latest
command: docker push hogun/devops-lab:latest

## 2.6
command: sudo docker system prune -a

question: il faut pull l'image 
command: sudo docker pull hogun/devops-lab

command: sudo docker create hogun/devops-lab
command: sudo docker run --detach hogun/devops-lab

## 2.7
question:   (goofy_zhukovsky)
question: rename file to api_web_js

command: sudo docker ps -a
command: sudo docker rename goofy_zhukovsky api_web_js



## 2.8
question: NAme  : ALpine Linux 
output: 
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:

## 3.4
command:
command:
