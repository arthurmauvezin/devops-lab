# Answers

Lastname: Vazquez de Leon
Firstname: Ivan

## 2.2
command:docker run node-app

## 2.3
question: The port is not open so we have to open it
command: docker run -d --expose 3000 node-app


## 2.5
question: I didn't had problems uploading my image
command:docker tag bbe9dfd8dc06 ivanvazquezl/node-app:firsttag
		docker push ivanvazquezl/node-app

## 2.6
command: docker rmi -f bbe9dfd8dc06

question:It asked to login to dockerhub 
command:docker pull ivanvazquezl/node-app:firsttag

command:docker start -a -i e57405953605


## 2.7
question: you can see the status of the container in one of the columns
question: the name is serene_banzai
command: docker ps -a

command: docker rename serene_banzai container_node_app

## 2.8
question:
output:

## 3.1
command: docker-compose build docker run bbe9dfd8dc06

## 3.4
command:
command:
