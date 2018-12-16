# Answers

Lastname: FOUCAMBERT
Firstname: Marine

## 2.2
command: $ docker run app

Dockerfile
		->FROM node
		->
		->COPY zoo.js /root/
		->RUN npm install express mysql
		->CMD node /root/zoo.js

## 2.3
question: The port is not opened
command:  $ docker run -i -expose:3000 app

## 2.5
question: We first need to log in order to push then we need to set the tag
command: $ docker login
		 $ docker tag myapp mf160178/devops-lab
		 $ docker push mf160178/devops-lab

## 2.6
command: $ docker system prune -a

question:$ docker pull mf160178/devops_lab
command: $ docker create mf160178/devops_lab

command: $ docker run mf160178/devops-lab

## 2.7
question: $ docker ps -a
question: zen_hopper
command: $ docker ps -a

command: $ docker start -d --name api mf160178/devops-lab

## 2.8
question: docker run -it mf160178/devops_lab /bin/bash
output:
		PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
		NAME="Debian GNU/Linux"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
