# Answers

Lastname: Ranarison	
Firstname: Meva

## 2.2
command: sudo docker run app labmeva

## 2.3
question: on ne peut pas accéder car le port n'est pas ouvert
command: sudo docker run -i --expose:3000 labmeva

## 2.5
question: Docker ne push pas l'image mais le tag, il faut donc changer le nom de notre image
command: sudo docker login - sudo docker tag labmeva mevaa13/devops-lab - sudo docker push mevaa13/devops-lab

## 2.6
command: docker system prune -a

question:
command: sudo docker pull mevaa13/devops-lab - sudo docker create mevaa13/devops-lab

command: sudo docker run --detach mevaa13/devops-lab

## 2.7
question: 
question:
command: sudo docker ps -a

command: docker start -d --name api mevaa13/devops-lab

## 2.8
question: on peut utiliser la commande : sudo docker run -it mevaa13/devops-lab /bin/bash
output:

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d 
command: sudo docker-compose logs
