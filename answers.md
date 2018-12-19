# Answers

Lastname: AUBARET 
Firstname: Auriane

## 2.2
command: docker run app

## 2.3
question: L'accès n'est pas autorisé. En effet, nous n'utilisons pas le bon numéro de port pour accéder à notre service.  
Il est donc nécessaire d'ouvrir le port adéquat.
command: docker run -p 3000:3000 -td app

## 2.5
question: Il est nécessaire de changer le tag pour pouvoir pusher l'image. 
command: docker tag img AAuriane/devops-lab: latest
command: docker push AAuriane/devops-lab: latest

## 2.6
command: docker system prune -a

question: Il est nécessaire de pull l'image précédente. 
command: docker pull AAuriane/devops-lab

command: docker create AAuriane/devops-lab
command: docker run --detach AAuriane/devops-lab

## 2.7
question:  
question: On doit modifier le nom du fichier.
command: docker ps 

command: docker rename 

## 2.8
question:
output:

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs my-service
