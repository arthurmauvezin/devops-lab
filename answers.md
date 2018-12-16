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
command:
sudo docker pull godlikedocker/devops-lab

command:
sudo docker create godlikedocker/devops-lab
sudo docker run godlikedocker/devops-lab
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
