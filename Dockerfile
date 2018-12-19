# Specifies the base image we're extending
FROM node:8
MAINTAINER Raphael BEAZIZ < raphael.beaziz [ at ] edu.ece.fr >

RUN npm install express
RUN npm install mysql
 COPY index.js /root/


# Allows port 3000 to be publicly available
EXPOSE 3000

# The command uses nodemon to run the application
CMD ["node","index.js"] 



 