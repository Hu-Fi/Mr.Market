This is highly alpha code. Do not use it or you will lose all your money. We'd like to thank Little creatures for being the first company to test Mr. Market and for helping with QA.

![Playwright Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/playwright.yml/badge.svg) 
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/vitest.yml/badge.svg)
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/servertests.yml/badge.svg)
![Lint](https://github.com/Hu-Fi/Mr.Market/actions/workflows/lint.yml/badge.svg)
[![Railway Deployment Status](https://img.shields.io/badge/deployment-passing-brightgreen)](https://mrmarket-production.up.railway.app/)
![Vercel Deployment Status](https://therealsujitk-vercel-badge.vercel.app/?app=mr-market-one) 
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHu-Fi%2FMr.Market&env=PUBLIC_BOT_ID,PUBLIC_HUFI_BACKEND_URL,PUBLIC_HUFI_SOCKET_URL&root-directory=interface"><img src="https://vercel.com/button" alt="Deploy with Vercel" width="72px"></a>
<a href="https://railway.app/template/hf6uBR?referralCode=j8dZGz"><img src="https://railway.app/button.svg" alt="Deploy on Railway" width="96px"></a>

[Vercel deployment](https://mr-market-one.vercel.app/home) 

# What is Mr.Market

Mr Market is a CeFi crypto bot and the reference exchange oracle for Hu Fi. Mr Market has three main functions

- An automated crypto bot that supports a variety of strategies for arbitrage across CeFi exchanges.
- Hu Fi Market Making via the [human protocol](https://github.com/humanprotocol/human-protocol)
- A front end where users can contribute funds to increase the ability to do Hu Fi market making.

# What is Hu Fi

![image](https://github.com/Hu-Fi/Mr.Market/assets/104921061/9be85875-723f-40c6-96e6-57f2d75924f4)

The crypto markets are characterized by their fragmented markets, where each cryptocurrency product on every exchange often requires its own market-making. Some products are quoted in USD, USDC, USDT, or even foreign currencies. In essence, each crypto exchange has an isolated order book for each trading pair. In addition, derivative and future products are also disjointed.  This differs from traditional markets, which have regulated, centralized market-making where the futures markets are well hedged. In the crypto sector, each product must manage its market-making independently in a one-off manner on each exchange it launches on.  Market making is a lucrative industry but it’s currently only available to the largest crypto actors and the average crypto user has no way to participate. Projects create one off agreements between market makers potentially with a subset of the exchanges they trade on. Recently DeFi markets have allowed for some programmatic market making directly from solidity but they represent a tiny fraction of the overall crypto market.

HuFi introduces a decentralized approach to market-making, enabling anyone with tokens and code to programmatically engage in market-making on any centralized exchange using Solidity. The code for market-making can be directly embedded in the crypto product itself, or externally with a sidecar market-making product. Additionally, anyone with exchange keys and the ability to run a bot can now become a market maker safely and transparently. Finally, anyone with excess crypto funds can earn income by providing it to the bot to generate yield on this excess crypto. 

HuFi utilizes the Human Protocol to ensure fair compensation for market makers. By leveraging the same smart contract framework and infrastructure already in use for various applications, including machine learning, market makers can trust that they will receive timely and fair payment. This trust is reinforced by the use of the same Escrow Factories, which have a proven track record of reliably disbursing payments to individuals involved in machine learning labeling tasks for years.

The frontend user interface for Mr. Market on Mixin.

## Getting Started

### Prerequisites

Install dependencies with yarn

```
npm install
```

### Run development server

```
npm run dev
```

If you're using bun:

```
bun dev
```

## Tests

### Install dependencies

```
npx playwright install-deps
npx playwright install msedge
```

### Running tests

Unit testing
```
npm run test:unit
```

E2E testing

```
npm run test:e2e
```

## Built With

* [Svelte](https://svelte.dev/) - Web framework
* [Daisy UI](https://daisyui.com/) - UI framework

---

The backend server for Mr.market.

## Getting Started

### Prerequisites

Install dependencies with yarn

```
yarn
```

### Run development server

```
yarn start
```

## Tests

```
yarn test
```

## Built With

* [Nest.js](https://nestjs.com/) - Backend API framework

---

## Deployment Guide

This guide will walk you through the process of deploying a server on Railway and an interface on Vercel for our application. By the end of these steps, you will have a fully functional server and interface setup.

### Preparations

First, ensure you have the following environment variables ready. These are crucial for the configuration of the server and interface.

#### Server Environment Variables (`/server/.env`)
| Variable                    | Description                           | Source                      |
|-----------------------------|---------------------------------------|-----------------------------|
| `ADMIN_PASSWORD`            | Admin page password                   | User-defined                |
| `JWT_SECRET`                | JWT secret key                        | User-defined                |
| `COINGECKO_API_KEY`         | Coingecko API key                     | Coingecko                   |
| `MIXIN_APP_ID`              | Mixin App ID                          | Mixin Developer Dashboard   |
| `MIXIN_SESSION_ID`          | Mixin Session ID                      | Mixin Developer Dashboard   |
| `MIXIN_SERVER_PUBLIC_KEY`   | Mixin Server Public key               | Mixin Developer Dashboard   |
| `MIXIN_SESSION_PRIVATE_KEY` | Mixin Session Private key             | Mixin Developer Dashboard   |
| `MIXIN_SPEND_PRIVATE_KEY`   | Mixin Spend Private key               | Mixin Developer Dashboard   |

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


## License

This project is licensed under the GNU Affero General Public License - see the [LICENSE.md](../LICENSE) file for details

## Free Data provided by
"Data provided by CoinGecko",
