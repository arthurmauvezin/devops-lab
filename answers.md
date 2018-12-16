# Answers

Lastname: Hamla 
Firstname:Louanès

## 2.2
command: docker build -t app .



## 2.3
question:
command: We have to expose our app in the right port, so it can listen to requests sent. Our app is listening on port 3000, so we write into our dockerfile : EXPOSE 3000

## 2.5
question:
command: In order to push into repesetory : We have first to log in into our docker hub accoutn from play with docker. Then tag the image to our repesetory and finally push it : 
docker login
docker tag dockerfile louanes/devops-lab
docker push louanes/devops-lab


## 2.6
command: docker system prune -a  : to delte all images created from start of the lab 


question: we have to pull the image we pushed earlier
command:docker pull louanes/devops-lab

command: docker run louanes/devops-lab

Just having some difficulties to run the img, there are some errors in js, coming back to it
## 2.7
question:
question:
Since the img didnt run, it cant go into a container but there is the command to show coantainer details
command: docker ps to show container ID PORTS NAME  

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
