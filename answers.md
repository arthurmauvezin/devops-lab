# Answers

Lastname: Bazin	
Firstname: Diego

## 2.2
command:
sudo docker run diego

## 2.3
question:It fails because ports aren't opened.
command: sudo docker run -p 3000:3000 diego

## 2.5
question: We have to change the name of our image
command: docker push package92/projet1:latest

## 2.6
command: sudo docker system prune -a

question:
command: 
sudo docker pull package92/projet1
sudo docker create package92/projet1

command:
sudo docker run -d --net=host suspicious_chaplygin

## 2.7
question:
question:
command: sudo docker ps -a

command:
sudo docker rename suspicious_chaplygin api
## 2.8
question:
output:
MacBook-Air-de-Diego:devops-lab diego1997$ sudo docker run -it package92/projet1 /bin/bash
root@bfed251b3f35:/# cat /etc/*release
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
command:
sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
