# Answers

Lastname: Branco
Firstname: Luc

## 2.2
command:sudo docker run testapp

## 2.3
question:ports are not opened
command:sudo docker -i --expose:PortNumber testapp

## 2.5
question: Cela est dû au fait que docker push la balise pour identifier le répertoire où il est supposé push l'image.

command:sudo docker login
sudo docker tag testing BrancoLuc/devops-lab
sudo docker push BrancoLuc/devops_lab

## 2.6
command:sudo docker system prune -a

question: sudo docker pull BrancoLuc/devops_lab
sudo docker create BrancoLuc/devops_lab



Nous devons utiliser - net = host afin d’obtenir l’hôte local sur l’ordinateur portable puisque le conteneur possède son propre réseau par défaut.

command: sudo docker run BrancoLuc/devops_lab

sudo docker ps -a yields:
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS               NAMES


command: sudo docker start -d --net=host lykos_alliagas

## 2.7
question: Nous utilisons la commande " sudo docker ps-a" pour obtenir la liste des conteneurs et vérifier que notre conteneur et démarré.

question: Le nom est lykos_alliagas

command:sudo docker ps-a

command: sudo docker start -d --name api BrancoLuc/devops_lab

## 2.8
question:  on utilise " sudo docker run -it BrancoLuc/devops-lab /bin/bash

output:
root@09a1ef804243:/# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
