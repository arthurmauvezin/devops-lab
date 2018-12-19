LASTNAME : GROBON
FIRSTNAME : BAPTISTE

2.2
command: sudo docker run app

2.3
question: We can't access our service because because the app wasn't lonked to any port. We need to add EXPOSE 3000 in the dockerfile and run the app with a new command listening to this port.
command: sudo docker run -p 3000:3000 project.js

2.5
question: Docker push uses the tag to identify the repository where it is supposed to push the image.
command: sudo docker tag project.js baptistegrobon/devops_lab
docker login
sudo docker push baptistegrobon/devops_lab

2.6
command:
docker system prune -a
docker pull baptistegrobon/devops-lab
docker create baptistegrobon/devops-lab
question: We don't have the image that is stored on our workplace but docker succeded to build the image with our online repository

2.7
question: With "docker ps" we obtain all the containers with their names, id, status and their date of creation
The status of the congtainer is up so we use the command : sudo docker ps -a
The name of the container is "quizzical_kirch"

2.8
question: We toggle in interactive mode with sudo docker run -it baptistegrobon/devops_lab /bin/bash
Then we get

PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"

3.1
command: sudo docker-compose up

3.4
command: sudo docker-compose up -d
sudo docker-compose logs
