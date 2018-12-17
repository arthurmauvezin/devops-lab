# Answers

Lastname: Sabry
Firstname: LALEG

## 2.2
command:docker run app

## 2.3
question: The port is not opened. We have to open it with EXPOSE 3000
command : docker run -it -p 3000:3000 app

## 2.5
question: We have to name the image in order to make it match we match with the
repository. Moreover, we have to login to docker hub.
command:docker tag c2d76d932c62 zidv/devops_lab:app
docker push zidv/devops_lab

## 2.6
command:docker rmi -f $(docker images -a -q)
question: We have first deleted every local images we had on the PC. However, 
since we have pushed our image on our online repository on Docker hub, Docker 
can build an image from it. 
command:docker create zidv/devops_lab

command:docker run --detach zidv/devops_lab

## 2.7
question: With the command "sudo docker ps -a", we can get a list of the 
container with its IDs, names, status, the time since it has been created and 
the port.
question: The name of my container is "distracted_jennings".
command:docker ps -a

command:docker run --name devops-test --detach zidv/devops-lab:app

## 2.8
question:
I have executed "docker exec new cat /etc/os-release"
output:"PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/""

## 3.1
command: docker-compose up

## 3.4
command:docker-compose up -d
command:docker-compose log