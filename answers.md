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
command: $ docker login --username=myusername, then type pwd
docker tag: $ docker build -t mytag

## 2.6
command: $ docker rmi -f IMAGE_ID

question: I need to run the image from docker since I erased the one I had in local
command: $ docker run myusername/dev_api

command: $ docker run --detach mmetharam/devops-lab:test1

## 2.7
question:
question:
command:

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
