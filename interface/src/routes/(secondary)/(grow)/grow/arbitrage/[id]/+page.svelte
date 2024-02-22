<script lang="ts">
  import { _ } from "svelte-i18n";

  import gate from "$lib/images/exchanges/gate.png";
  import binance from "$lib/images/exchanges/binance.png";

  import Exchanges from "$lib/components/grow/arbitrage/details/exchanges.svelte";
  import Pairs from "$lib/components/grow/arbitrage/details/pairs.svelte";
  import Infos from "$lib/components/grow/arbitrage/details/infos.svelte";
  import History from "$lib/components/grow/arbitrage/details/history.svelte";

  // const id = $page.params.data
  const placeholder = {
    exchange0: $_("gate"),
    exchange1: $_("binance"),
    exchangeIcon0: gate,
    exchangeIcon1: binance,
    pair0Base: "BTC",
    pair0Target: "EOS",
    pair1Base: "BTC",
    pair1Target: "EOS",
    balance: {
      tokenSymbol0: "BTC",
      tokenSymbol1: "EOS",
      startedAmount0: 0.213,
      startedAmount1: 1234.1234,
      nowAmount0: 0.232,
      nowAmount1: 1264.21,
      apy: 12.123,
      profit: 231.1234,
    },
    createAt: '2023-01-31T02:22:01Z',
    histories: [
      {type: 'buy'},
      {type: 'sell'},
      {type: 'deposit'},
      {type: 'withdraw'},
      {type: 'delete'},
      {type: 'stop'},
      {type: 'resume'},
    ]
  };
</script>

<div class="flex flex-col space-y-0 mb-20">
  <Exchanges
    exchange0={placeholder.exchange0}
    exchange1={placeholder.exchange1}
    exchange0Icon={placeholder.exchangeIcon0}
    exchange1Icon={placeholder.exchangeIcon1}
  />
  <Pairs
    exchange0={placeholder.exchange0}
    exchange1={placeholder.exchange1}
    pair0ExchangeIcon={placeholder.exchangeIcon0}
    pair1ExchangeIcon={placeholder.exchangeIcon1}
    pair0Base={placeholder.pair0Base}
    pair0Target={placeholder.pair0Target}
    pair1Base={placeholder.pair1Base}
    pair1Target={placeholder.pair1Target}
  />
  <Infos 
    tokenSymbol0={placeholder.balance.tokenSymbol0}
    tokenSymbol1={placeholder.balance.tokenSymbol1}
    amount0Start={placeholder.balance.startedAmount0}
    amount0Now={placeholder.balance.nowAmount0}
    amount1Start={placeholder.balance.startedAmount1}
    amount1Now={placeholder.balance.nowAmount1}
    apy={placeholder.balance.apy}
    profit={placeholder.balance.profit}
    createdAt={placeholder.createAt}
  />
  <History 
    histories={placeholder.histories}
  />
</div>