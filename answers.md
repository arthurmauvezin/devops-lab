# Answers

Lastname:CHAN
Firstname:William

## 2.2
command:sudo docker run app

## 2.3
question:We have an issue concerning the ports.
command: sudo docker run -p 3000:3000 index.js

## 2.5
question: Docker push uses the tag to identify the repository in which it is asked to push the image.
command:sudo docker tag index.js willchan94/devops_lab
sudo docker push willchan94/devops_lab

## 2.6
command: docker system prune -a



question:

command:docker pull willchan94/devops-lab

command:docker create willchan94/devops-lab

## 2.7
question: All the containers are made, each container has a name, id, status and a date of creation.
question:


command:command:sudo docker ps -a

## 2.8
question:
output:

## 3.1
command:sudo docker-compose up

## 3.4
command:sudo docker-compose up -d
command:sudo docker-compose logs
