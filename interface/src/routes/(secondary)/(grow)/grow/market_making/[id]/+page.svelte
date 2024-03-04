<script lang="ts">
  import { _ } from "svelte-i18n";
  import binance from "$lib/images/exchanges/binance.png";
  import Exchange from "$lib/components/grow/marketMaking/details/exchange.svelte";
  import Pair from "$lib/components/grow/marketMaking/details/pair.svelte";
  import Infos from "$lib/components/grow/marketMaking/details/infos.svelte";
	import History from '$lib/components/grow/marketMaking/details/history.svelte';

  const placeholder = {
    exchange: $_("binance"),
    exchangeIcon: binance,
    pairBase: "BTC",
    pairTarget: "EOS",
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
    createAt: "2023-01-31T02:22:01Z",
    histories: [
      { type: 'place_buy' },
      { type: 'place_sell' },
      { type: 'buy_filled' },
      { type: 'sell_filled' },
      { type: 'buy_canceled' },
      { type: 'sell_canceled'},
      { type: "deposit" },
      { type: "withdraw" },
      { type: "delete" },
      { type: "stop" },
      { type: "resume" },
    ],
  };
</script>

<div class="flex flex-col space-y-0 mb-20">
  <Exchange
    exchange={placeholder.exchange}
    exchangeIcon={placeholder.exchangeIcon}
  />
  <Pair
    exchange={placeholder.exchange}
    exchangeIcon={placeholder.exchangeIcon}
    pairBase={placeholder.pairBase}
    pairTarget={placeholder.pairTarget}
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
