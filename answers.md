# Answers

Lastname: LE
Firstname: Tien Hoang-Dôn

## 2.2
command: docker run app

## 2.3
question: Le port n'a pas été ouvert
command: docker run -i -expose:3000 app

## 2.5
question: Il faut au préalable se login avant de push
command: 
	docker login
	docker tag app sagakedon/devops-lab
	docker push sagakedon/devops-lab

## 2.6
command: docker system prune -a

question:
command: 
	docker pull sagakedon/devops-lab
	docker create sagakedon/devops-lab
	docker run sagakedon/devops-lab

command:docker run -d sagakedon/devops-lab

## 2.7
question: docker ps -a
question: The name of my container is agitated_sinoussi
command:

command: docker rename agitated_sinoussi webapi

## 2.8
question: 
	docker run -it sagakedon/devops-lab /bin/bash
	cat /etc/*release
output: 
	PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
	NAME="Debian GNU/Linux"
	VERSION_ID="9"
	VERSION="9 (stretch)"
	ID=debian
	HOME_URL="https://www.debian.org/"
	SUPPORT_URL="https://www.debian.org/support"
	BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d
command: docker-compose logs
