<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import Pair from "$lib/components/grow/simplyGrow/details/pair.svelte";
  import Infos from "$lib/components/grow/simplyGrow/details/infos.svelte";
  // import History from "$lib/components/grow/simplyGrow/details/history.svelte";

  const pairBase = $page.data.data.pair.split('/')[0]
  const pairTarget = $page.data.data.pair.split('/')[1].replaceAll('-ERC20', '')
  const sgData = {
    exchange: $_($page.data.data.exchangeName),
    exchangeIcon: findExchangeIconByIdentifier($page.data.data.exchangeName),
    pairBase: pairBase,
    pairTarget: pairTarget,
    balance: {
      tokenSymbol0: pairBase,
      tokenSymbol1: pairTarget,
      nowAmount0: $page.data.data.balanceA,
      nowAmount1: $page.data.data.balanceB,
      apy: undefined,
      profit: undefined,
    },
    createAt: $page.data.data.createdAt,
  };
</script>

<div class="flex flex-col space-y-10 mb-20">
  <div class="max-w-24rem shadow-md flex flex-col rounded-xl border border-base-200 relative">
    <Pair
      exchange={sgData.exchange}
      exchangeIcon={sgData.exchangeIcon}
      pairBase={sgData.pairBase}
      pairTarget={sgData.pairTarget}
    />
    <Infos
      tokenSymbol0={sgData.balance.tokenSymbol0}
      tokenSymbol1={sgData.balance.tokenSymbol1}
      amount0Now={sgData.balance.nowAmount0}
      amount1Now={sgData.balance.nowAmount1}
      apy={sgData.balance.apy}
      profit={sgData.balance.profit}
      createdAt={sgData.createAt}
    />
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