FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install mysql
COPY . .
CMD [ "npm", "start" ]



