# Answers

Lastname: Gabriel
Firstname: Padis

## 2.2
command: 
sudo docker build -t app .
sudo docker run --name api app
output : 
Successfully built dd9f9fb511c0

## 2.3
question: The probem is that the port are not opened on the docker side so it can't connect with the rest of the application on the inside. To resolve this we add EXPOSE 3000 and EXPOSE 3306 to our Dockerfile
command: sudo docker run --name api -P app

## 2.5
question:
command:

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
