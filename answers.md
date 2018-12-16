# Answers

Lastname:Lacave
Firstname:Gaspard

## 2.2
command:docker run app

## 2.3
question:It could not work before because the app was not linked to any port. We need then to add EXPOSE 3000 in the dockerfile and run the app with a new command listening to this port.
command:docker run -it -p 3000:3000 app

## 2.5
question:We must push the images with the good tag comporting the username first. In addition, we must login just before pushing on docker hub.
command:docker tag f74a0ab9431 gaspardlcv/devops_lab:app
docker login
docker push gaspardlcv/devops_lab

## 2.6
command:docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi -f $(docker images -a -q)

question:We didn't had the image stored on our workplace. But docker succeded to build an image by getting it from our online repository. 
It says then "Digest: sha256:9bdc72fd9eda4e336ff673c9c10dd89c77d29956f994534cc78e6d25d3c8be83
Status: Downloaded newer image for gaspardlcv/devops_lab:app".
command:docker run gaspardlcv/devops_lab:app

command:docker run -detach gaspardlcv/devops_lab:app

## 2.7
question:"docker ps" show us the list of running containers. We can find back our newly created containers by comparing its id to the one return when we created it at the previous question.
question:The name is "ecstatic_antonelli".
command:docker ps

command:docker run --name new --detach gaspardlcv/devops_lab:app

## 2.8
question:docker exec new cat /etc/os-release
output:"PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/""

## 3.1
command:docker-compose up

## 3.4
command:docker-compose up --detach
command:docker-compose logs
