# Answers

Lastname: Colin de Verdière
Firstname: Matthieu

## 2.2
command: sudo docker run app

## 2.3
question: L'accès au service n'est pas possible car le port n'est pas ouvert.
command: sudo docker run -p 3000:3000 app

## 2.5
question: Pour pouvoir "push" notre image Docker sur Docker Hub, celle-ci doit avoir le même nom que le répertoire.
command: 
sudo docker login (Il faut d'abord s'identifier)
sudo docker tag app matthieucdv/devops_lab (cette commande permet de renommer l'image Docker)
sudo docker push matthieucdv/devops_lab (cette commande permet de "push" l'image sur Docker Hub)

## 2.6
command: sudo docker system prune -a

question: Dans un premier temps, on "pull" l'image avec la commande: "sudo docker pull matthieucdv/devops_lab". Après cela, on crée un conteneur avec le même nom que celui que l'on a push sur Docker hub en utilisant la commande ci-dessous:
command: sudo docker create matthieucdv/devops_lab

command: sudo docker run --detach matthieucdv/devops_lab

## 2.7
question: Afin de récupérer les informations relatives à tous les conteneurs (id, nom, status et datede création), on exécute la commande "sudo docker ps -a" (qui liste ces derniers). On peut voir que le conteneur a un status "up". 
question: Le conteneur a pour nom boring_varahmihira

command: sudo docker rename boring_varahmihira service_web

## 2.8
question:L'OS du conteneur est Alpine Linux
output: 
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"


## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
