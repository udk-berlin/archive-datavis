# Dockerfile for Next.js
ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000


CMD ["npm", "start"]