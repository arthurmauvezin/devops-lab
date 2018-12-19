# Answers

Lastname:sugunaparajan
Firstname:agetha

## 2.2
command:
+ sudo docker run agetha

## 2.3
question: Ça ne marche pas car les ports sont fermés. On doit exposer le port 3000.
command: sudo docker run -p 3000:3000 agetha

## 2.5
question: On doit changer le nom de l'image avec push l'image.
command: docker push agetha/projet 

## 2.6
command: sudo docker system prune -a

question: On pull l'image avant le commancement du container.
command: 
sudo docker pull agetha/projet
sudo docker create agetha/projet


command: 
sudo docker run -- detach agetha/projet

## 2.7
question: On peut voir l'id, le nom et le statut du container.
question:
command: sudo docker ps -a

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
