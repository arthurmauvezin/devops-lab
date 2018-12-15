# Answers

Lastname:Lopes
Firstname:Raphael

## 2.2
command: docker run app

## 2.3
question: Car le port n'est pas ouvert
command: docker run -i --expose:3000 app

## 2.5
question: Il faut se login pour push
command: la commande est : docker login
docker tag myapp raphlopes/devops-lab
docker push raphlopes/devops-lab

## 2.6
command: docker system prune -a

question: docker pull raphlopes/devops-lab
docker create raphlopes/devops-lab 

command: docker run raphlopes/devops-lab
docker ps -a
CONTAINER ID        IMAGE                  COMMAND                 CREATED             STATUS                      PORTS               NAMES
17b74320d489        myapp                  "node /root/index.js"   5 minutes ago       Exited (1) 5 minutes ago                        competent_haibt
8c716ec4bb79        raphlopes/devops-lab   "node /root/index.js"   8 minutes ago       Exited (1) 8 minutes ago                        amazing_mahavira
b6035a136e93        raphlopes/devops-lab   "node /root/index.js"   8 minutes ago       Created                                         goofy_euler
6ab7d252a9a7        52eca5dc64bb           "node /root/index.js"   11 minutes ago      Exited (1) 11 minutes ago                       romantic_leavitt
cd2b19a79e2b        52eca5dc64bb           "node /root/index.js"   13 minutes ago      Created                                         cranky_lederberg


command: docker start -d --net=host competent_haibt

## 2.7
question: on utilise docker ps -a
question: le nom est competent_haibt
command: docker ps -a

command: docker start -d --name api raphlopes/devops-lab
ou
docker rename competent_haibt api

## 2.8
question: on utilise docker run -it louisclavero/devops_lab /bin/bash
output:

## 3.1
command:

## 3.4
command:
command:
