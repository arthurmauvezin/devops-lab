# Answers

Lastname: GUERMOND
Firstname: Augustin

## 2.2
command: docker run app

## 2.3
question: My command failed because the port is currently closed.
command: docker run -p 3000:3000 app

## 2.5
question: The image cannot be pushed because the image has not beed tagged yet. So we tag it to the repo and push it.
command: docker login docker tag app AuGGuermond/devops-lab docker push AuGGuermond/devops-lab

## 2.6
command: docker system prune -a

question: We pull the image that we have pushed before. We are then able to run it in detached mode.
command: docker pull AuGGuermond/devops_lab

command: docker run --d AuGGuermond/devops_lab


## 2.7
question: We can tell by using the command "docker ps" because it prints the status of each container.
question: The name of the container is "focused-bohr".
command: docker ps

command: docker rename focused_bohr webAPI

## 2.8
question: We see that the OS of our container is Ubuntu
output: DISTRIB_ID=Ubuntu DISTRIB_RELEASE=18.04 DISTRIB_CODENAME=bionic DISTRIB_DESCRIPTION="Ubuntu 18.04.1 LTS" NAME="Ubuntu" VERSION="18.04.1 LTS (Bionic Beaver)" ID=ubuntu ID_LIKE=debian PRETTY_NAME="Ubuntu 18.04.1 LTS" VERSION_ID="18.04" HOME_URL="https://www.ubuntu.com/" SUPPORT_URL="https://help.ubuntu.com/" BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/" PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy" VERSION_CODENAME=bionic UBUNTU_CODENAME=bionic

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
