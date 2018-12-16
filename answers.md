# Answers

Lastname: Schmitt
Firstname: Camille

git clone https://github.com/camilleschmitt/devops-lab.git
docker build -t app .


## 2.2
command: docker run app

## 2.3
question: The project is only running in the image that we have created and not on our computer, where Postman is and the ports are not linked.
command:  docker run -d -p 80:3000 app

## 2.4
docker run  app

## 2.5
question: The access to the ressource is denied.
command:
docker tag app camilleschmitt/devopslab:app
docker push camilleschmitt/devopslab

## 2.6
command:
docker rmi $(docker images -a -q)

question: if we haven't stop the container, it is still running so the app cannot be launched.
command: docker stop $(docker ps -aq)

command:
docker run -d app
docker inspect 2ba23b6a08dd

## 2.7
question: We can access our project in the port used.
question: relaxed_nightingale
command: docker ps

command: docker rename relaxed_nightingale project

## 2.8
question: It is a Linux OS
output:
NAME:"ALPINE LINUX"
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
