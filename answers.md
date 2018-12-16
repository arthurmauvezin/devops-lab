# Answers

Lastname: Nguyen
Firstname: Mickael

## 2.2
command: docker run app

## 2.3
question: The call fails because ports are not opened

command:  docker -i --expose:portNumber //with portNumber = port we open

## 2.5
question: The reason is that the "docker push" uses the tag to identify the repository where it is supposed to push the image

commands: docker login //giving my logs

docker tag appp myNameAccount/devops_lab //with myNameAccount our docker hub ID AND devops_lab the docker hub repository name

docker push myNameAccount/devops_lab

## 2.6
command:docker system prune -a //delete all images created from the start of the lab on the computer

question:	
Using --net=host permits the container to be able to reach localhost on the computer (the conainer having its own network by default)

command:  docker run myNameAccount/devops_lab

command:  docker start -d --net=host dreamy_pare //name found in the column "NAMES" and associated to the container previously created

## 2.7
question: just use the command "docker ps -a" to display all containers and check the column "STATUS"

question: the name of the container is dreamy_pare

command: docker ps -a

command: docker start -d --name newName myNameAccount/devops_lab //with newName the name corresponding to its function

## 2.8
question: Going into interactive mode : docker run -it myNameAccount/devops_lab /bin/bash , then by using the command given in the lab -> cat /etc/*release, we have the following output (and we can see that the OS from the container is Debian) :

output:	PRETTY_NAME="Debian GNU/Linux 9 (stretch)" NAME="Debian GNU/Linux" VERSION_ID="9" VERSION="9 (stretch)" ID=debian HOME_URL="https://www.debian.org/" SUPPORT_URL="https://www.debian.org/support" BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d 

command: sudo docker-compose logs
