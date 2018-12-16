# Answers

Lastname: MICHEL
Firstname: Maxime

## 2.2
command: "~\devops-lab> docker run app
Example app listening on port 3000!"

## 2.3
question: The call fails because the port 3000 is not exposed. We add an "EXPOSE 3000" line in the Dockerfile and use the -P option to dynamically expose the port at launch.
command: docker run -P app

## 2.4
command: docker run -P -e MYSQL_HOST=localhost -e MYSQL_PORT=3306 -e MYSQL_USER=root -e MYSQL_PASSWORD="" -e MYSQL_DATABASE=zoo app

## 2.5
question: we have to tag the app with the corresponding remote name ("zoo"). We push it afterwards to egglestron/zoo.
command:
docker login
docker tag app zoo
docker push egglestron/zoo

## 2.6
command:

question:
command:

command:

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS                     NAMES
fcf9b525d387        egglestron/zoo      "/bin/sh -c 'node /r…"   40 seconds ago      Up 38 seconds                 3000/tcp                  thirsty_jepsen
45ff8001f8c7        egglestron/zoo      "/bin/sh -c 'node /r…"   49 seconds ago      Created                                                 thirsty_albattani

## 2.7
question:
question:
command:

command:

## 2.8
question:
output:

## 3.1
command:

## 3.4
command:
command:
