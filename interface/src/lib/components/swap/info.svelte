<script lang="ts">
  import { _ } from "svelte-i18n";
  import { BN } from "$lib/helpers/utils";
  import { Input, InputAsset, Output, OutputAsset } from "$lib/stores/swap";

  let toSubFrom = true;
</script>

<div class="flex mx-4 !mt-3 items-center justify-start">
  <button
    class="flex items-center justify-start"
    on:click={() => (toSubFrom = !toSubFrom)}
  >
    {#if toSubFrom}
      <span class="text-xs mx-2">
        1 {$OutputAsset.symbol} = {!$Output || !$Input
          ? "..."
          : BN($Output).div($Input)}
        {$InputAsset.symbol}
      </span>
    {:else}
      <span class="text-xs mx-2">
        1 {$InputAsset.symbol} = {!$Output || !$Input
          ? "..."
          : BN($Input).div($Output)}
        {$OutputAsset.symbol}
      </span>
    {/if}
  </button>
</div>
