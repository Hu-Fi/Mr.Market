<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import Exchanges from "$lib/components/grow/arbitrage/details/titlebar.svelte";
  import Pairs from "$lib/components/grow/arbitrage/details/pairs.svelte";
  import Infos from "$lib/components/grow/arbitrage/details/infos.svelte";
  // import History from "$lib/components/grow/arbitrage/details/history.svelte";

  const pairBase = $page.data.data.pair.split('/')[0]
  const pairTarget = $page.data.data.pair.split('/')[1].replaceAll('-ERC20', '')
  const arbData = {
    exchange0: $_($page.data.data.exchangeAName),
    exchange1: $_($page.data.data.exchangeBName),
    exchangeIcon0: findExchangeIconByIdentifier($page.data.data.exchangeAName),
    exchangeIcon1: findExchangeIconByIdentifier($page.data.data.exchangeBName),
    pair0Base: pairBase,
    pair0Target: pairTarget,
    pair1Base: pairBase,
    pair1Target: pairTarget,
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
  };
</script>

<div class="flex flex-col space-y-10 mb-20">
  <Exchanges
    exchange0={arbData.exchange0}
    exchange1={arbData.exchange1}
    exchange0Icon={arbData.exchangeIcon0}
    exchange1Icon={arbData.exchangeIcon1}
  />
  <div class="max-w-24rem shadow-md flex flex-col rounded-xl border border-base-200 relative">
    <Pairs
      exchange0={arbData.exchange0}
      exchange1={arbData.exchange1}
      pair0ExchangeIcon={arbData.exchangeIcon0}
      pair1ExchangeIcon={arbData.exchangeIcon1}
      pair0Base={arbData.pair0Base}
      pair0Target={arbData.pair0Target}
      pair1Base={arbData.pair1Base}
      pair1Target={arbData.pair1Target}
    />
    <Infos
      tokenSymbol0={arbData.balance.tokenSymbol0}
      tokenSymbol1={arbData.balance.tokenSymbol1}
      amount0Now={arbData.balance.nowAmount0}
      amount1Now={arbData.balance.nowAmount1}
      apy={arbData.balance.apy}
      profit={arbData.balance.profit}
      createdAt={arbData.createAt}
    />
    <!-- amount0Start={arbData.balance.startedAmount0}
      amount1Start={arbData.balance.startedAmount1} -->
  </div>
  <!-- <History
    histories={[]}
  /> -->
</div>
<style>
    .max-w-24rem {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        max-width: 24rem;
    }
</style>