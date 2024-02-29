<script lang="ts">
  import SingleExchangeStat from "$lib/components/admin/exchanges/singleExchangeStat.svelte";
  const items = [
    { name: "binance", active: 4, failure: 0 },
    { name: "lbank", active: 3, failure: 0 },
    { name: "okx", active: 4, failure: 0 },
    { name: "bitfinex", active: 2, failure: 1 },
    { name: "mexc", active: 2, failure: 0 },
  ];
</script>

<div
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-center gap-4"
>
  {#each items as item}
    <SingleExchangeStat exchange={item} />
  {/each}
</div>
