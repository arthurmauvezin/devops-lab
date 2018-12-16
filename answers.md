# Answers

Lastname:TIMSILINE	
Firstname:Nazim

## 2.2
question:(CMD [ "node", "." ] dans le Dockerfile) 
command:sudo docker run devops-lab_app  

## 2.3
question:l'appel sur postman a raté car le port n'est pas précisé
command:EXPOSE 3000

## 2.5
question:git status (connaitre les fichiers modifies) + git commit -m "commentaire" (pour commit) puis on push
command:git push 

## 2.6
command:sudo docker rmi $(sudo docker images -q)

question:avant il faut pull depuis l'environnment où est executé ce container 
command:sudo docker start 
infos: (expliquer plus haut dans infos de 2.2)

command:sudo docker run -d Timsline/devops-lab_app
infos: (username /name app) en mode detaché

## 2.7
question:docker ps 
question:zoo
command:docker rename my_container my_new_container

## 2.8
question: sudo docker exec -it zoo sh
Ceci permet de rentrer dans le container puis on execute cat /etc/*release
output:

## 3.1
command:sudo docker-compose up 

## 3.4
command:docker-compose restart -t 20 (service)
-t permet de choisir le timeout (10 par defaut)
command:docker-compose logs -f
