# Answers

Lastname: TEIGER 	
Firstname: Max

## 2.2
command: docker run app .      
or       docker run -d app    on Docker Playground

## 2.3
question: Because the app created with docker launch is own localhost, and ports are not opened. "the container uses a different network namespace than the host (the Docker machine), 127.0.0.1 in the container is not equal to 127.0.0.1 on the host. 
command: sudo docker run -p 3000:3000 app 

## 2.5
question: We first need to tag the image before pushing it to the repository 
command: docker tag 58c0cd33a6e8 maxthedockenman/devops-lab:app
docker push maxthedockerman/devops-lab

## 2.6
command: docker rmi -f $(docker images -q)
or docker system prune -a

question: before we start the container, we pull it from the distant repository 
command: docker pull maxthedockerman/devops-lab:app

command: docker run --detach maxthedockerman/devops-lab

## 2.7
question: We use the command docker ps -a to show all containers
question: for me it is named adoring_borg
command: docker ps -a

command: docker rename adoring_borg webapi

## 2.8
question: The OS is running on Alpine Linux
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
