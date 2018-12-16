# Answers

Lastname: FRANCOIS
Firstname: HENRI

## 2.2
command:

docker build . -t hey
docker run hey

## 2.3
question:

It is not possible through postman to access the container, indeed the port isn't opened.

command:

docker run -p 3000:3000 -td hey

## 2.5
question:

In order to push an image to our dockhub repo, we have to login and then tag the image.

command:

docker login <username>
docker tag indexfinal.js Henri000/devops_lab

## 2.6
command:

docker system prune -a

question:

Before container start, we pull the image.

command:

docker create Henri000/devops_lab

command:

docker run --detach Henri000/devops_lab

## 2.7
question:

We can see the container's names, ids, when they were created and their status. 
question:
command:

docker ps

command:

docker rename jovial_yalow application
docker run --detach Henri000/devops-lab:test1

## 2.8
question:

we want to to find the info about the current OS running our DOcker container 

output:

NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:

docker-compose up

## 3.4
command:

docker-compose up -d

command:

docker-compose logs