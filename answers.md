# Answers

Lastname: Samuel
Firstname: Clara

## 2.2 - j'avais fait un : docker build -t toto .
command: docker run toto

## 2.3
question: Try to access to your service (with postman for example). Why is your call fail ?

Reponse : ça ne marche pas car les ports n'ont pas été spécifiés.

question : Restart container beeing careful to open needed port to get access to your service (see docker help). Write the command you use in answers.md file.

command: docker run -p 3000:3000 toto

## 2.5
question: Your image cannot be pushed as it is. Why ?

Reponse : Cela est lié au nom/tag de l'image.

question : Write the command you use in answers.md file.

command: sudo docker login
        sudo docker tag toto claras/labdevops-lab-webzoo //(nom de mon image + mon ID Docker/ + mon dossier)
        et apres on push : sudo docker push claras/labdevops-lab-webzoo (mon ID Docker/ + mon dossier )

## 2.6
question : Delete all your images created from the start of the lab on your computer. Write the command you use in answers.md file.

command: sudo docker system prune -a

question: Start a container again with the name you pushed on Docker hub earlier. Write the command you use in answers.md file.

command: sudo docker create claras/devops_lab


command: sudo docker run claras/devops_lab

## 2.7
question: how can you tell that container is started ?

Reponse : sudo docker ps -a

question: What is the name of your container ?

Reponse :  

command: sudo docker ps -a //pour les statuts

command: sudo docker start -d --name docker_zoo_api claras/devops_lab

## 2.8
question: Open an interactive session to obseve files inside container.

Reponse : sudo docker run -it claras/devops_lab

question : What is the OS from the container ?

Reponse : L'Os est : Linux

output:

NAME:"ALPINE LINUX"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: sudo docker-compose up

## 3.4
command:sudo docker-compose run -d
command: sudo docker logs




## Remarque : J'ai trouvé ce TP très difficile pour un tp d'initiation, peu clair, flou, peu guidé.
