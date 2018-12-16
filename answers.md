# Answers

Lastname: Caruana-Tomasini
Firstname: Baptiste

## 2.2
command: sudo docker run testapp

## 2.3
question: Seeing the second part on the question, I think that the ports are closed
command: sudo docker -i --expose:NumeroDuPort testapp

## 2.5
question: Docker have tu use the tag to known how is the repository in wich he has to send data. 
command: sudo docker login
 		 sudo docker tag testing BaptisteCaruana/devops_lab
         sudo docker push BaptisteCaruana/devops_lab

## 2.6
command: sudo docker system prune -a
question: The fact is that the container have his own network, and the --net=host will permit it to connect to the localhost. 
command:

command:

## 2.7
question: From the containers list, we see all the status and we can see if uour is started or not.
question: the name is ecstatic_hoover ??? 
command: sudo docker ps -a
command: sudo docker start -d --name api BaptisteCaruana/devops_lab

## 2.8
question: We have tu put-on the interactive mode
output: ??

## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
