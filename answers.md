# Answers

Lastname:Rognon
Firstname:Gautier

## 2.2
command:docker run app

## 2.3
question:the reason why we can't acces is because the port are not opened yet.
command:docker run -p 3000:3000 index.js

## 2.5
question:to make it work, both local image and repository name's have to match                                                                              
command:docker tag index.js gautierrr/devops-lab                                                                                               
docker push gautierrr/devops-lab                                                            

## 2.6
command:docker system prune -a

question: we push and start a container 
command:docker pull gautierrr/devops-lab

command:docker create gautierrr/devops-lab
docker run gautierrr/devops-lab

## 2.7
question:We can look at running container using the command "docker ps"
question:the name of my container is "furious_heisenberg"
command:docker ps

command:docker rename 

## 2.8
question:
output:
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org/"
BUG_REPORT_URL="http://bugs.alpinelinux.org/"

## 3.1
command:

## 3.4
command:
command:
