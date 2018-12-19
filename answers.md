# Answers

Lastname:ORTU
Firstname:Julia 

## 2.2
command: docker build -t app

## 2.3
question: When we try to access to Postman for example, the call failed because the port is not appropriate. We have to open the needed port to listen our incoming requests. I chose the port 3000 to get access successfully because it's the "place" where we are listening. 
command: EXPOSE 3000

## 2.5
question: First, our image cannot be pushed correctly. We have to configure some settings: we use the docker login function to log on and then we modify the name of the image to the repositery and finaly push it again. 
command: docker login docker tag app juliaortu/devops-lab docker push juliaortu/devops-lab

## 2.6
command: docker system prune -a

question: With the previous command, we have deleted all images created from the start of the lab. Now, we can pull the image we pushed on Docker hub earlier. Then, we can run the image in detached mode.
command: docker pull juliaortu/devops-lab

command: docker run -d juliaortu/devops-lab

## 2.7
question: To be able to tell that container is started, we can use the command docker ps to see a list of all running docker containers.
command: docker ps 

command: docker rename 

## 2.8
question:
output:

## 3.1
command: docker-compose up

## 3.4
command: docker-compose -d up
command: docker_compose logs
