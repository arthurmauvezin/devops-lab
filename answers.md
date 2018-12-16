# Answers

Lastname: Houzé de l'Aulnoit
Firstname: Arnaud

## 2.2
command: docker run -t image_arnaud

## 2.3
question: The service failed beacause have not precised the port yet.
command: docker run -p 3000:3000 image_arnaud

## 2.5
question: We have to log in and rename the image with "arnaudhdla" in the name before.
command: docker login
docker build -t arnaudhdla/image_webapp .
docker push arnaudhdla/image_webapp

## 2.6
command: docker system prune -a

question: The name of the container was writen again.
command: docker restart arnaudhdla/image_webapp

command: docker run -d arnaudhdla/image_webapp

## 2.7
question: The status is running (up), contrary to the others which are exited.
question: The name of my container is affectionate_merkle.
command: docker ps

command: docker run -d arnaudhdla/image_webapp
docker rename affectionate_merkle arnaudhdla/image_webapp

## 2.8
question: The OS of the container is Debian.
To know it we use : "docker run -i -t arnaudhdla/image_webapp /bin/bash".

output:
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
