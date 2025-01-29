# Ubuntu Node.js
FROM node:22.13.1

WORKDIR /home/node

ENV NODE_ENV=development

COPY package*.json .
RUN npm i

COPY . .

EXPOSE 3000 5173
