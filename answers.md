# Answers

Lastname: MAALOUF
Firstname: Rawad

## 2.2
command: sudo docker run AppTest

## 2.3
question: On considère que les ports sont fermés et que donc on doit en ouvrir un. 
command: sudo docker run -i --expose:PortNumber AppTest 
On doit donc bien spécifier le port que l'on souhaite ouvrir ici j'ai utilisé le port 3000 en localhost personnellement (on remplace PortNumber par 3000)
Et on run donc en même temps.

## 2.4
  On utilise les commandes MYSQL_HOST, ainsi que les autres commandes en JS pour pouvoir les déclarer et créer la connexion.
## 2.5
question:
On rebuild l'image, ainsi nous trouvons que notre image ne peut être push comme cela.
De fait, docker push utilise le tag pour identifier le dossier où il doit envoyer l'image.
Donc on utilise les commandes suivantes pour y avoir accès : 

command:

sudo docker login // J'utilise mes credentials ou login + password pour accéder
sudo docker tag img rawad97/devops_lab // soit img le nom de l'image, rawad97 mon ID Docker, et devops_lab mon dossier
sudo docker push rawad97/devops_lab  // Enfin je push mon image dans le dossier voulu

## 2.6
command:

sudo docker system prune -a 
La commande prune permet de purger le système.

question:
Pour créer un container, on utilise la commande suivante, issue du Docker help : sudo docker create rawad97/devops_lab
sudo docker pull rawad97/devops_lab

On utilise --net=host  

command:

sudo docker run rawad97/devops_lab

sudo docker ps -a yields:
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS               NAMES
b6035a136e93        rawad97/devops_lab   "node /root/index.js"       8 minutes ago       Up 2 seconds                          goofy_euler

command:

sudo docker start -d --net=host goofy_euler

## 2.7
question: On utilise "sudo docker ps -a", cela nous permet de savoir le statut des containers, et la liste des containers réalisés.

question: Le nom de mon container est goofy_euler

command:

sudo docker ps -a

command: 
On dispose de 2 solutions alternatives, on pourrait par exemple, renommer le conteneur : sudo docker rename goofy_euler api ou alors rerun: 
sudo docker start -d --name api rawad97/devops_lab


## 2.8
question: Tout d'abord on entre en interactive mode en utilisant la commande suivante : sudo docker run -it rawad97/devops_lab /bin/bash
puis on utilise la commande donnée.
output:
On obtient donc en sortie : 
root@b6035a136e93 :/# cat /etc/*release
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
