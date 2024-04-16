This is highly alpha code. Do not use it or you will lose all your money. We'd like to thank Little creatures for being the first company to test Mr. Market and for helping with QA.

![Playwright Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/playwright.yml/badge.svg) 
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/vitest.yml/badge.svg)
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/servertests.yml/badge.svg)
![Lint](https://github.com/Hu-Fi/Mr.Market/actions/workflows/lint.yml/badge.svg)
[![Railway Deployment Status](https://img.shields.io/badge/deployment-passing-brightgreen)](https://mrmarket-production.up.railway.app/)
![Vercel Deployment Status](https://therealsujitk-vercel-badge.vercel.app/?app=mr-market-one) 
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHu-Fi%2FMr.Market&env=PUBLIC_BOT_ID,PUBLIC_HUFI_BACKEND_URL,PUBLIC_HUFI_SOCKET_URL&root-directory=interface"><img src="https://vercel.com/button" alt="Deploy with Vercel" width="72px"></a>
<a href="https://railway.app/template/bveg2P?referralCode=j8dZGz"><img src="https://railway.app/button.svg" alt="Deploy on Railway" width="96px"></a>

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

## Deployment

1. Click <a href="https://railway.app/template/bveg2P?referralCode=j8dZGz"><img src="https://railway.app/button.svg" alt="Deploy on Railway" width="64px"></a> button to deploy server on railway. It's possible that the `Trial Plan` of railway doesn't have enough memory to run the server. We suggest to upgrade.

2. Click <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHu-Fi%2FMr.Market&env=PUBLIC_BOT_ID,PUBLIC_HUFI_BACKEND_URL,PUBLIC_HUFI_SOCKET_URL&root-directory=interface"><img src="https://vercel.com/button" alt="Deploy with Vercel" width="52px"></a> button to deploy interface on vercel, fill the environment variables from railway deployment and mixin keystore. If you don't have a mixin keystore already, go to [Mixin developer dashboard](https://developers.mixin.one/dashboard) to get one.

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

## Contributing

Please read [CONTRIBUTING.md]() for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GNU Affero General Public License - see the [LICENSE.md](../LICENSE) file for details

## Free Data provided by
"Data provided by CoinGecko",
