# Answers

Lastname: RESPLANDY	
Firstname: Numa 

## 2.2
command: docker run app . 

## 2.3
question:because 
command: docker run -p 8080:8080 

## 2.4
question: connection values to database, we specify the of the port, db,login,password,host for the connection to the database.
command:docker run -e MYSQL_HOST='localhost' -e MYSQL_PORT='8080' -e MYSQL_DATABASE='project' -e MYSQL_LOGIN='root' -e MYSQL_PASSWORD='root' app 

## 2.5
question: we push the image and we create a docker repository
command:docker push numareplandy/devops-lab:tag1

## 2.6
command:docker system prune -a

question:
command:docker pull numareplandy/devops-lab:app

command:docker create numareplandy/devops-lab docker run --detach godlikedocker/devops-lab

## 2.7
question: we use  to show the container
question:the name : pedantic_dijkstra
command:docker ps -a
command:docker rename pedantic_dijkstra wep_api

## 2.8
question:
output:
Air-de-Numa:devops-lab numa$ docker run -it c75ab6b5c258  bash
root@f48986ac1c15:/# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: docker-compose start

## 3.4
command:
command:
