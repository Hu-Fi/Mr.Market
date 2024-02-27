[Vercel production location](https://mr-market-one.vercel.app/home)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHu-Fi%2FMr.Market)
![Vercel Deployment Status](https://therealsujitk-vercel-badge.vercel.app/?app=mr-market-one)
![Playwright Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/playwright.yml/badge.svg)
![Unit Tests](https://github.com/Hu-Fi/Mr.Market/actions/workflows/vitest.yml/badge.svg)

# What is Mr.Market

Mr Market is an CeFi crypto bot and the reference exchange oracle for Hu Fi. Mr Market has three main functions

- An automated crypto bot which supports a variety of strategies for arbitrage across cefi exchanges.
- Hu Fi Market Making via the [human protocol](https://github.com/humanprotocol/human-protocol)
- A front end where users can contribute funds to increase the ability to do Hu Fi market making.

# What is Hu Fi

![image](https://github.com/Hu-Fi/Mr.Market/assets/806363/c7eb68bf-1bce-43b6-88d1-1acea610f505)
The crypto markets are characterized by their fragmented markets, where each cryptocurrency product on every exchange often requires its own market making. Some products are quoted in USD, USDC, USDT or even foreign currencies. In essence, each crypto exchange has an isolated order book for each trading pair. In addition derivative and future products are also disjointed.  This differs from traditional markets, which have regulated, centralized market making where the futures markets are well hedged. In the crypto sector, each product must manage its market making independently in a one off manner on each exchange it launches on.  Market making is a lucrative industry but it’s currently only available to the largest crypto actors and the average crypto user has no way to participate. Projects create one off agreements between market makers potentially with a subset of the exchanges they trade on. Recently DeFi markets have allowed for some programmatic market making directly from solidity but they represent a tiny fraction of the overall crypto market.

HuFi introduces a decentralized approach to market making, enabling anyone with tokens and code to programmatically engage in market making on any centralized exchange using Solidity. The code for market making can be directly embedded in the crypto product itself, or externally with a sidecar market making product. Additionally, anyone with exchange keys and the ability to run a bot can now become a market maker in a safe and transparent way. Finally, anyone with excess crypto funds can earn income by providing it to the bot to generate yield on this excess crypto. 

HuFi utilizes the Human Protocol to ensure fair compensation for market makers. By leveraging the same smart contract framework and infrastructure already in use for various applications, including machine learning, market makers can trust that they will receive timely and fair payment. This trust is reinforced by the use of the same Escrow Factories, which have a proven track record of reliably disbursing payments to individuals involved in machine learning labeling tasks for years.

The frontend user interface for Mr.market on Mixin.

## Getting Started

### Prerequisites

Install dependencies with npm

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

# License

This project is licensed under the GNU Affero General Public License - see the [LICENSE.md](LICENSE) file for details
