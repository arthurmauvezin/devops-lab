# Answers

Lastname: Lelouche
Firstname: Nicolas

## 2.2
command: docker run nicolas/project.js

## 2.3
question: The service is not accessible because the port isn't open for the application
command: 2 ways to do this
		 1) add a line to the dockerfile -> "EXPOSE 3000"
		 2) add an option to the docker run command -> docker run -i --expose 3000 nicolas/project.js 
## 2.5
question: it's impossible to push the image to Docker Hub because you need to specify an account and a repository to push to
command: docker login
		 docker tag nicolas/project.js nicholasthelouche/devops-lab
		 docker push nicholasthelouche/devops-lab

## 2.6
command: docker prune -a -f

question: docker pull nicholasthelouche/devops-lab
command:  docker run nicholasthelouche/devops-lab

command: docker run -d nicholasthelouche/devops-lab

## 2.7
question: you can tell by using the ps command in the docker terminal
question: nicholasthelouche/devops-lab
command: docker ps

command: docker tag nicholasthelouche/devops-lab zoo_wep_api

## 2.8
question: docker run -it nicholasthelouche/devops-lab /bin/bash

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
