<script lang="ts">
  import { _ } from "svelte-i18n"
  import { searchValue } from "$lib/stores/market";
  import Popular from "$lib/components/search/popular.svelte";
  import Filtered from "$lib/components/search/filtered.svelte";
</script>

<div>
  {#if $searchValue.length === 0}
    <Popular/>
  {:else}
    <Filtered />
  {/if}
</div>