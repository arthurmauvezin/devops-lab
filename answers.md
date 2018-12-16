# Answers

Lastname: BATTAGLIOTTI
Firstname: Antoine

## 2.2
command:
- Build Container: docker build -t webapi .
- Run Container: docker run webapi

## 2.3
question: When we try to connect to our service it failed as we need to use the --publish flag to create a firewall rule which maps our container port to our port on the Docker host.
command: docker run -p 3000:3000 webapi

## 2.5
question: Before pushing our image to our newly created repository we need to login to our Docker Hub account on our terminal. Also, we need to tag our image before pushing it, a good choice for a tag is something that will help you understand what this container should be used in conjunction with, or what it represents. 
command:
- Connect to our account: docker login --username=antoinebattagliotti //password will be asked after
- Tag our image: docker tag webapi antoinebattagliotti/devops-lab:webService
- Push our image to Docker Hub: docker push antoinebattagliotti/devops-lab:webService

## 2.6
command:
- Delete all images on computer: docker rmi $(docker images -q)
//First I had to stop all running container before killing them with the command docker: rm $(docker ps -a -q)

question: As we deleted all local images and are disconnected to our Docker Hub account, an error occured as it couldn't find any image on which build the container. So we have to connect to our Docker Hub account and pull the image we just pushed. Then it will be able to find the image on which build our container.
command:
- Run container from Docker Hub: docker run antoinebattagliotti/devops-lab:webService

command:
- Run container in detached mode: docker run -d antoinebattagliotti/devops-lab:webService

## 2.7
question: In detached mode we can tell if a container is starting by using the command to list containers: docker ps, show all running container by default and to see all containers even those not running we would have to use: docker ps -a.
question: We can see our container name by listing our container with the previous command under 'Name'. Our container name is: 'ecstatic_williams'. After renaming our container we can check if the changes have been corrrectly applied.
command:
- Check running container: docker ps

command:
- Restart container and rename it: docker run --name webservice -d antoinebattagliotti/devops-lab:webService
//Before I had to stop the container with the command: docker stop ecstatic_williams

## 2.8
question:
To get OS informations command: docker exec webservice cat /etc/os-release
output:
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:
- Start service: docker-compose up

## 3.4
command:
- Start service in detached mode: docker-compose up -d
command:
- Visualise logs from our service: docker-compose logs
