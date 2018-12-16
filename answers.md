# Answers

Lastname: Quemat
Firstname: Adrien

## 2.2
command: $ docker run -it -p 9000:3000 tuto

## 2.3
question: Nous devons établir un port de connection explicite pour nous connecter
command: EXPOSE 3000

## 2.5
question:Je me connecte à mon dockerHub. Il faut ensuite changer le nom de l'image pour matcher avec son repository
command:$ docker login
command:$ docker tag tuto:latest didiqu/adrien:firsttry
command:$ docker push didiqu/adrien:firsttry

## 2.6
command: 

question: Il faut delete les containers avant de delete les images
command: $ docker rm -f $(docker ps -a -q)
command: $ docker rmi -f $(docker images -q)


## 2.7
question: Pour prendre connaissance du statut des containers on utilise $ docker ps -a
question: Por renommer un container on utilise la fonction rename
command: $ docker ps -a

command: docker rename tuto newTuto

## 2.8
question: docker run -it didiqu/newTuto /bin/bash
output:

## 3.1
command:$ docker-compose up

## 3.4
command:
command:
