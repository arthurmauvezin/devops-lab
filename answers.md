# Answers

Lastname: Vieira
Firstname: Joel

## 2.2
command: docker run app

## 2.3
question: the port isn't open
command: docker run -p 3000:3000 app

## 2.5
question: the image tag is used to find the repository where the image has to be pushed
command: docker login
docker tag app jovieira/devops-lab
docker push jovieira/devops-lab

## 2.6
command: docker system prune -a

question: we first need to pull the image using the following command: "docker pull jovieira/devops-lab", and then, we can create a new container using the previously pushed name as follows: "docker create jovieira/devops-lab"
command: docker run jovieira/devops-lab

command: docker start -d --net=host gloomy_newton

## 2.7
question: we can view the list of our containers and their status by using this command: "docker ps -a"
question: the name of my container is gloomy_newton
command: docker ps -a

command: docker rename gloomy_newton app

## 2.8
question: the OS is linux
output: PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
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
command: docker compose logs
