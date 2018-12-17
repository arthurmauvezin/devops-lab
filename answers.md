# Answers

Lastname:Maunick
Firstname:Mathis

## 2.2

command:docker run app 

## 2.3
question: le port n'est pas ouvert
command: docker run -p 3000:3000 app

## 2.5
question: On se connect au compte puis on tag l'image et on la push

command:docker login
command:docker tag app mathismaunick/devops-lab
command:docker push mathismaunick/devops-lab


## 2.6
command:docker system prune -a 

question:Nous venons de supprimer toutes les images locales sur notre ordinateur, si nous fabriquons un nouveau conteneur, il n'y aura pas d'images à partir desquelles construire. Mais Docker peut extraire une image de notre dépôt. Nous lui donnerons le nom avec la commande
command: docker create mathismaunick/devops-lab:test

command: docker --detach run mathismaunick/devops-lab:test

## 2.7
question:Grâce à la commande ci dessous nous obtiendrons tous les conteneurs avec ID, Noms, etc. Nous verrons alors si le conteneur a été démarré correctement en trouvant son ID et en vérifiant son état.
command:docker ps -a
command:docker run --name toto --detach run mathismaunick/devops-lab:test

## 2.8
question:linux
output: NAME="Alpine Linux"
 		ID=alpine
 		VERSION_ID=3.8.1
 		PRETTY_NAME="Alpine Linux v3.8"
 		HOME_URL="http://alpinelinux.org"
 		BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:docker-compose up

## 3.4
command:sudo docker-compose up -d
command:docker-compose logs

