## Mr.Market
### Refactor of Postgres
1.✅ Replace postgres with sqlite

### Validation of create market making process
1. user can open invoice payment page in confirm payment step
2. invoice payment can be handled correctly by backend
3. backend can withdraw to exchange (should link exchange api key only from db)
4. after withdrawal to exchange, the deposit status can be tracked by backend, update in real time
5. after arrival of deposit to exchange, then join campaign should be triggered automatically
6. after join campaign, or no campain to join, the market making handler can start mm right away
7. user call stop endpoint or initialize withdrawal, can be handled correctly by backend on time

### Create market making UI
1. when select trading pair, there should be an small icon that represents the chain of the asset

### Admin add trading pairs
1. Add a special add trading pair dialog that only require users to enter symbol, and it will fetch all available related trading pairs from ccxt, allowing user to add trading pair with one-click
2. Add a setup guide for initialization that is step by step, allowing admin to have basic understanding of how setting works, and makes it easier to set up all the things

## Hufi Campaigns
1. Mr.Market users can join hufi campaigns under /market-making/hufi
2. Mr.Market users can create campaigns under /market-making/hufi

## Hufi education illustrations
1. Hufi education illustrations under /market-making/hufi/learn-more and Mr.market illustrations under /market-making/learn-more
