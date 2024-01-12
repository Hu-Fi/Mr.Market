<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { marketQueryFn } from "$lib/helpers/hufi/coin";
  import { marketData, searchValue } from "$lib/stores/market";
  import Popular from "$lib/components/search/popular.svelte";
  import Filtered from "$lib/components/search/filtered.svelte";

  // In case access directly, no cache hit
  if (!$marketData) { marketQueryFn().then(x => marketData.set(x)).catch(x => goto('/home')) }
</script>

<div>
  {#if $searchValue.length === 0}
    <Popular/>
  {:else}
    <Filtered />
  {/if}
</div>