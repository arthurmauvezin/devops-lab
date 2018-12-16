# Answers

Lastname:Lozano Hernandez
Firstname:Jesus Adolfo

## 2.2
command:docker run app

## 2.3
question:because we need to add the ports of the docker container
command:docker run -p 3000:3000 app

## 2.5
question: The image can not be pushed because it needs to have the same name as the new repository
command:docker push jalh24/web:app

## 2.6
command:docker rmi -f $(docker images -q)

question:Befor entering into the container the image is downloaded again since is not present because we remove it 
command: docker run --rm -e MYSQL_HOST='localhost' -e MYSQL_USER='root' -e MYSQL_PASSWORD='' -e MYSQL_DATAQL_PORT='3306' -p 3000:3000 jalh24/web:zoo
command:docker run -d -e MYSQL_HOST='localhost' -e MYSQL_USER='root' -e MYSQL_PASSWORD='' -e MYSQL_DATAQL_PORT='3306' -p 3000:3000 jalh24/web:zoo

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
