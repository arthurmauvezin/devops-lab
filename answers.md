# Answers

Lastname: Blondeau
Firstname: Benjamin

## 2.2
command: docker run bblondeau/zoo

## 2.3
question: L'appel echoue car le port 3000 n'est pas ouvert.
command: docker run -i --expose 3000 bblondeau/zoo

## 2.5
question: L'image ne peut pas être "pushed". En effet, il faut être connecté et utiliser "tag" pour que le push puisse être effectué.
command: docker login
docker tag img benjamin4321/devops-lab
docker push benjamin4321/devops-lab

## 2.6
command: docker system prune -a

question: On supprime les images créées depuis le début et on redémarre le container.
command: docker create benjamin4321/devops-lab
docker pull benjamin4321/devops-lab

command: docker run --detach benjamin4321/devops-lab

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
