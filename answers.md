# Answers

Lastname: NGUYEN
Firstname: Emmanuel

## 2.2
command: docker build -t myfirstimage .
The : docker run myfirstimage


## 2.3
question: I think that the connection failed beause we didn't open the ports yet in the dockerfile. We also need to get the IP Adress of the host. 
command: docker run myfirstimage

## 2.5
question: We have to put a tag to our image, so that Docker Hub knows which image to push
command: docker tag myfirstimage emmanuelnguyen/project:part1


## 2.6
command: docker rmi -f $(docker images -q)

question: When we used the create command, it was unable to find image locally, so he pulled it from the docker hub repository. 
command: docker run -d emmanuelnguyen/project:part1

command: docker run -d emmanuelnguyen/project:part1

## 2.7
question: To know if we have successfully started the container in detached mode, we can type "docker ps" and see the status of our container. In our case, it's
"Up 2 minutes", which means that it started 2 minutes ago and it's still running in background.

question: The name of my container is "eager_ganguly"
command: docker ps

command: docker rename c14b9e1efedc projectdocker

## 2.8
question:
output: 

## 3.1
command: docker-compose build projectdocker
It displays : projectdocker uses an image, skipping

## 3.4
command: docker-compose up -d
command: docker service logs projectdocker
