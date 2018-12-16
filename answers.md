# Answers

Lastname:Bosseray
Firstname:Alexis

## 2.2
command: docker run -d app // just before : docker build -t app .


## 2.3
question: The call fail because the port is not  open 
command: docker run -i --expose 3000 app

## 2.5
question: we must precise a login or the image can't be pushed
command: docker tag devops-lab AlexisBosseray/devops-lab
command: docker push AlexisBosseray/devops-lab

## 2.6
command: docker system prune -a

question: create in order to create the container and --net=host in order to precise the good network
command: docker pull AlexisBosseray/devops-lab 

command: docker create AlexisBosseray/devops-lab
command: docker run AlexisBosseray/devops-lab
command: docker ps -a
command: docker start -d --net=host app
## 2.7
question:we use the same function than before
question:
command:docker ps -a

command:docker start -d --name zoo-api AlexisBosseray/devops-lab

## 2.8
question:we should use this command : "docker run -it AlexisBosseray/devops-lab /bin/bash" but it doesn't succeed
output:

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
