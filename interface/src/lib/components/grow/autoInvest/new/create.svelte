<script lang="ts">
  import Amount from "./amount.svelte";
  import Period from "./period.svelte";
  import SelectAsset from "./selectAssets.svelte";
  import { createAIAssets, createAIStep } from "$lib/stores/grow";
  import { onDestroy } from "svelte";
  onDestroy( ()=> {createAIStep.set(0); createAIAssets.set([])} )
</script>

<div class="mx-4 mt-4 mb-24">
  {#if $createAIStep === 0}
    <SelectAsset />
  {:else if $createAIStep === 1}
    <Amount />
  {:else if $createAIStep === 2}
    <Period />
  {/if}
</div>