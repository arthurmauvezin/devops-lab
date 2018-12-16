# Answers

Lastname: Metharam

Firstname: Michael

## 2.2
command: docker run app

## 2.3
question: The call fails because the the container's ports are not published to the outside world by default. Furthermore, it does not know the necessary parameters to connect to the MySQL database. To rectify this, we can add the following line to our Dockerfile:

command: EXPOSE port_number

## 2.5
question: Docker Hub enforces that the image be tagged accordingly for it to be uploaded correctly to the Docker Hub (which is not the case as of right now). Furthermore, we first have to connect our local Docker instance on our PC to the Docker Hub.

command: TO LOGIN TO DOCKER HUB: docker login --username=mmetharam

Docker Hub will then ask for my password, which I entered accordingly. 

SEE LIST OF ALL DOCKER IMAGES (to get the ID of the image that needs to be tagged and then uploaded): docker images
TAG THE DOCKER IMAGE ACCORDINGLY: docker tag 384ec2198808 mmetharam/devops-lab:test1

PUSH THE DOCKER IMAGE TO DOCKER HUB: docker push mmetharam/devops-lab:test1

## 2.6
command: DELETE ALL IMAGES: docker rmi -f $(docker images -a -q)

question: Since we first deleted all local images on our PC with the previous command, if we were to make a new container now there would be no images to build from. However, since we had pushed our previous image onto Docker Hub, Docker is capable of automatically pulling an image from our repository (that matches the name specified in the command) and then building from it. This is what happens before the container is built correctly. 

command: RUN CONTAINER FROM DOCKER HUB: docker run mmetharam/devops-lab:test1

command: RUN IN DETACHED MODE: docker run --detach mmetharam/devops-lab:test1

## 2.7
question: To check whether the container was started correctly, we can look at the list of currently running containers with the command "docker ps", ordered by their container ID.
Before running that command, it should be noted when you run something in detached mode, the console returns its container ID. To check whether the container we created started correctly, we just have to find its container ID in the previous list and check its status.

question: According to information returned by the "docker ps" command, my container is named "heuristic_blackwell" at this stage.

command: CHECK WHETHER THE DOCKER IS CURRENTLY RUNNING CORRECTLY IN DETACHED MODE: docker ps

command: RUN CONTAINER AND NAMING IT ACCORDINGLY: docker run --name devops-test --detach mmetharam/devops-lab:test1

When the previous command is executed, we can check with "docker ps" that the container created this way is indeed named "devops-test".

## 2.8
question: I executed the following command to see information about the current running OS in my Docker container: docker exec devops-test cat /etc/os-release

output:
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
