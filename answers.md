# Answers

Lastname: Blondeau
Firstname: Benjamin

## 2.2
command: docker run bblondeau/zoo

## 2.3
question: L'appel echoue car le port 3000 n'est pas ouvert. Il est donc nécessaire de redémarrer le container en ouvrant le port adéquat.
command: sudo docker run -p 3000:3000 -td bblondeau/zoo

## 2.5
question: L'image ne peut pas être "pushed". En effet, on doit changer le tag pour cela.
command: docker tag img benjamin1234/devops-lab
docker push benjamin1234/devops-lab

## 2.6
command: sudo docker system prune -a

question: On "pull" l'image créée et on redémarre le container.
command: sudo docker pull benjamin1234/devops-lab

command: sudo docker create benjamin1234/devops-lab
sudo docker run --detach benjamin1234/devops-lab

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
