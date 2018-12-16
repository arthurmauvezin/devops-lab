# Answers

Lastname: BRISSE
Firstname: Romain

## 2.1
question: build the image
command: sudo docker build -t zoo ABSOLUTE_PATH_TO_DOCKERFILE 

## 2.2
command: sudo docker run zoo

## 2.3
question: We are missing the port numbers used to access the app through docker. We need to "open" the ports, like so:
command: sudo docker run -p 3042:3000 zoo

## 2.4
question: in your node project, change the connection values to database to these : process.env.MYSQL_HOST etc...
command: sudo docker run -p 3042:3000 -e MYSQK_HOST=172.17.0.1 -e MYSQL_PORT=3306 -e MYSQL_DATABASE=zoo -e MYSQL_USER=root -e MYSQL_PASSWORD="" zoo

## 2.5
question: push an image into repo --> https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html WARNING --> use the same name for the image & the repo 
question: link to repo --> https://cloud.docker.com/repository/docker/soultoe/zoo
command: docker push soultoe/zoo:firsttry

## 2.6
command: sudo docker rmi -f IMAGE_ID

question: redownload image from docker hub
command: 
	--> either we get it on the computer: sudo docker pull soultoe/zoo
	--> or we run it using the repo: sudo docker run --rm -p 3042:3000 -e MYSQK_HOST=172.17.0.1 -e MYSQL_PORT=3306 -e MYSQL_DATABASE=z00 -e MYSQL_USER=root -e MYSQL_PASSWORD="" soultoe/zoo

question: rerun in detached mode
command: sudo docker run -d -p 3042:3000 -e MYSQK_HOST=172.17.0.1 -e MYSQL_PORT=3306 -e MYSQL_DATABASE=z00 -e MYSQL_USER=root -e MYSQL_PASSWORD="" soultoe/zoo:firsttry

## 2.7
question: indication that container is started: --> its ID is printed & the command "sudo docker ps" shows it running
question: it's name is "angry_newton" --> df9ead2098b4        soultoe/zoo:firsttry   "/bin/sh -c 'node in…"   2 minutes ago       Up 2 minutes               0.0.0.0:3042->3000/tcp   angry_newton
command: sudo docker ps OR sudo docker container ls --all

command: rename angry_newton zoo

## 2.8
question: what is my distro inside the container? --> command to run: sudo docker run -it IMAGE_NAME bash --> and then in that bash, run "cat /etc/*release"
output: 
root@282a2fdcd644:~# cat /etc/*release
PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: sudo docker-compose start

## 3.4
command: sudo docker-compose -d start
command: sudo docker-compose logs NAME
