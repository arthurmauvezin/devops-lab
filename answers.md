# Answers

YU:Daniel:

## 2.2
command:sudo docker run app

## 2.3
question:the port is not opened
command:sudo docker run -p 3000:3000 app

## 2.5
question:We have to name the tag of the image to match the repository.
command:sudo docker login
	sudo docker tag app yudada31/devops_lab
	sudo docker push yudada31/devops_lab

## 2.6
command:sudo docker prune -a

question:First, we need to pull the image: "sudo docker pull yudada31/devops_lab".
	 Then start a container again with the name I pushed on Docker hub
command:sudo docker create yudada31/devops_lab

command:sudo docker run --detach yudada31/devops_lab

## 2.7
question:by running the command "sudo docker ps -a", we can get a list of the container with its IDs, names, status and other informations. The status is up.
question:The name of the container is modest_feynman.
command:sudo docker ps -a

command:sudo docker rename modest-feynman web_API

## 2.8
question:The OS of the container is Ubuntu.
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
