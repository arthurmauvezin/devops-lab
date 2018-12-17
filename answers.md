# Answers

Lastname: Poretz
Firstname:Ruben

## 2.2
command: sudo docker run app 

## 2.3
question:The port is not open so it's impossible to access
command:sudo docker run -p 3000:3000 -td app

## 2.5
question: We have to change the name of the tag in the way to identify the repository
command:"sudo docker tag tagnumber rubpo/devops_lab" Where tagnumber is the tag number 
	sudo docker push rubpo/devops_lab

## 2.6
command:sudo docker system prune -a

question:
command:docker pull rubpo/devops_lab

command:docker create rubpo/devops_lab
		docker run rubpo/devops_lab

## 2.7
question: When we run the commande below, we can access to the status of all containers so we can know if our containers started. We saw that our container status is up.
question:Our container is named modest_noether
command: sudo docker ps -a 

command:sudo docker rename modest_noether web_application


## 2.8
question:
output:

## 3.1
command:sudo docker-compose up


## 3.4
command:sudo docker-compose up -d
command:sudo docker-compose logs

