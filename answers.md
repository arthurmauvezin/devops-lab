# Answers

Lastname: Sini
Firstname: Dalil

## 2.2
command:docker build . -t dalil 
		docker run dalil 

## 2.3
question:It is important to open the ports in order to enter. 
command:docker run -p 3000:3000 -td dalil

## 2.5
question:To identify my repository I have to change the tag of our image. 
command: docker tag 78459276a204 lukitabalondeoro/devops-lab:latest docker push lukitabalondeoro/devops-lab:latest

## 2.6
command: docker system prune -a
question: I pull the image from docker hub. 
command:docker pull lukitabalondeoro/devops-lab
command:docker create lukitabalondeoro/devops-lab sudo docker run lukitabalondeoro/devops-lab

## 2.7
question:I execute the command docker ps -a
question::Name of the first container : boring_snyder and I am going to change it to: js_dalil 
command:docker ps -a
command:docker rename boring_snyder js_dalil

## 2.8
question: To enter : "docker run -it lukitabalondeoro/devops-lab/bin/bash"
command:cat /etc/*release
output:
[node1] (local) root@192.168.0.53 ~/devops-lab
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:docker-compose up

## 3.4
command:docker-compose up -d
command:docker-compose logs
