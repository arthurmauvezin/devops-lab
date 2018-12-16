# Answers

Lastname:Braun
Firstname:Pierre-Louis

## 2.2
command: docker run app .

## 2.3
question:There is a port probleme. We  want to use the port 3000 so we have to precise it.
command: docker run -i --expose 3000 app

## 2.5
question:The first thing we have to do is getting connected and to use a tag to push
command:docker login
command:docker tag index.js pierrelouisbraun/devops_lab
command:docker push pierrelouisbraun/devops-lab

## 2.6
command:docker system prune -a

question: We pull the image 

command:docker pull pierrelouisbraun/devops-lab

## 2.7
question:We check the containers and their status
question:
command: dockers ps -a 

command: docker start -d --name js_api pierrelouisbraun/devops_lab 

## 2.8
question:check the OS running on the Docker Container

output:NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
command:
command:
