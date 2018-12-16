# Answers

Lastname : Cremel
Firstname : Antoine

## 2.2
command : sudo docker run -p 9000:3000 nodedockertutorial

## 2.3
question : We cannot open the servide at this point.
command : We add EXPOSE 3000 to the dockerfile

## 2.5
question: To be pushed, the image needs to have a name following the format : [name_of_dockerhub_account]/[name_of_image]
command: docker push antoinecremel/dockernodetutorial:stable

## 2.6
command:
```
sudo docker rm -f $(sudo docker ps -a -q)
sudo docker rmi -f $(sudo docker images -a -q)
```

question: Before starting a new container, we need to pull the image from dockerhub.
command: `sudo docker run -it -p 9000:3000 antoinecremel/dockernodetutorial`

command: sudo docker run -d -p 9000:3000 antoinecremel/dockernodetutorial:stable

## 2.7
question: My first instinct was to use `systemctl list-units`, which allows me to see all the daemons running on my system, but another way is to simply use `sudo docker container ls`, which lists the conatiners with their statuses and their uptimes.
question: My container is called ```var-lib-docker-containers-68045e23a808afe734109fb14d9c7a5a4dee60285dc3721903ff32e2026ca056-mounts-shm.mount``` un systemctl, and `elegant_haslett` with docker container ls.
command: `docker container ls`

command: `docker container rename elegant_haslett docker_tutorial`

## 2.8
question: The container's OS is Debian GNU/Linux
output:
```
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

## 3.1
command:

## 3.4
command:
command:
