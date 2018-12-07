FROM node:lts-alpine
COPY index2.js/root/
RUN nom install express
CMD node /root/index2.js
