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
command:

question:
command:

command:

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
