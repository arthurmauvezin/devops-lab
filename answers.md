# Answers

Lastname: Thery
Firstname: Antoine

## 2.2
command: docker build -t app .

## 2.3
question: yes, but we have to make sure to expose the proper port so that our app can listen for incoming requests. We will expose the port 3000 because that is where we are listening. Even after this it doesnt work on my machine because I was using play with docker. We need to also know which IP address we are connecting to which is of course different on PWD.
command: EXPOSE 3000

## 2.5
question:Before we can push to docker hub we need to configure a few things first. Use the docker login function to log on to dockerhub, then tag the image to the repo and then push it. 
command: docker login docker tag app natna25/devops-lab docker push natna25/devops-lab

## 2.6
command: docker system prune -a

question: now that we have deleted all unused docker images, we have to pull the image we pushed earlier. from there we can run the image in detached mode using the parameter flag -d
command:docker pull natna25/devops-lab

command:docker run -d natna25/devops-lab

## 2.7
question: we can use the command docker ps in order to see a list or running docker containers. if we have started our image in detached mode then we should be able to see which image is running
question: the name of the container is pratical_bartik
command:docker ps 

command: docker rename practical_bartik webAPI

## 2.8
question: we can see the os of our container relatively easily. first we create a new directory(mkdir test); inside we add a new Dockerfile (touch Dockerfile). inside of that file we add the line CMD cat etc/*release. then we build an image inside that directory and run it, we get the folliwnf output
output:PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command:docker-compose up

## 3.4
command:docker-compose -d up
command:docker_compose logs
