# Answers

Lastname: CLAVERO
Firstname: Louis

## 2.2
command: sudo docker run testapp

## 2.3
question: ports are not opened
command: sudo docker -i --expose:PortNumber testapp // where PortNumber is the port we want to open.

## 2.5
question:

This is because docker push uses the tag to identify the repository where it is supposed to push the image. 

command:

sudo docker login // and then I provided my login infos
sudo docker tag testing louisclavero/devops_lab // where testing is the name of my image, louisclavero is my docker hub id, and devops_lab is my docker hub repository
sudo docker push louisclavero/devops_lab

## 2.6
command:

sudo docker system prune -a (this is actually more than necessary since it purges every resources)

question:
"sudo docker pull louisclavero/devops_lab"
to create a container, "sudo docker create louisclavero/devops_lab"

We need to use --net=host in order for the container to be able to reach localhost on the laptop since the container has its own network by default. 

command:

sudo docker run louisclavero/devops_lab

sudo docker ps -a yields:
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS               NAMES
5f995d80bc82        louisclavero/devops_lab   "/bin/sh -c 'node ..."   10 minutes ago      Up 2 seconds                            goofy_kowalevski

command:

sudo docker start -d --net=host goofy_kowalesvski

## 2.7
question: we use the command "sudo docker ps -a" to get the list of containers and check that our container is started.

CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS               NAMES
5f995d80bc82        louisclavero/devops_lab   "/bin/sh -c 'node ..."   13 minutes ago      Up 2 minutes                            goofy_kowalevski

question: the name of the container is goofy_kowalevski

command:

sudo docker ps -a

command: 
we can either rerun the image setting a new name by:
sudo docker start -d --name rest_api louisclavero/devops_lab
or rename the already existing goofy_kowalevski container by:
sudo docker rename goofy_kowalevski rest_api

## 2.8
question: We can enter interactive mode by executing the following command: "sudo docker run -it louisclavero/devops_lab /bin/bash". now, using "cat /etc/*release"
output:
root@09a1ef804243:/# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"


## 3.1
command: sudo docker-compose up

## 3.4
command: sudo docker-compose up -d
command: sudo docker-compose logs
