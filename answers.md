# Answers

Lastname: Magdaleno Morales
Firstname: Esmeralda

## 2.2
command: docker run app

## 2.3
question: The connection fails because it has no access the port
command:

## 2.5
question: Because I have to be logged in to make a push
command: docker login and then docker push esmemag96/web:app

## 2.6
command: docker stop $(docker ps -aq) to stop all running containers and then docker rmi $(docker images -q) to remove all the images

question: the container works
command: docker pull esmemag96/web:app

command: docker run esmemag96/web:app

## 2.7
question: My container name is app
question: with docker ps I can tell if it is running or not
command: docker ps -a

command: docker container rename esmemag96/web:app esmemag96/web:test

## 2.8
question:
output:

## 3.1
command: docker-compose up

## 3.4
command: docker-compose run -d --restart:always
command: docker-compose logs my-service
