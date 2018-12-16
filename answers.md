# Answers

Lastname: Mallet
Firstname: Hugo

## 2.2
command: docker run app

## 2.3
question: We didn't open the port so we wan't access it with postman.
command: docker run -p 3000:3000 app

## 2.5
question: We need to give a tagname to our image in order to push it. We first need to login
command:docker login
docker tag app hugomallet/devops-lab
docker push hugomallet/devops-lab

## 2.6
command: docker prune -a

question: We have to take back our image that we put on DockerHub earlier
command:docker create hugomallet/devops-lab

command: docker run --detach hugomallet/devops-lab

## 2.7
question: By using the following command, we have all the containers that we have created, along with their informations. Thanks to the output, we can see that the status is "up"
question: The name of my container is eager_matsumoto
command: docker ps -a
command:docker rename eager_matsumoto API

## 2.8
question: My container is on Debian
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
command:docker-compose logs
