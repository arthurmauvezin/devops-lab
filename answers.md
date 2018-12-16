# Answers

Lastname: LOEUR
Firstname: Richard


## 2.2
command: "~\devops-lab> docker run app
Example app listening on port 3000!"

## 2.3
question: The call cant succeed because the port 3000 is not exposed. "EXPOSE 3000"  line is needed in the Dockerfile and we can insert the -P option to dynamically expose the port at launch.
command: docker run -P app

## 2.4
command: docker run -P -e MYSQL_HOST=localhost -e MYSQL_PORT=3306 -e MYSQL_USER=root -e MYSQL_PASSWORD="" -e MYSQL_DATABASE=zoo app

## 2.5
question: we can tag the app with the remote name ("zoo"). then we can push it afterward to loeurrich/zoo
command:
docker login
docker tag app zoo
docker push loeurrich/zoo

## 2.6
command: docker system prune

commands: 
docker pull loeurrich/zoo
docker create loeurrich/zoo
docker run loeurrich/zoo

command: docker ps

output: 
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS                     NAMES
fcf9b525d387        loeurrich/zoo      "/bin/sh -c 'node /r…"   40 seconds ago      Up 45 seconds                 3000/tcp                  thirsty_jepsen
45ff8001f8c7        loeurrich/zoo      "/bin/sh -c 'node /r…"   49 seconds ago      Created                                                 thirsty_albattani

## 2.7
question:
question:
command:

command:

## 2.8
question: The OS of the container is Debian, a Linux distribution.
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
