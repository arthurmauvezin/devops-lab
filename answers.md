# Answers

Lastname: Eid
Firstname: Johann

## 2.2
command: docker run -it --rm --pid=host app

## 2.3
question: Currently can't access our service by typing localhost:8080 in web brower from example
we need to assign explicit connection port to it and connection will be succesful 

command: docker run -p 4200:4200

We can now connect to localhost:4200


## 2.5
question: First we have to login then tag the image, then push the tagged image
command: docker login <username>
         docker tag 472ab38cf955 jojototo/devops:app
         docker push jojototo/devops
  
  and we get the image pushed onto our dockhub repo https://cloud.docker.com/repository/docker/jojototo/devops/general

## 2.6
command:
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)

question: We have to excecute the followin
command: docker run --rm -p 8787:8787 rocker/verse
-p allows to run in detached mode
command: docker run --rm -p 8787:8787 rocker/verse


## 2.7
question: In order to check the name of the container and if it's running we can run the "docker ps" we see the name is  jojototo/devops:app
question: With docker ps we can see the container is running but we can also access it from localhost:8787 from the browser
command: docker ps 
command: sudo docker rename <current_name> devops_intro_app

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
