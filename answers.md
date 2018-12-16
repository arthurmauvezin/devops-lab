LASTNAME : GROBON
FIRSTNAME : BAPTISTE

2.2
command: sudo docker run app

2.3
question: We can't access our service because ports are not opened
command: sudo docker run -p 3000:3000 project.js

2.5
question: Docker push uses the tag to identify the repository where it is supposed to push the image.
command: sudo docker tag project.js baptistegrobon/devops_lab
sudo docker push baptistegrobon/devops_lab

2.6
command:
docker system prune -a
docker pull baptistegrobon/devops-lab
docker create baptistegrobon/devops-lab

2.7
question: We obtain all the containers with their names, id, status and their date of creation
The status of the congtainer is up so we use the command : sudo docker ps -a
The name of the container is "quizzical_kirch"

2.8
question: We toggle in interactive mode with sudo docker run -it baptistegrobon/devops_lab /bin/bash
Then we get

PRETTY_NAME="Debian GNU/Linux 9"
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
