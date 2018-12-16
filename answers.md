# Answers

Lastname: Colin de Verdière
Firstname: Matthieu

## 2.2
command: sudo docker run --interactive  app

## 2.3
question: L'accès au service n'est pas possible car le port n'est pas ouvert.
command: sudo docker run -p 3000:3000 app

## 2.5
question: Pour pouvoir "push" notre image Docker sur Docker Hub, celle-ci doit avoir le même nom que le répertoire.
command: 
sudo docker login (Il faut d'abors s'identifier)
sudo docker tag app matthieucdv/devops_lab (cette commande permet de renommer l'image Docker)
sudo docker push matthieucdv/devops_lab (cette commande permet de "push" l'image sur Docker Hub)

## 2.6
command: sudo docker prune -a

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
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose Logs
