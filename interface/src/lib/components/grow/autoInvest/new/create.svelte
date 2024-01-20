<script lang="ts">
  import Amount from "./amount.svelte";
  import Period from "./period.svelte";
  import SelectAsset from "./selectAssets.svelte";
  import { createNewAutoInvestAssets, createNewAutoInvestStep } from "$lib/stores/grow";
  import { onDestroy } from "svelte";
  onDestroy( ()=> {createNewAutoInvestStep.set(0); createNewAutoInvestAssets.set([])} )
</script>

<div class="mx-4 mt-4">
  {#if $createNewAutoInvestStep === 0}
    <SelectAsset />
  {:else if $createNewAutoInvestStep === 1}
    <Amount />
  {:else if $createNewAutoInvestStep === 2}
    <Period />
  {/if}
</div>