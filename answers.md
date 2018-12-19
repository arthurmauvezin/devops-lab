# Answers

Lastname: GUEZ
Firstname: Raphael

## 2.2
command: sudo docker run app

## 2.3
question: Port are closed so we can't access to them
command: sudo docker run -p 3000:3000 app

## 2.5
question: We must log in and tag it
command: docker login
command: docker tag project-raph raphguez/devops-lab
command: docker push raphguez/devops-lab

## 2.6
command: docker system prune -a

question: It downloaded the last image pushed
command: docker pull raphguez/devops-lab
docker create raphguez/devops-lab
docker run raphguez/devops-lab

command:
STATUS              PORTS                    NAMES
709eac424943        raphguez/devops-lab   "/bin/sh -c 'node /r…"   3 minutes ago       Up 3 minutes                                 thirsty_gold

MBP-de-Arie:~ raphaelguez$

## 2.7
question: we use the command docker ps -a
question: Its name is thirsty_gold
command: docker ps -a
command: docker start -d --name api raphguez/devops-lab


## 2.8
question: docker run -it raphguez/devops-lab /bin/bash
output:

## 3.1
command:

## 3.4
command:
command:
