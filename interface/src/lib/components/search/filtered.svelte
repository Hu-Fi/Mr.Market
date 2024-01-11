<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { marketData, searchValue } from "$lib/stores/market";  
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  
  $: filteredTokens = $marketData ? $marketData.filter((item) => {
    return (
      item.symbol.toUpperCase().match($searchValue.toUpperCase()) ||
      item.name.toUpperCase().match($searchValue.toUpperCase())
    )
  }) : []
  console.log(filteredTokens)
</script>

<div>
  {#each filteredTokens as token}
    <div>
      <SingleToken token={token} />
    </div>
  {/each}
</div>