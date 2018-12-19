# Answers

Lastname: Moliner
Firstname: Victor

## 2.2
command: 
docker build -t app .
docker run app

## 2.3
question: Our code doesn't work because the port is not open
command: docker run -p -3000:3000 -td app

## 2.5
question: We have to change the tag to do the push
command: 
docker tag img victormoliner/devops-lab
docker push victormoliner/devops-lab

## 2.6
command: docker system prune -a

question:
command:  

command: 

## 2.7
question: We see the status of containers created
question: Name of our container is relaxed_mclean
command: docker ps -a

command: docker rename relaxed_mclean image_lab

## 2.8
question: the OS is Alpine Linux 
output:
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
