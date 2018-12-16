FROM node:8
COPY index.js ./
RUN npm install express mysql

EXPOSE 3000
CMD [ "node", "index.js" ]