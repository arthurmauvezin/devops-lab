# Answers

Lastname: ROTH - THANABALASINGAM
Firstname: Basile - Senthan

## 2.2
command:
sudo docker run docker

## 2.3
question:
command:
We
We open the port
docker run -p 8888:3000 -td docker

## 2.5
question: We have to change the tag of our image to identify the repository
command:
docker tag 9869485fe08f bastoche75/devops-lab
docker push bastoche75/devops-lab:latest

## 2.6
command:

question:
command:
sudo docker system prune -a
sudo docker pull bastoche75/devops-lab
sudo docker create bastoche75/devops-lab

command:
sudo docker run -d --net=host angry_jepsen
## 2.7
question:
question:
command:
sudo docker ps -a

command:
sudo docker rename angry_jepsen web_api
## 2.8
question:
output:
MacBook-Pro-de-Basile:devops-lab basileroth$ sudo docker run -it bastoche75/devops-lab /bin/bash
root@8fec88a049cd:/# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 8 (jessie)"
NAME="Debian GNU/Linux"
VERSION_ID="8"
VERSION="8 (jessie)"
ID=debian
HOME_URL="http://www.debian.org/"
SUPPORT_URL="http://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
root@8fec88a049cd:/#


## 3.1
command:
sudo docker-compose up

## 3.4
command:sudo docker-compose up -d
command: sudo docker-compose logs
