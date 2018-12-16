# Answers

Lastname: CHUET
Firstname: Fiona

## 2.2
command: docker run app

## 2.3
question: The call failed because we are not using the right port number to access our service. Thus, we need to open them, using the following command (port number is 3000):
command: docker run -p 3000:3000 app

## 2.5
question: The image cannot be pushed as it is because it needs to have the same name as the newly created repository on Docker Hub. 
Thus, we rename it (first command) using a meaningful tag ('zoo' as it was the project's name) alongside the name of the Docker Hub's repository ('fc2313/devops-lab'). 
The second command allows us to push the image onto the repository. Beforehand, we used the command 'docker login' to connect to Docker Hub.
command:
docker tag app fc2313/devops-lab:zoo
docker push fc2313/devops-lab:zoo 

## 2.6
command: docker rmi -f $(docker images -q) 

question: Before the container starts, the image is downloaded from the Docker Hub repository as it was not present locally anymore.
The following command uses environment variables parameters (from question 2.4).
command: docker run --rm -e MYSQL_HOST='localhost' -e MYSQL_USER='root' -e MYSQL_PASSWORD='' -e MYSQL_DATAQL_PORT='3306' -p 3000:3000 fc2313/devops-lab:zoo

command: docker run -d -e MYSQL_HOST='localhost' -e MYSQL_USER='root' -e MYSQL_PASSWORD='' -e MYSQL_DATAQL_PORT='3306' -p 3000:3000 fc2313/devops-lab:zoo

## 2.7
question: In detached mode, we can tell a container has started when its ID is displayed right after the call. In our case, the ID was 3411cdb45c04326af46cb92c54228cda1439debe75ea78e2b74f267601e0d9c6.
To know its corresponding name, we use a command to display information about all containers (first command). Then, we look for its ID to determine its name -in our case, it was 'cranky_feynman'.
question: Finally, we rename our container to give it a meaningful name ('zoo') (second command).
command: docker container ls --all 
command: docker rename cranky_feynman zoo

## 2.8
question: To know the container's OS, we need to open a terminal inside said container (we use the following command: winpty docker run -it fc2313/devops-lab:zoo bash). 
Then, we type 'cat /etc/*release' to list information about the container's OS which is Debian GNU/Linux.
output:
root@ea622836276f:/# cat /etc/*release
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
command: docker-compose logs zoo 
