# Answers

Lastname: Blondeau
Firstname: Benjamin

## 2.2
command: docker run bblondeau/zoo

## 2.3
question: L'appel echoue car le port 3000 n'est pas ouvert. Il est donc nécessaire de redémarrer le container en ouvrant le port adéquat (3000) que l'on connecte avec le port (3000) de notre machine.
command: sudo docker run -p 3000:3000 -td bblondeau/zoo

## 2.5
question: L'image ne peut pas être "pushed". En effet, on doit changer le tag : <username>/<repositoryname>, dans mon cas benjamin123/devops-lab.
command: docker tag 855ddae81c92 benjamin1234/devops-lab
docker push benjamin1234/devops-lab

## 2.6
On commence par supprimer tous les containers docker sur notre machine (locale).
command: sudo docker system prune -a

question: La commande `sudo docker run --detach benjamin1234/devops-lab` commence par vérifier si le container est présent localement. Dans notre cas, il a été supprimé précédemment ("Unable to find image 'benjamin1234/devops-lab:latest' locally"). Docker va donc automatiquement "pull" le container depuis Docker Hub puis va le "create" avant de le "run".
command: sudo docker run --detach benjamin1234/devops-lab

command: sudo docker create benjamin1234/devops-lab


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
