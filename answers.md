# Answers

Lastname: FIDALGO
Firstname: Igor

## 2.2
command: docker build -t app .

## 2.3
question: The call fails because the docker app cannot connect to the database. We need to comment the lines that try to connect to the DB in the index.js file
command: docker run app

## 2.5
question: The local image name does not match the repository name.
To correct that we need to use a tag, either with the "docker tag" command or by rebuilding the image with a tag

command:docker build -t igzs/app:latest .
docker push igzs/app:latest


## 2.6
command: docker system prune -a

question: Since we deleted all images, we have no more local copies of said images. In order to get them back, we need to pull them from the docker repository.
command: docker pull igzs/app

command: docker run -d igzs/app:latest

## 2.7
question: We can see all current docker containers running with the "docker ps -a" command.
question: In my case, the name of my container is "inspiring_stonebraker"
command: docker ps -a

command: docker rename inspiring_stonebraker app

## 2.8
question: In order to see which OS is running inside the container, I used the following command: "docker exec app cat /etc/os-release"
output:NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
