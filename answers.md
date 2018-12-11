# Answers

Lastname: Magnien     
Firstname: Maxence  

## 2.2
command: sudo docker run app

## 2.3
question: Ports aren't opened.
command: sudo docker -i --expose:PortNumber app //where portnumber is the port to open or we add EXPOSE in the dockerFile

## 2.5
question: We need to link our Computer's file to the repo on docker hub. Therefore we tag our project file accordingly to the docker hub repo.
command: 
sudo docker login
sudo docker tag test0 maxencemagnien/project
sudo push maxencemagnien/project


## 2.6
command: sudo docker system prune -a

question: 
It checks if a container exists. In our case we need to first pull our docker project, the create the container and finally start it.

command:
sudo docker pull maxencemagnien/project
sudo docker create maxencemagnien/project
sudo docker start trusting_almeida// where trusting_almeida is the name of the container, automatically generated
/* OR */
We can also just:  
sudo docker run  --net=host trusting_almeida //The task isn't a background task and is dependant of the terminal window

command: 
//if we use the  |sudo docker start ContainerName| it is by default in background
// However it is not with a the run method, hence:
sudo docker run -d --net=host maxencemagnien/project

## 2.7
question: The command "sudo docker ps -a" show the STATUS variable that tells if the conainer is UP or NOT
question: "trusting_almeida" is the name of my container
command: sudo docker ps a-

command:
sudo docker run --name api_web -d maxencemagnien/project // to create a new container with the wanted name 
sudo docker rename nameA nameB // to rename the container "nameA" with the name "nameB"

## 2.8
question: We enter in interactive mode with "sudo docker run -it maxencemagnien/project /bin/bash" and then we use the "cat /etc/*release"
output:
root@90feddc1cf92:/# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
