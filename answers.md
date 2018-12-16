# Answers

Lastname: ARZEL
Firstname: Julien

## 2.2
command: docker run test

## 2.3
question: Because the port is not open, we have to open it.
command: docker run -i --expose 3000 test

## 2.5
question: The image can't be pushed because we must provide the login for it to know where to push the image
command: docker login docker tag test julienarzel/devops-lab 

## 2.6
command: docker system prune -a

question: docker pull julienarzel/devops-lab  docker create julienarzel/devops-lab
command: docker run julienarzel/devops-lab  docker ps -a

command: docker start -d --net=host test

## 2.7
question: docker ps -a
question: We have two solutions to rename the container :
command: docker start -d --name api julienarzel/devops-lab     docker rename test api


## 2.8
question: We first use the command "docker run -it raphlopes/devops-lab /bin/bash" to enter interactive mode, and then the given command "cat /etc/*release"

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
command: docker-compose up -d
command: docker-compose logs
