# Use bun image as base image
FROM oven/bun:1.1.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000

CMD bun run migration:run && bun run start:prod
