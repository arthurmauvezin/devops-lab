# Answers

Lastname1: Toquebiau
Firstname1: Maxime

Lastname2: Guillermou
Firstname2: Tom

## 2.2
command:
$ docker build -t myapp .
$ docker run myapp

## 2.3
question: The app fails at first. We need to specify the right port. Therefore we expose the port 3000.
command: EXPOSE 3000

## 2.5
question: We have to log in, and tag the image to our repo. Then we can push the image.
command: 
docker login
docker tag myapp tomguillermou/dockerlab:myapp
docker push tomguillermou/dockerlab:myapp

## 2.6
command: docker system prune -a

question:
command: docker run tomguillermou/dockerlab:myapp

command: docker run -d tomguillermou/dockerlab:myapp

## 2.7
question: 
question: We use the command 'docker ps' to get the list of running containers. We find that the name is 'fervent_poincare'
command: docker ps

command: docker container rename fervent_poincare myapp

## 2.8
question: In a new directory, we build another application with its own Dockerfile. In this Dockerfile we put the command 
'FROM node:7
CMD cat etc/*release'
output: 'PRETTY_NAME="Debian GNU/Linux 8 (jessie)"...'

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
