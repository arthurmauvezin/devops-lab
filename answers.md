# Answers

Lastname: Zmerli
Firstname: Ismail

## 2.2
command: docker build -t app

## 2.3
question: We need to open the appropriate port to listen our incoming requests.
command: EXPOSE 3000

## 2.5
question: The image cannot be pushed at first. We need to set up the login first.
command: docker login docker tag app ismazmerli/devops-lab docker push ismazmerli/devops-lab

## 2.6
command: docker system prune -a

question:The previous command deletes all images. then We can pull the image we added and finally run it.
command:docker pull ismazmerli/devops-lab

command:docker run -d ismazmerli/devops-lab

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
