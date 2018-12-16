# Answers

Lastname: COMAK	
Firstname: MUSTAFA

## 2.2
command:
docker run testapp

## 2.3
question: the port is not opened, the container's ports aren't published. 
command: docker run -p 3000:3000 app

## 2.5
question: For Docker the image has to be tagged accordingly for it to be uploaded correctly to the Docker Hub, so we have to name the tag of the image to match the repository
command: docker login --username=mustufu
		 docker tag app Mustufu/devops_lab:imagetest
		 docker push Mustufu/devops_lab:imagetest

## 2.6
command: docker prune -a

question: We just deleted all local images on our computer, if we make a new container there would be no images to build from. But Docker can pull an image from our repository. We will give him the name with the command
command: docker run Mustufu/devops-lab:imagetest

command: docker run --detach Mustufu/devops-lab:imagetest

## 2.7
question: we will run the comman "sudo docker ps -a", we will get all the containers with ID, Names etc. We will then see if the container was started correctly by finding it's ID and check its status. The status is up.
question: my container's name is evil_curry
command: docker ps -a

command: docker run --name devopslab --detach Mustufu/devops-lab:imagetest
WE COULD ALSO USE : command : docker rename evil_curry devopslab

## 2.8
question: Linux 
output: NAME="Alpine Linux"
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
