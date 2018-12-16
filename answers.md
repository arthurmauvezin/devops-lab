# Answers

Lastname: LE
Firstname: Gioan

## 2.2
command: docker build -t app .

## 2.3
question: The port doesn't work it need to be oppened 
command: docker run -p 3000:3000 app

## 2.5
question: the image cannot be pushed because we need to tag it correclty by usin this command 
command:docker login --username=gioan docker tag app Gioanx3/devops_lab:imagetest docker push Gioanx3/devops_lab:imagetest

## 2.6
command: docker prune -a

question: Before container start we deleted all images so Docker will pull an image from our repository.


command: docker run --detach Gioanx3/devops-lab:imagetest


## 2.7
question: We can checl all the containers and find if the ID of your container is started (by checking his status).
command: docker ps

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
