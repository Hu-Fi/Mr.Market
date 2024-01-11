<script>
  import { goto } from "$app/navigation";
  import { addSearchHistory, getSearchHistory } from "$lib/helpers/searchHistory";
  const list = [
    { symbol: 'BTC', id: 'bitcoin'},
    { symbol: 'ETH', id: 'ethereum'},
    { symbol: 'SOL', id: 'solana'},
    { symbol: 'BOX', id: 'box'},
    { symbol: 'HMT', id: 'human-protocol'},
    { symbol: 'XIN', id: 'mixin'},
  ]
  $: history = getSearchHistory()
  $: activeList = history.length === 0 ? list : history
</script>

<div class="grid grid-cols-3 gap-4 gap-x-6 px-4 mt-4">
  {#each activeList as coin}
    <button class="btn btn-xs h-[1.75rem] rounded no-animation hover:bg-base-200 hover:border-base-200" on:click={() => {
      addSearchHistory(coin);
      goto(`/market/coin/${coin.id}`);
    }}>
      <span> {coin.symbol} </span>
    </button>
  {/each}
</div>