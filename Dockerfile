FROM node:8


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY webApi.js /root/

RUN npm install express mysql


CMD node /root/webApi.js


EXPOSE 8080

