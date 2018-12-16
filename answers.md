# Answers

Lastname: Couvreur
Firstname: Adrien

## 2.2
command: docker run app

## 2.3
question: Cela ne marche pas car le port n'est pas ouvert
command: docker run -i --expose:3000 app

## 2.5
question: Il faut d'abord se login puis tag et push l'image
command: docker login


## 2.6
command: sudo docker system prune -a

question: sudo docker pull Acouvreur97/devops_lab

command: sudo docker create Acouvreur97/devops_lab

command: sudo docker run Acouvreur97/devops_lab

## 2.7
question: on utilise sudo docker ps -a pour avoir les conteneurs
question: 
command: sudo docker ps-a

command: sudo docker start -d --name docker_zoo_api Acouvreur97/devops_lab

## 2.8
question: sudo docker run -it Acouvreur97/devops_lab /bin/bash 
output: 

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
