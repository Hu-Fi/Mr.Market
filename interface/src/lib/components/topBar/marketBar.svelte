<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import MixinMenu from "../common/MixinMenu.svelte";

  import { activeTab, setActiveTab } from "$lib/stores/market";
  
  let items = [
    { name: $_("coins"), fn: () => {} },
    { name: $_("spot"), fn: () => {} },
    // { name: $_("leverage"), fn: () => {} },
    // { name: $_("perpetual"), fn: () => {} },
    // { name: $_("options"), fn: () => {} },
  ];
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px] border-b-[0.8px]">
  <div class="tabs w-full overflow-x-auto no-scrollbar flex">
    {#each items as item, i}
      <button
        class={clsx(
          "btn btn-sm btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none px-3 first:pl-4 flex flex-col",
          $activeTab === i && "border-base-content",
        )}
        on:click={() => {
          setActiveTab(i)
          item.fn();
        }}
      >
        <span
          class={clsx(
            "font-bold",
            $activeTab === i ? "opacity-100" : "opacity-60",
          )}>{item.name}</span
        >
      </button>
    {/each}
  </div>

  <div class="backdrop-blur-lg w-4 h-full bg-base-100/30" />
  <div class="flex items-center space-x-4">
    <!-- Search -->
    <button on:click={()=>{goto('/search')}}>
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>      
    </button>

    <MixinMenu />
  </div>
</div>
