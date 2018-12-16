# Answers

Lastname:Mouli Castillo
Firstname:Pierre

## 2.2
command:run docker -it -p 9000:3000 imagetuto

we get the message :"Example app listening on port 3000 !" followed by an error, to fix the error we have to comment the connect function in index.js

## 2.3
question: We get an error message because the port is not opened. To fix it we have to add "EXPOSE 3000" in the Dockerfile then
command: docker run -it -p 9000:3000 imagetuto

## 2.5
question:We first have to login, then the iamge name has to be name after the account "pierremc/devops-lab"
command:
docker login
docker tag imagetuto pierremc/devops-lab
docker push pierremc/devops-lab:latest

## 2.6
command:
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images -q)

question: we cannot access the image
command:
docker pull pierremc/devops-lab

command:
docker create pierremc/devops-lab

## 2.7
question: We have to use a command to see all started conatiners
question: We can read it under the name field : "sharp_newton"
command: docker ps -a
command: docker rename sharp_newton myimage

## 2.8
question: We need to use the commande run
command : docker run -it pierremc/devops-lab /bin/bash
output:
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: docker-compose up

## 3.4
command:
command:
