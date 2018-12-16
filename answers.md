# Answers

Lastname: Gabriel
Firstname: Padis

## 2.2
command: 
docker build -t app .
docker run --name api app
execute sudo docker rm api to remove the preceding container api, so the new one can still be called api
output : 
Successfully built dd9f9fb511c0

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
command:

question:
command:

command:

## 2.7
question:
question:
command:

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
