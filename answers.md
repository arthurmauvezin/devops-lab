# Answers

Lastname: Rouaix    
Firstname: Aliénor

## 2.2
command: sudo docker run doc

## 2.3
question: port aren't open so it failed
command: sudo docker run -p 3000:3000 doc

## 2.5
question: changing image name 
command: sudo docker push alienorrouaix/lab:latest

## 2.6
command: sudo docker system prune -a

question: getting back the image to then start a container
command: docker pull alienorrouaix/lab
docker create alienorrouaix/lab

command:
 sudo docker run -d --net=host quizzical_germain

## 2.7
question: containers names, id, status, date of creation are displaying
question:
command: sudo docker ps -a

command:
sudo docker rename quizzical_germain api
## 2.8
question: switching to interactive mode 
output:
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
root@bfed251b3f35:/# 

## 3.1
command: sudo docker-compose up
## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs

