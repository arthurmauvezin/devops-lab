# Answers

Lastname:ALLINE	
Firstname:Rémy

## 2.2
command:sudo docker run app

## 2.3
question:The port is not open so it can' access it
command:  sudo docker run -p 3000:3000 project.js

## 2.5
question:the local image name have to match the same as the repository
command:sudo docker tag project.js remyalline/devops_lab
	sudo docker push remyalline/devops_lab

## 2.6
command:sudo docker system prune -a

question: we pull the image with : sudo docker pull remyalline/devops_lab and after that we start a container with the same name as the one we pushed 
command:sudo docker create remyalline/devops_lab

command:sudo docker run --detach r/devops_lab

## 2.7
question:we can see the all the containers with their id, names, status and when they were created
the status of the congtainer is up
for this we used the command: sudo docker ps -a
the name of the container is quizzical_kirch

question:
command:sudo docker rename quizzical_kirch application

command:

## 2.8
question:the OS from the container is Ubuntu
output:DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=18.04
DISTRIB_CODENAME=bionic
DISTRIB_DESCRIPTION="Ubuntu 18.04.1 LTS"
NAME="Ubuntu"
VERSION="18.04.1 LTS (Bionic Beaver)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 18.04.1 LTS"
VERSION_ID="18.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=bionic
UBUNTU_CODENAME=bionic


## 3.1
command:sudo docker-compose up

## 3.4
command:sudo docker-compose up -d
command:sudo docker-compose logs

