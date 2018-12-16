# Answers

Lastname: Pederencino

Firstname: Bastien

## 2.2
command:
```
docker build -t api -f Dockerfile .
docker run api
```
## 2.3
question: My calls failed because ports are not enable.

command: `docker run -p 3000:3000` (Here, 3000 is the port to open)

## 2.5
question: `docker push` is supposed to push the image but it uses the tag to identify the repository.

command:
```
docker login
docker tag api bpederencino/devops-lab
docker push bpederencino/devops-lab
```

## 2.6
command:
```
docker system prune -a
docker ps -a
```

question:
`docker pull bpederencino/devops-lab` to create a container,
`docker create bpederencino/devops-lab`
We have to use --net=host for the container to be able to use localhost.

command: `docker run bpederencino/devops-lab`

command: `docker start -d --net=host nostalgic_booth`

## 2.7
question: `sudo docker ps -a` to get all containers, and check if our container is started.

question: the name of the container is nostalgic_booth

command: `docker ps -a`

command: `docker start -d --name rest_api bpederencino/devops-lab`

## 2.8
question: Execute the following command to use interactive mode: `docker run -it bpederencino/devops-lab /bin/bash`. Now, with `cat /etc/*release` I get the following output.

output:
```
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"
```

## 3.1
command: `docker-compose up`

## 3.4
command: `docker-compose up -d`

command: `docker-compose logs`
