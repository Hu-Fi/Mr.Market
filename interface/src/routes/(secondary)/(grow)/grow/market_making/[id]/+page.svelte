<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import Pair from "$lib/components/grow/marketMaking/details/pair.svelte";
  import Infos from "$lib/components/grow/marketMaking/details/infos.svelte";
	import History from '$lib/components/grow/marketMaking/details/history.svelte';
  import Exchange from "$lib/components/grow/marketMaking/details/exchange.svelte";

  const pairBase = $page.data.data.pair.split('/')[0]
  const pairTarget = $page.data.data.pair.split('/')[1].replaceAll('-ERC20', '')
  const mmData = {
    exchange: $_($page.data.data.exchangeName),
    exchangeIcon: findExchangeIconByIdentifier($page.data.data.exchangeName),
    pairBase: pairBase,
    pairTarget: pairTarget,
    balance: {
      tokenSymbol0: pairBase,
      tokenSymbol1: pairTarget,
      startedAmount0: 0.213,
      startedAmount1: 1234.1234,
      nowAmount0: $page.data.data.balanceA,
      nowAmount1: $page.data.data.balanceB,
      apy: undefined,
      profit: undefined,
    },
    createAt: $page.data.data.createdAt,
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

<div class="flex flex-col space-y-10 mb-20">
  <Exchange
    exchange={mmData.exchange}
    exchangeIcon={mmData.exchangeIcon}
  />
  <div class="max-w-24rem shadow-md flex flex-col rounded-xl border border-base-200 relative">
    <Pair
      exchange={mmData.exchange}
      exchangeIcon={mmData.exchangeIcon}
      pairBase={mmData.pairBase}
      pairTarget={mmData.pairTarget}
    />
    <Infos 
      tokenSymbol0={mmData.balance.tokenSymbol0}
      tokenSymbol1={mmData.balance.tokenSymbol1}
      amount0Now={mmData.balance.nowAmount0}
      amount1Now={mmData.balance.nowAmount1}
      apy={mmData.balance.apy}
      profit={mmData.balance.profit}
      createdAt={mmData.createAt}
    />
    <!-- amount0Start={arbData.balance.startedAmount0}
      amount1Start={arbData.balance.startedAmount1} -->
    <!-- <History
      histories={mmData.histories}
    /> -->
  </div>
</div>
