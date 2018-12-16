# Answers

Lastname: Gabriel
Firstname: Padis

## 2.2
command: 
docker build -t app .
docker run --name api app
execute sudo docker rm api to remove the preceding container api, so the new one can still be called api
output : Successfully built IMAGE_ID

## 2.3
question: The probem is that the port are not opened on the docker side so it can't connect with the rest of the application on the inside. To resolve this we add EXPOSE 3000 and EXPOSE 3306 to our Dockerfile
command: docker run --name api -P app

#2.4
question: connect to mysql either with env variables in the dockerfile or with cl values
command: docker run --name api -P -e MYSQL_HOST=172.17.0.1 -e MYSQL_PORT=3306 -e MYSQL_DATABASE=zooCorr -e MYSQL_USER=root -e MYSQL_PASSWORD=root app
src : https://nickjanetakis.com/blog/docker-tip-65-get-your-docker-hosts-ip-address-from-in-a-container


## 2.5
question: push the image to dockerhub. So have to login to docker then verify that the image has the same name as the repo (zoo_api), set it at build with -t option or using docker tag command. Then push
command: docker push mallocgab/zoo_api

## 2.6
command: docker rmi -f IMAGE_ID

question: We want to access my image on the docker hub repo. Since it is not on my computer it will get it from docker hub.  
command: docker run mallocgab/zoo_api

question : detached mode with option -d from man docker run
command: docker run -d mallocgab/zoo_api

## 2.7
question: When we are starting the container in detached mode it prints the new container ID ont the terminal. We can see that it is running since it's status is : Up X seconds, and that its name is "compassionate_hertz".
command: docker ps -a

question: To set a name we have to use the --name option when running the container
command: docker run -d --name zoo_api app

## 2.8
question: To be able to use stdin we need option -i and for a pseudo-tty then use -t
command: docker run -it api sh
output: 3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose -d up
command: docker-compose logs zoo

