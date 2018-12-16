# Answers

Lastname: Tan
Firstname: Steven

## 2.2
command: docker run app

## 2.3
question:  We cannot access our service because the port 3000 is not opened.
command: docker run -p 3000:3000

## 2.5
question: Docker uses the tag to identify the repository
command: docker tag app steventan/devops
docker push steventan/devops

## 2.6
command: docker system prune -a

question: docker pull steventan/devops , this pulls the image that we pushed earlier and then we start the container 
command: docker create steventan/devops

command: docker run --detach steventan/devops

## 2.7
question: You can see the status of the container with their ID, names etc.
question:  name of the container : stoic_burnell
command: docker ps -a

command: docker rename stoic_burnell appdev

## 2.8
question: we go in interactive mode using the command "docker run -it steventan/devops /bin/bash" and then we use "cat /etc/*release" to get the OS informations
The OS from the container is Linux

output:
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
