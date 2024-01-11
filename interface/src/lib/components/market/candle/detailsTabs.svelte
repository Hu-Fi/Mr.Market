<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { CandleDetailTab } from "$lib/stores/market";

  const items = [
    {title: $_("order_book"), fn: ()=>{}},
    // {title: $_("depth"), fn: ()=>{}},
    // {title: $_("last_trades"), fn: ()=>{}},
  ]
</script>

<div class="flex px-4 py-3 border-b justify-between">
  <div class="flex space-x-5 font-medium">
    {#each items as item, i}
      <button class={clsx("flex items-center", $CandleDetailTab != i && "opacity-60")} on:click={()=>{CandleDetailTab.set(i);}}>
        <span class="text-sm">{item.title}</span>
      </button>
    {/each}
  </div>
</div>