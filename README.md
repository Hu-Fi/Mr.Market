**WARNING: This is highly alpha code. Do not use it or you will lose all your money. We'd like to thank Little creatures for being the first company to test Mr. Market and for helping with QA.**

![Playwright Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/playwright.yml/badge.svg)
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/vitest.yml/badge.svg)
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/servertests.yml/badge.svg)
![Lint](https://github.com/Hu-Fi/Mr.Market/actions/workflows/lint.yml/badge.svg)

# Introduction

## What is Mr.Market

Mr Market is a CeFi crypto bot and the reference exchange oracle for Hu Fi. Mr Market has three main functions

- An automated crypto bot that supports a variety of strategies for arbitrage across CeFi exchanges.
- [What is Hu-Fi](https://github.com/hu-fi)
- A front end where users can contribute funds to increase the ability to do Hu Fi market making.

# Development

## Getting Started

### Prerequisites

Install dependencies

```
make install
```

### Run DB server

If you don't have Postgres installed, run it simply with docker.

```
make start-server-db
```

### Run development servers

```
make start-dev
```

## Tests

### Client

#### Install dependencies

```
npx playwright install
```

#### Running tests

Unit testing

```
yarn test:unit
```

E2E testing

```
yarn test:e2e
```

### Server

#### Running tests

Unit testing

```
yarn test
```

## Deployment Guide

### Preparations

First, ensure you have the following environment variables ready. These are crucial for the configuration of the server and interface.

#### Server Environment Variables (`/server/.env`)

| Variable                    | Description                       | Source                    |
| --------------------------- | --------------------------------- | ------------------------- |
| `ADMIN_PASSWORD`            | Admin page password               | User-defined              |
| `JWT_SECRET`                | JWT secret key (32 bit)           | User-defined              |
| `COINGECKO_API_KEY`         | Coingecko API key                 | Coingecko                 |
| `POSTGRES_HOST`             | DB Host Name                      | Postgres Database         |
| `POSTGRES_USER`             | DB User Name                      | Postgres Database         |
| `POSTGRES_PASSWORD`         | DB Password                       | Postgres Database         |
| `POSTGRES_DATABASE`         | DB Name                           | Postgres Database         |
| `POSTGRES_PORT`             | DB Port (Usually 5432)            | Postgres Database         |
| `POSTGRES_SSL`              | DB SSL Connnection (Usually true) | Postgres Database         |
| `MIXIN_APP_ID`              | Mixin App ID                      | Mixin Developer Dashboard |
| `MIXIN_SESSION_ID`          | Mixin Session ID                  | Mixin Developer Dashboard |
| `MIXIN_SERVER_PUBLIC_KEY`   | Mixin Server Public key           | Mixin Developer Dashboard |
| `MIXIN_SESSION_PRIVATE_KEY` | Mixin Session Private key         | Mixin Developer Dashboard |
| `MIXIN_SPEND_PRIVATE_KEY`   | Mixin Spend Private key           | Mixin Developer Dashboard |
| `MIXIN_OAUTH_SECRET`        | Mixin Oauth Secret                | Mixin Developer Dashboard |
| `BINANCE_API_KEY`           | Binance Account API Key           | Binance Account Settings  |
| `BINANCE_SECRET`            | Binance Account API Secret        | Binance Account Settings  |

Refer to [`./server/.env.example`](./server/.env.example) to enable more exchanges for strategies.

#### Interface Environment Variables (`/interface/.env`)

| Variable                  | Description           | Source                    |
| ------------------------- | --------------------- | ------------------------- |
| `PUBLIC_BOT_ID`           | Mixin App ID          | Mixin Developer Dashboard |
| `PUBLIC_HUFI_SOCKET_URL`  | Server deployment URL | Server Hosting Platform   |
| `PUBLIC_HUFI_BACKEND_URL` | Server deployment URL | Server Hosting Platform   |

Variables starting with `MIXIN` are obtained from the Mixin bot keystore, accessible on the [Mixin developer dashboard](https://developers.mixin.one/dashboard) by creating a new bot.

### Deploy on Render

This guide will walk you through the process of deploying a server, and an interface on Render for our application. We highly recommend using Postgres DB instance from Render since this guide is basically using Render as hosting service, but it's totally up to you if you pick another Postgres DB server.
By the end of these steps, you will have a fully functional server and interface setup.

1. **Deploy Server on Render**  
   Login to the [Render](https://dashboard.render.com/), and create a new web service. Connect the github repo, and adjust the environment variables. Use

   - `./server` for Root Directory
   - `yarn install; yarn build;` for Build Command
   - `yarn migration:run` for Pre-Deploy Command (Available in advanced settings)
   - `yarn start:prod` for Start Command

2. **Deploy Interface on Render**  
   Login to the [Render](https://dashboard.render.com), and create a new static site. Connect the github repo, and adjust the environment variables. Use

   - `./interface` for Root Directory
   - `yarn --frozen-lockfile install; yarn build` for Build Command
   - `build` for Publish Directory

   Setup Redirect & Rewrite Rules as follows.
   | Source | Destination | Action |
   | -- | -- |
   | /(.\*) | /app.html | Redirect |

### Deploy with Docker

1. Deploy Server

   If you have docker installed on your server, it's much easier to run the Mr.Market server without much setting up additional DB instance.

   - Make sure you have `.env` file is configured properly.
   - Run `docker compose up` in `server` directory.

2. Deploy Interface

   We do not docker deployment for Mr.Market interface.

### Troubleshooting

If you encounter issues during the deployment, check the following:

- Ensure all environment variables are correctly set.
- Verify that your Render account is active and in good standing.
- Consult the Render documentation for detailed troubleshooting steps.

# Built With

- [Svelte](https://svelte.dev/) - Web framework
- [Daisy UI](https://daisyui.com/) - UI framework
- [Nest.js](https://nestjs.com/) - Backend API framework

# License

This project is licensed under the GNU Affero General Public License - see the [LICENSE.md](./LICENSE) file for details

# Free Data provided by

"Data provided by CoinGecko",
