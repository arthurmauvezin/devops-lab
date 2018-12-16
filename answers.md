# Answers

Lastname:Clouet
Firstname:Valentin

## 2.2
command: docker run app

## 2.3
question: Il n'est pas capable d'écouter le port car celui-ci est fermé
command: docker run -p 3000:3000 app

## 2.5
question: Pour push le fichier, il faut qu'il ait le nom du dossier, c'est pourquoi la demande de push n'est pas accepté (vu que le app semblait être déjà le nom d'un dossier auquel on ne pouvait pas accéder docker.io/library/app)
command: docker login (après on rentre son username et son mot de passe)
docker tag app valcc/test
docker push valcc/test

## 2.6
command:docker image prune -a

question: Dans le  cas où on tente de faire un create directement on a un pull qui se fait automatiquement ensuite on peut utiliser create
command: docker create valcc/test

command: docker run -d -p 3000:3000 valcc/test

## 2.7
question:En utilisant ps on peut voir les conteneurs, leurs états,leurs noms:
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                     PORTS          NAMES
47893fb91471        valcc/test          "/bin/sh -c 'node /r…"   8 minutes ago       Exited (1) 8 minutes ago          vigorous_proskuriakova
4866dd25ba75        valcc/test          "/bin/sh -c 'node /r…"   24 minutes ago      Created                            silly_payne
6140df1fb018        valcc/test          "/bin/sh -c 'node /r…"   29 minutes ago      Created                            gracious_aryabhata
question: Le conteneur le plus récent s'appelle vigorous_proskuriakova
command: docker ps -a

command: docker rename vigorous_proskuriakova testDocker

## 2.8
question:L'OS est l'Alpine Linux 3.8.1
output:
3.8.1
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.8.1
PRETTY_NAME="Alpine Linux v3.8"
HOME_URL="http://alpinelinux.org"
BUG_REPORT_URL="http://bugs.alpinelinux.org"

## 3.1
command:

## 3.4
command:
command:
