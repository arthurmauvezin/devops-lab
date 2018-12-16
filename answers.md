# Answers

Lastname:Pirot
Firstname:Julien

## 2.2
command:sudo docker run express

## 2.3
question:Because the port is not opened
command:sudo docker run -p 3000:3000 express

## 2.5
question:First we need to login then name the tag of the image to match the repository, then push the tagged image
command:sudo docker login <username>
	sudo docker tag express KingRulian/devopslab
	sudo docker push KingRulian/devopslab


## 2.6
command: sudo docker system prune -a

question: First we need to pull the image:"sudo docker pull kingRulian/devopslab" 
then we need to create a container again with the name I pushed on Docker hub:
command:sudo docker create KingRulian/devopslab

command:sudo docker run --detach KingRulian/devopslab

## 2.7
question:If we want to check the name of the container and if it's runinng we can run the command "sudo docker ps"
question: We obtain KingRulian/devopslab
command:sudo docker ps

command:sudo docker rename JUJUdocks devops_express

## 2.8
question:The OS of the container is Ubuntu
output:
DISTRIB_ID=Ubuntu
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
