# Answers

Lastname:TEETSOV
Firstname:Aurianne

## 2.2
command:docker run app

## 2.3
question:When we try to access our service with postman, we cannot. This is because the ports have not been configured and thus opened.
The port 3000 is for node and 3306 is for mysql.
command:EXPOSE 3000
EXPOSE 3306

# 2.4 question: I chose to connect to mysql with the env variables on my dockerfile.

## 2.5
question: We can use the command : docker images   to see all the images we have created with our builds.
The name of my image was already set during the build with the command: docker build . -t app    (app is the name)
First we have to login to docker hub:
docker login  -> it then askes for the user, me : auriannect and my password :... (password for docker hub)
To push the image to the repository
command: docker tag app auriannect/zoo:testzoo
docker push auriannect/zoo:testzoo

## 2.6
command:docker rmi -f $(docker images -a -q)

question: We now have deleted all of our images on our PC.
Now when we run , docker will automatically pull the image from the repo on docker hub. 
command:docker run auriannect/zoo:testzoo

command:docker run --detach auriannect/zoo:testzoo

## 2.7
question:docker ps allows us to lookat the list of cuncurrently running containers.
question:
command:docker ps

command:docker run --name devops-test --detach auriannect/zoo:testzoo

## 2.8
question:
output:

## 3.1
command:docker-compose up

## 3.4
command:docker-compose up -d
command:docker-compose logs