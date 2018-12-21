# Answers

Lastname: Angles
Firstname: Mathilde

## 2.2
command: sudo docker run labdocker

## 2.3
question: because the port is closed
command:  sudo docker run -p 3000:3000 labdocker

## 2.5
question: We need to use the good tag : as show below 
command: sudo docker login
sudo docker tag labdocker mathildeangles/devops-lab
sudo docker push mathildeangles/devops-lab

## 2.6
command: sudo docker system prune -a

question:
command:

command:sudo docker start -d --net=host happy_leakey

## 2.7
question: we use the command "sudo docker ps -a"
question: the name of my container is happy_leakey
command: sudo docker ps -a

command: sudo docker rename happy_leakey labdocker

## 2.8
question: linux
output:
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:sudo docker-compose up

## 3.4
command:sudo docker-compose up -d
command:docker-compose logs
