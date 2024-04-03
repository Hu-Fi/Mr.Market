<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { activeCoinTab } from "$lib/stores/home";
  import { CoinsTypeTabs } from "$lib/helpers/constants";
</script>

<!-- Coins -->
<div class="w-full overflow-x-auto no-scrollbar flex">
  {#each CoinsTypeTabs as item, i}
    <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeCoinTab === i && "")} on:click={()=>{activeCoinTab.set(i); item.fn()}}>
      <span class={clsx("font-medium text-xs text-start", $activeCoinTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{$_(item.name)}</span>
    </button>
  {/each}
</div>