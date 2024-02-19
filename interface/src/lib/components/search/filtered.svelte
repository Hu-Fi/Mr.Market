<script lang="ts">
  import { marketData, searchValue } from "$lib/stores/market";  
  import { addSearchHistory } from "$lib/helpers/searchHistory";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  
  $: filteredTokens = $marketData ? $marketData.filter((item) => {
    return (
      item.symbol.toUpperCase().match($searchValue.toUpperCase()) ||
      item.name.toUpperCase().match($searchValue.toUpperCase())
    )
  }) : []
</script>

<div>
  {#each filteredTokens as token}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={()=> addSearchHistory({symbol: token.symbol.toUpperCase(), id: token.id})}>
      <SingleToken token={token} />
    </div>
  {/each}
</div>