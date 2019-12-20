# Answers

Lastname: Ngo
Firstname: John

## 2.2
command: to run the app we have to use "docker run app"

## 2.3
question: the call failed because the port is not open yet
command: docker run -p 3000:3000 app

## 2.5
question: To push we have to log in first
command: docker login
docker tag express Milanor9/devops-lab
docker push Milanor9/devops-lab

## 2.6
command:  docker system prune -a

command: sudo docker run --detach Milanor9/devops-lab

## 2.7
question: we can use the command "docker ps -a"

## 2.8
question: ubuntu

## 3.1
command:  docker-compose up

## 3.4
command:  docker-compose up -d
command:  docker-compose logs
