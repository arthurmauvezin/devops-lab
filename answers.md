# Answers

Lastname: de Bailliencourt
Firstname: Clément

## 2.2
command: docker run -it --rm --pid=host app

## 2.3
question: For the moment we cannot access the service because we haven't explicitly declare the connection port.

command:docker run -p 3350:3350

It is now possible to connect to localhost:3350

## 2.5
question: We need to login before taging and pushing the image
command: docker login
         docker tag 55a37e2dd9d2 clemzoo/devops:app
         docker push clemzoo/devops

We can found what we have push here
https://cloud.docker.com/repository/registry-1.docker.io/clemzoo/devops

## 2.6
command:
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)

question: We need to do :

command: docker run --rm -p 8787:8787 rocker/verse
-p allows to run in detached mode

command: docker run --rm -p 8787:8787 rocker/verse

## 2.7
question: To check the name of the container and to see if it runs we can run the "docker ps" and the name is clemzoo/devops:app
question: We can see that the container is running, we can also access it from localhost:8787 with the browser

command: docker ps

command: sudo docker rename <actualName> devops_intro_app

## 2.8
question:
output:

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose run