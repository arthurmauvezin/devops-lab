# Answers

Lastname: Laureau
Firstname: Arthur

## 2.2
command: $ sudo docker build .

## 2.3
question: The port are closed on docker side thus the application can't connect. We need to put EXPOSE 3000 and EXPOSE 3306 to the dockerfile.
command: $ docker run --name api -P app

## 2.5
question:I cannot push my image because it has to have the correct tag like the repo (dev_api) and the local instance of docker has to be connected to the docker hub
command: $ docker login --username=Alaureau, then type pwd
docker tag: $ docker build -t mytag

## 2.6
command: $ docker rmi -f IMAGE_ID

question: I need to run the image from docker since I erased the one I had in local
command: $ docker run Alaureau/dev_api

command: $ docker run --detach Alaureau/devops-lab:dev

## 2.7
question: In detached mode, the new container ID is prompted on the terminal.
I know it is running because of its status
question: My container was automatically named "underrated_osmosis"
command: $ docker ps -a

command: docker run --name dev_api --detach Alaureau/devops-lab:dev

## 2.8
question: To see the current running OS in my Docker container I added option -i and -t command: $ docker run -it api sh
output:  
NAME="Alpine Linux" ID=alpine 
VERSION_ID=3.8.1 
PRETTY_NAME="Alpine Linux v3.8" 
HOME_URL="http://alpinelinux.org" 
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: $ docker-compose up

## 3.4
command: $ docker-compose up -d
command: $ docker-compose logs
