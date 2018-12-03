# Lab : Introduction Devops
This lab goal is to introduce DevOps concept (Git, Gitflow, Docker,...) seen in [corresponding course](https://github.com/arthurmauvezin/devops-course). It is adapted to fit ece courses.

## Update of repo
After having forked this repo, if you want to get updates from the last version of the repo parent, execute following commands
```bash
git remote add parent https://github.com/arthurmauvezin/devops-lab.git
git pull
```

## Instructions
This lab rely on your web technologies project. The goal of this lab is to deploy your project with the help of docker and docker-compose.

> This lab assume your web technologies project is finished, or at least that your can call your REST API to get, create, update or delete items in your zoo.

All the answers for questions asked in this lab instructions must be filled in **answers.md** file situated in your own fork of this repo.

This lab must be completed individually.

## 1: Git

### 1.0: Create a Github account
Go to [Github](https://github.com/) and create a personal account if you do not have one already.

### 1.1: Fork course repo
Go to [devops-lab](https://github.com/arthurmauvezin/devops-lab.git) Github project and fork the repo to get your own copy of this repo into your newly created personal space.

To get more help about fork, see the [official documentation](https://guides.github.com/activities/forking/)

### 1.2: Clone your fork
Clone your newly forked project on your computer

### 1.3: Faire un commit 
test commit
After the clone, you should have your copy of the project on your computer. Go into cloned folder and add your firstname and lastname to it.

Commit and push your changes. You should see your change on Github graphical interface.

### 1.4: Create a pull request
From your Github project fork page, create a pull request to propose your change to parent project (lab repo).

To get more help agout pull requests, see [official documentation](https://help.github.com/articles/about-pull-requests/)

### 1.5: Commit your project
Add your express js project to this git repo and commit to save it for the future.

> In order to get your grade, at the end of the lab, commit and push all changes your made to your repo.

## 2: Docker
### 2.0: Documentation
* [Docker doc reference](https://docs.docker.com/reference/)
* [Dockerfile reference documentation](https://docs.docker.com/engine/reference/builder/)
* [Docker Hub](https://hub.docker.com/) containing all public images

### 2.1: Dockerise your application
At the root directory of your project, create a file called **Dockerfile** able to build a node image conaining your express code.

Help:
* Check [Dockerfile reference documentation](https://docs.docker.com/engine/reference/builder/) if needed
* Base your image on node official image [Docker Hub](https://hub.docker.com/)
* Node use librairies to install on host before starting program (cf. `npm <commands>`). To install these librairies, execute following command in Dockerfile.
```bash
npm install <my_dependencies>
```
* **WORKDIR** command might help
* If you want to optimize, use Alpine images

### 2.2: Run your app
Start a docker container from the image you just created in the preceding question. Write the command you use in answers.md file.

Check log output message to validate that your server started correctly.

### 2.3: Access to your service
Try to access to your service (with postman for example). Why is your call fail ?

Restart container beeing careful to open needed port to get access to your service (see docker help). Write the command you use in answers.md file.

### 2.4: Environment variable
Modify your javascript code to read and user the value of following environement variables to connect to MySQL database:
* MYSQL_HOST
* MYSQL_PORT
* MYSQL_DATABASE
* MYSQL_USER
* MYSQL_PASSWORD

Rebuild your image and run it again being careful to pass corresponding variable as arguments (see environement variables in docker run documentation).

Your application should run normally at this point.

### 2.5: Ship your image
In order to share your new image with the world, you will push your image to official public registry called Docker Hub (or Docker Store).

To do that:
* Create yourself an account on [Docker Hub](https://hub.docker.com/)
* Create a new repository attached to your account
* Then, push your image to your newly created repository

Your image cannot be pushed as it is. Why ? Modify the name of your image and push it again on your new repository on Docker Hub. Write the command you use in answers.md file.

### 2.6: Let's Run it
Now that your image is shared with the world, you can pull it from any computer on which Docker is installed.

Delete all your images created from the start of the lab on your computer. Write the command you use in answers.md file.

Start a container again with the name you pushed on Docker hub earlier. What happened before container start ? Write the command you use in answers.md file.

Your container works as intended but if you close your terminal, it will stop. Start your container again in detached mode and call your service to check accessibility. Write the command you use in answers.md file.

### 2.7: Naming 
Your container is normally started. In detached mode, how can you tell that container is started ? What is the name of your container ? Write the command you use in answers.md file.

Restart your container by renaming it with a name corresponding to its function. Write the command you use in answers.md file.

### 2.8: Go inside
Your container running, open an interactive session to obseve files inside container. 

Help:
Executing following command get OS informations:
```bash
cat /etc/*release
```

What is the OS from the container ? Copy command ouput into answers.md

## 3: Docker Compose
In this part, we will user docker-compose to automate deployment of the app we built in part 1 of this lab.

### 3.0: Download docker-compose
Go to [official site](https://docs.docker.com/compose/install/) and install docker-compose for your OS.

> Be careful: Stop all your running container before starting this part

### 3.1: Docker-compose file
At your project root folder, create a file called docker-compose.yml containing following code:
```yaml
version: '3'
services:
  my-service:
    image: my-image
```

Edit this file to user your own image and rename service as you wish. Then, start service with the help of **docker-compose** commands.

> Available documentation on official site

Write the command you use in answers.md file.

### 3.2: Ports
Modify docker-compose.yml file to add port mount on your service

Restart container and test solution.

### 3.3: Environment variables
Modify docker-compose.yml file to add environment variables needed to use your service.

Restart container and test solution.

### 3.4: Detached
Restart services in detached mode. Write the command you use in answers.md file.

Visualise logs from your service. Write the command you use in answers.md file.

### 3.5: Upgrade
At any time, when you started your service in detached mode, you can reload a new version by executing the following line again:
```bash
docker-compose up -d
```

### 3.6: [BONUS] Dockerise MySQL
Use all knowledge you acquirred today to dockerise mysql database using official MySQL database docker image.

After this step, add mysql as another service to your docker-compose.yml file.

