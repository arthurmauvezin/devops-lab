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
sudo docker login (Il faut d'abord s'identifier)
sudo docker tag app matthieucdv/devops_lab (cette commande permet de renommer l'image Docker)
sudo docker push matthieucdv/devops_lab (cette commande permet de "push" l'image sur Docker Hub)

## 2.6
command: sudo docker prune -a

question: Dans un premier temps, on "pull" l'image avec la commande: "sudo docker pull matthieucdv/devops_lab". Après cela, on crée un conteneur avec le même nom que celui que l'on a push sur Docker hub en utilisant la commande ci-dessous:
command: sudo docker create matthieucdv/devops_lab

command: sudo docker run --detach matthieucdv/devops_lab

## 2.7
question: Afin de récupérer les informations relatives à tous les conteneurs (id, nom, status et datede création), on exécute la commande "sudo docker ps -a". On peut voir que le conteneur a un status "up". 
question: Le conteneur a pour nom boring_varahmihira

command: sudo docker rename boring_varahmihira service_web

## 2.8
question:L'OS du conteneur est Ubuntu
output: On obtient la sortie suivante:
DISTRIB_ID=Ubuntu 
DISTRIB_RELEASE=18.04 
DISTRIB_CODENAME=bionic 
DISTRIB_DESCRIPTION="Ubuntu 18.04.1 LTS" 
NAME="Ubuntu" 
VERSION="18.04.1 LTS (Bionic Beaver)" 
ID=ubuntu 
ID_LIKE=debian 
PRETTY_NAME="Ubuntu 18.04.1 LTS" 
VERSION_ID="18.04" 
HOME_URL="https://www.ubuntu.com/" 
SUPPORT_URL="https://help.ubuntu.com/" 
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/" 
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy" 
VERSION_CODENAME=bionic 
UBUNTU_CODENAME=bionic


## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
