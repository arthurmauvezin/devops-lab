# Answers

Lastname: THANABALASINGAM
Firstname: Senthan

## 2.2
command:
docker build . -t api
docker run api
## 2.3
question:
We can't access through postman because the port are not opened. We can't access into the container till the port are opened.
command:

docker run -p 3000:3000 -td api

## 2.5
question:
We have to change the tag of our image to identify the repository

command:
docker tag 60689465a914  godlikedocker/devops-lab:latest
docker push godlikedocker/devops-lab:latest
## 2.6
command:
sudo docker system prune -a

question:
We pull the image from docker hub then start it.
command:
sudo docker pull godlikedocker/devops-lab

command:
sudo docker create godlikedocker/devops-lab
sudo docker run --detach godlikedocker/devops-lab
## 2.7
question:
We execute the following command "sudo docker ps -a" to get 
question:
We can see the name of our started container : objective_gates
We are going to change that into js_api
command:
sudo docker ps -a
command:
sudo docker rename objective_gates js_api

## 2.8
question:
The name of the OS of our container is : Alpine Linux
output:
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"
## 3.1
command:
sudo docker-compose up
## 3.4
command:
sudo docker-compose up -d
command:
sudo docker-compose logs