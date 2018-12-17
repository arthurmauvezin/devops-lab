# Answers

Lastname: Hellou
Firstname: Ammaria

## 2.2
command: sudo docker run apptest

## 2.3
question: L'echec est du aux ports qui ne sont pas ouverts
command: sudo docker -i --expose:PortNumber apptest

## 2.5
question: L'image ne peut pas être push car il utilise l'identifiant du repository
          
command:  sudo docker login
          sudo docker tag testing ammaria/devops_lab
          sudo docker push ammaria/devops_lab

## 2.6
command: sudo docker system prune -a

question: 

command: sudo docker run ammaria/devops_lab
         sudo docker ps -a yields: container id, image, command, created, status, ports, names
         
command: sudo docker start -d --net=host ammaria_zoo

## 2.7
question: docker ps nous permet de consulter la liste des conteneurs en cours d'utilisation.
question: le nom de mon conteneurs est ammaria_zoo
command: sudo docker ps-a

command: sudo docker start -d --name api ammaria/devops_lab

## 2.8
question:
output:

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
