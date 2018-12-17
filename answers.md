# Answers

it was hard to realize this lab on docker playground, 
it did'nt work well so I spent several days to fix it and finally had to install windows pro to use docker with my powershell

Lastname: Bolland
Firstname: Coline

## 2.2
Start a docker container from the image you just created in the preceding question. 

command: docker run coline

## 2.3
question:Try to access to your service (with postman for example). 
Restart container beeing careful to open needed port to get access to your service (see docker help).

We need to open the port to get access as it's shown now on the screenshot of Postman example. 
It could not work as it was not linked to any port.

command: docker run -it -p 3000:3000 coline (dans powershell)
EXPOSE 3000  (dans dockerfile)

## 2.5
question:

Create yourself an account on Docker Hub
Create a new repository attached to your account
Then, push your image to your newly created repository

Your image cannot be pushed as it is. Why ? Modify the name of your image and push it again on your new repository on Docker Hub. Write the command you use in answers.md file.

command: docker login --username=colinebolland
Docker Hub then asks for the password, that I entered to connect
then I push the docker image to docker hub
command: docker push colinebolland/devops-lab

## 2.6
question:
Delete all your images created from the start of the lab on your computer.

command: docker stop $(docker ps -a -q)
	docker rm $(docker ps -a -q)
	docker rmi -f $(docker images -a -q)

(to cleanup docker images and containers
stop all containers
remove all containers
remove all images)
We have deleted all local images.
command: docker images (on voit qu'il n'y a plus d'image cf. screenshot8)

question: Start a container again with the name you pushed on Docker hub earlier. 
command: docker run colineboland/devops-lab

Here I have connected to my Docker Hub account and I pulled the image I just pushed. 
Then it's able to find the image on which build the container.

question: Start your container again in detached mode
command: docker run --detach colinebolland/devops-lab


## 2.7
question: Your container is normally started. In detached mode, how can you tell that container is started ? What is the name of your container ? 
question:In detached mode we can tell if a container is starting by
using the command to list containers: docker ps, show all running containers by default.
we can see everything on the captures in the folder. 
Restart your container by renaming it with a name corresponding to its function.

command: docker ps
command:docker run --name new --detach colinebolland/devops-lab

## 2.8
question:
docker exec new cat /etc/os-release

output:
"PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command:

## 3.4
command:
command:
