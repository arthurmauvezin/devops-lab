# Answers

Lastname: Zamith
Firstname: Benjamin




## 2.2: Run your app
command: sudo docker run app_test2





## 2.3: Access to your service
question: Ports are not opened
command: sudo docker run -i --expose:3000 app_test2

3000 is the port number we want to open.
I chose 3000 because in my script.js, i used the port 3000.




## 2.5 Ship your image
question: In order to push, we need first to login
command: 

sudo docker login
sudo docker tag app_test2 benzam/devops_lab
sudo docker push benzam/devops_lab





## 2.6 Let's Run it
command: sudo docker system prune -a

question:
first, we pull the image:
sudo docker pull benzam/devops_lab

Then, create a container:
sudo docker create benzam/devops_lab

command: sudo docker run benzam/devops_lab



## 2.7 Naming
question: sudo docker ps -a
we get a list with information of the container.
question:
command:sudo docker ps -a

command:docker start -d --name api benzam/devops_lab




## 2.8 Go inside
question: docker run -it benzam/devops_lab /bin/bash
output:
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"




## 3.1 Docker-compose file
command: sudo docker-compose up



## 3.4 Detached
command: sudo docker-compose up -d
command:sudo docker-compose logs
