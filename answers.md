# Answers

Lastname:HADI
Firstname:Amina

## 2.2
command: DEBUG=myapp:* npm start

## 2.3
question:
command:docker restart hopeful_feistel ## D'abord docker ps -a pour trouver le nom du container

## 2.5
question:
command:docker push aminahadi/node  ## D'abord docker tag node aminahadi/node après avoir fait docker login

## 2.6
command:docker rmi -f $(sudo docker images -a -q)

question:
command:docker update --restart=always 1dcf70cc56b8

command:docker run --detach --name=node --publish 2008:3000

## 2.7
question:
question:d9f8ee2d326b9e6f1987bc5b7f2b24a8d966b833075b91166656878cdfede9fe
command:docker run --detach --name=node --publish 2008:3000

command:sudo docker rename node zoo_app ## docker run --detach --name=zoo_app --publish 2008:3000 node

## 2.8
question:
output:DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=18.04
DISTRIB_CODENAME=bionic
DISTRIB_DESCRIPTION="Ubuntu 18.04.1 LTS"
NAME="Ubuntu"
VERSION="18.04.1 LTS (Bionic Beaver)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 18.04.1 LTS"
VERSION_ID="18.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=bionic
UBUNTU_CODENAME=bionic

## 3.1
command:docker-compose up -d 

## 3.4
command:docker-compose run --restart:always
command:docker-compose logs zoo_app
