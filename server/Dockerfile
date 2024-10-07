# Use node image as base image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000

CMD yarn migration:run && yarn start:prod
