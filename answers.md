# Answers

Lastname: Hamla 
Firstname:Louanès

## 2.2
command: docker build -t app .



## 2.3
question: We have to expose our app in the right port, so it can listen to requests sent. Our app is listening on port 3000, so we write into our dockerfile :
command:  EXPOSE 3000

## 2.5
question: In order to push into repesetory : We have first to log in into our docker hub accoutn from play with docker. Then tag the image to our repesetory and finally push it :
command: docker login
command: docker tag dockerfile louanes/devops-lab 
command: docker push louanes/devops-lab


## 2.6
To delte all images created from start of the lab 
command: docker system prune -a 

question: we have to pull the image we pushed earlier
command:docker pull louanes/devops-lab
we run it
command: docker run louanes/devops-lab

Just having some difficulties to run the img, there are some errors in js, coming back to it
## 2.7
question:
question:
Since the img didnt run, it cant go into a container but there is the command to show coantainer details, to show container ID PORTS NAME and the command to rename the container
command: docker ps  

command: docker rename

## 2.8
question:
output:

## 3.1
command:docker-compose up

## 3.4
command:docker-compose -d up
command:docker_compose logs
