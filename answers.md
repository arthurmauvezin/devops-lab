# Answers

Lastname: Ren
Firstname: François

## 2.2
command: docker run -d app

## 2.3
question: It fails because there is no communication between the docker app and the hostmachine, we need to publish the ports
command: docker run -p 3000:3000 -d app

## 2.5
question: The image cannot be pushed as it is because the tag doesn't refer to my repository. we use the command "docker tag 9658a23105a1 francoisren/devops_lab"
command: docker push francoisren/devops_lab

## 2.6
command: docker rmi --force $(docker images -q)

question: Before the container start, search for the image locally then, if not found, pulls the image from the repository
command: docker run francoisren/devops_lab

command: docker run -d francoisren/devops_lab

## 2.7
question: We can tell the container started by typing "docker ps" and finding it in the list of started container
question: The name of the container is "condescend"
command: docker ps

command: docker run -d --name api francoisren/devops_lab

## 2.8
question: The OS from the container is Alpine linux, we use the command "docker exec api cat /etc/OS-release" to get the output
output: 
NAME="Alpine Linux"
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

    
      