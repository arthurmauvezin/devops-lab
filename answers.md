# Answers

Lastname: Paban
Firstname: Louis 

## 2.2
command: sudo docker run app

## 2.3
question: Ports are not opened so no access
command: sudo docker run -p 3000:3000 -td app

## 2.5
question: change name in order to identify the repository
command: sudo docker tag 38650435o169 louispaban/devops_lab
         sudo docker push louispaban/devops_lab

## 2.6
command: docker system prune -a
question:
command: docker pull louispaban/devops-lab
command: docker create louispaban/devops-lab
         docker run louispaban/devops-lab

## 2.7
question: 
question: The name of the container is serene_wescoff.
command: sudo docker ps -a

command: sudo docker rename serene_wescoff cont_app

## 2.8
question: 
Linux output: 
NAME="Alpine Linux" 
ID=alpine 
VERSION_ID=3.8.1 
PRETTY_NAME="Alpine Linux v3.8" 
HOME_URL="http://alpinelinux.org" 
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: command: sudo docker-compose up

## 3.4
command: command: docker-compose up -d
command: command: docker-compose logs
