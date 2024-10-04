**This is highly alpha code. Do not use it or you will lose all your money. We'd like to thank Little creatures for being the first company to test Mr. Market and for helping with QA.**

![Playwright Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/playwright.yml/badge.svg) 
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/vitest.yml/badge.svg)
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/servertests.yml/badge.svg)
![Lint](https://github.com/Hu-Fi/Mr.Market/actions/workflows/lint.yml/badge.svg)
[![Railway Deployment Status](https://img.shields.io/badge/deployment-passing-brightgreen)](https://mrmarket-production.up.railway.app/)
![Vercel Deployment Status](https://therealsujitk-vercel-badge.vercel.app/?app=mr-market-one) 
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHu-Fi%2FMr.Market&env=PUBLIC_BOT_ID,PUBLIC_HUFI_BACKEND_URL,PUBLIC_HUFI_SOCKET_URL&root-directory=interface&build-command=npm%20run%20build&install-command=npm%20install"><img src="https://vercel.com/button" alt="Deploy with Vercel" width="72px"></a>
<a href="https://railway.app/template/hf6uBR?referralCode=j8dZGz"><img src="https://railway.app/button.svg" alt="Deploy on Railway" width="96px"></a>

[Vercel deployment](https://mr-market-one.vercel.app/home) 
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)


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

This guide will walk you through the process of deploying a server on Railway and an interface on Vercel for our application. By the end of these steps, you will have a fully functional server and interface setup.

### Preparations

First, ensure you have the following environment variables ready. These are crucial for the configuration of the server and interface.

#### Server Environment Variables (`/server/.env`)
| Variable                    | Description                           | Source                      |
|-----------------------------|---------------------------------------|-----------------------------|
| `ADMIN_PASSWORD`            | Admin page password                   | User-defined                |
| `JWT_SECRET`                | JWT secret key (32 bit)               | User-defined                |
| `COINGECKO_API_KEY`         | Coingecko API key                     | Coingecko                   |
| `MIXIN_APP_ID`              | Mixin App ID                          | Mixin Developer Dashboard   |
| `MIXIN_SESSION_ID`          | Mixin Session ID                      | Mixin Developer Dashboard   |
| `MIXIN_SERVER_PUBLIC_KEY`   | Mixin Server Public key               | Mixin Developer Dashboard   |
| `MIXIN_SESSION_PRIVATE_KEY` | Mixin Session Private key             | Mixin Developer Dashboard   |
| `MIXIN_SPEND_PRIVATE_KEY`   | Mixin Spend Private key               | Mixin Developer Dashboard   |
| `MIXIN_OAUTH_SECRET`        | Mixin Oauth Secret                    | Mixin Developer Dashboard   |

#### Interface Environment Variables (`/interface/.env`)
| Variable                     | Description                  | Source           |
|------------------------------|------------------------------|------------------|
| `PUBLIC_BOT_ID`              | Mixin App ID                 | Mixin Developer Dashboard |
| `PUBLIC_HUFI_SOCKET_URL`     | Server deployment URL        | Railway Deployment |
| `PUBLIC_HUFI_BACKEND_URL`    | Server deployment URL        | Railway Deployment |

Variables starting with `MIXIN` are obtained from the Mixin bot keystore, accessible on the [Mixin developer dashboard](https://developers.mixin.one/dashboard) by creating a new bot.

### Deployment Steps

1. **Deploy Server on Railway**  
   Click the below button to start deployment on Railway. Fill in the environment variables as prompted. Note that the `Trial Plan` on Railway might not suffice due to memory constraints; consider upgrading if necessary.  
   <a href="https://railway.app/template/hf6uBR?referralCode=j8dZGz"><img src="https://railway.app/button.svg" alt="Deploy on Railway" width="120px"></a>

2. **Deploy Interface on Vercel**  
   Use the following button to deploy the interface on Vercel. Ensure you fill in the environment variables as required.  
   <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHu-Fi%2FMr.Market&env=PUBLIC_BOT_ID,PUBLIC_HUFI_BACKEND_URL,PUBLIC_HUFI_SOCKET_URL&root-directory=interface"><img src="https://vercel.com/button" alt="Deploy with Vercel" width="96px"></a>

### Troubleshooting

If you encounter issues during the deployment, check the following:
- Ensure all environment variables are correctly set.
- Verify that your Railway and Vercel accounts are active and in good standing.
- Consult the Railway and Vercel documentation for detailed troubleshooting steps.

# Built With

* [Svelte](https://svelte.dev/) - Web framework
* [Daisy UI](https://daisyui.com/) - UI framework
* [Nest.js](https://nestjs.com/) - Backend API framework

# License

This project is licensed under the GNU Affero General Public License - see the [LICENSE.md](./LICENSE) file for details

# Free Data provided by
"Data provided by CoinGecko",
