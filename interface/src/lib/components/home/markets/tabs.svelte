<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { activeCoinTab } from "$lib/stores/home";
  import { CoinsTypeTabs } from "$lib/helpers/constants";

  let items = [
    {name: $_(CoinsTypeTabs[0]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[1]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[2]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[3]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[4]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[5]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[6]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[7]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[8]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[9]), fn: ()=>{}},
    {name: $_(CoinsTypeTabs[10]), fn: ()=>{}},
  ]
</script>

<!-- Coins -->
<div class="w-full overflow-x-auto no-scrollbar flex">
  {#each items as item, i}
    <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeCoinTab === i && "")} on:click={()=>{activeCoinTab.set(i); item.fn()}}>
      <span class={clsx("font-medium text-xs text-start", $activeCoinTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
    </button>
  {/each}
</div>