# Answers
Lastname: Mina
Firstname: Adrien

## 2.2
command: sudo docker run app

## 2.3
question: Ports are not opened
command: sudo docker run -p 3000:3000 test.js

## 2.5
question: You need to login first, then you need to tag the image before you can push it
command: sudo docker tag test.js aminecrime/devops_lab
sudo docker push aminecrime/devops_lab

## 2.6
command: docker rmi -f $(docker images -a -q)

question: We've deleted all the images, but we need an image for the container, as we pushed the previous image on to the docker hub we can pull it back
command: docker run aminecrime/devops-lab

command: docker run -p aminecrime/devops-lab

## 2.7
question: I check all the containers by using docker ps -a
question: The name of the container is kind_swartz
command: sudo docker ps -a

command: sudo docker rename kind_swartz devops_app_container

## 2.8
question: I use docker exec devops_app_container cat /etc/os-release to see the information of the OS
output: NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:

## 3.4
command:
command:
