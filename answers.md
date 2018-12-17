# Answers

Lastname: Zaafouri
Firstname: Rim

## 2.2
command: docker run app

## 2.3
question: The call fails because the service cannot access the port.
command: docker run -p 3000:3000 index.js

## 2.5
question: We identify the repository using the tag to push the image
command: docker tag index.js rz160211/devops-lab
docker push rz160211/devops-lab

## 2.6
command: docker system prune -a

question: We start a container
command: docker pull rz160211/devops-lab

command: docker create rz160211/devops-lab docker run rz160211/devops-lab

## 2.7
question: We retrieve the list of all containers and check that our container is started
question: the name of my container is first_container
command: docker ps

command: docker rename first_container app

## 2.8
question: The name of the container is Alpine Linux
output: NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
