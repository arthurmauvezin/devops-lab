# Answers

Lastname: MURIER
Firstname: Charles

## 2.2
command: sudo docker run the app

## 2.3
question: port is not opened
command: sudo docker run -p 3000:3000 app

## 2.5
question:This is because docker push uses the tag to identify the repository where it is supposed to push the image.

command: sudo docker login 
sudo docker tag testing Charles-le-bg-du-91/devops_lab 
sudo docker push Charles-le-bg-du-91/devops_lab

## 2.6
command: sudo docker system prune -a 

question: "sudo docker pull Charles-le-bg-du-91/devops_lab" pull the image
command:sudo docker create Charles-le-bg-du-91/devops_lab


command: sudo docker run Charles-le-bg-du-91/devops_lab

## 2.7
question: "sudo docker ps -a" get the containers.


question: 

command: sudo docker ps -a

command:  sudo docker start -d --name rest_api Charles-le-bg-du-91/devops_lab 

## 2.8
question: "sudo docker run -it Charles-le-bg-du-91/devops_lab /bin/bash" permit to enter the interactive mode

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs

