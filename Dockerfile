# Debian 13(trixie)がベース
FROM node:26.12.0-trixie-slim

WORKDIR /home/node

ENV NODE_ENV=development

COPY package*.json .
RUN npm i

COPY . .

EXPOSE 3000 5173
