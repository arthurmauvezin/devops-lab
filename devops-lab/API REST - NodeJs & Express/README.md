# Getting Started
First, change **MySQL** settings before to test this API : ./config/mysql.js

You can install depedencies with `npm install`.

Then, with your terminal you can run the node server with: `node index.js`

### Authors
Two students from **ING4 SI Group 1**:
* Bastien PEDERENCINO [bastien.pederencino@edu.ece.fr](mailto:bastien.pederencino@edu.ece.fr)
* Léo FRITZ [leo.fritz@edu.ece.fr](mailto:leo.fritz@edu.ece.fr)

## Notes to ourselves
How we get things done.
* `npm init`
* `npm install express`
* `touch app.js`
* Load our app with **Express**, then listen a port (*aka. 3000*)
* `node app.js`
* Ctrl+C to stop Server
* `sudo npm i -g nodemon` //Deamon to a better workflow, it let you reload server when there are changes
* `npm i morgan` // To see what request is send to server
* `npm i body-parser` // To parse data for POST requests

* `npm install cors` // To control access to Cross-Origin Resource Sharing

* `npm i bcrypt` // To hash, salt and compare passwords

* require : fs, http, https // To force the use of HTTPS

# TODO
Things to increase quality and features of this API. (This part use *franglish*, we are sorry for that, we will fix it later.)
  1. JSON Web Token (JWT)
  2. Passport (passport, passport-jwt)
  3. BCrypt to password
  4. Antispam to login (limite du nombre de tentatives, origines des tentatives)
  5. logs pour l'admin, les bugs et la sécurité
  6. Changer l'id par un UUID
  7. Blindage des entrées
    * Dans l'URL
    * Dans le body
    * Dans les headers
  8. Documenter ! (SWAGGER standard)
  9. Routes à ajouter
    * /login
    * /register
    * /logout
      (validation de l'admin)
  10. Evolutions
    * Containeurisation avec Docker
    * Orchestration avec Kubernetes
    * contrôle du nombre de requête à l'API
    * Méthodes OPTIONS, PATCH et HEAD
