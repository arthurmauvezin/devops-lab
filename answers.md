# Answers

Lastname:Halbeher
Firstname:Clement

## 2.2
command: docker run app .

## 2.3
question: the port are not opened so we can not use postman for this part( with expose port number)
command: docker run -e MYSQL_HOST='localhost' -e MYSQL_PORT='8080' -e MYSQL_DATABASE='project' -e MYSQL_LOGIN='root' -e MYSQL_PASSWORD='root' app
## 2.5
question: We need to put a new tag on our image to identify the repository
command:docker tag 115cee57599a niebeu/devops-lab:latest docker push niebeu/devops-lab:latest

## 2.6
command:sudo docker system prune -a

question: we delete all the images and after we create a new container.now  our previous image is on docker hub
command:

command:docker create niebeu/devops-lab:app docker run --detach niebeu/devops-lab:app

## 2.7
question: name: mystifying_rubin
question: with docker ps we saw the running containers and we change the docker name after
command:  docker ps -a

command: docker rename mystifying_rubin js_api

## 2.8
question: to see information about our running os on our docker we us the following command
output: docker exec devops-lab cat /etc/os-release

## 3.1
command:docker-compose up

## 3.4
to upgrade after:
command:docker-compose up -d
command:

