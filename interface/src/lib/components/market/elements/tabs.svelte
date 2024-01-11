<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { activeTab, setActiveTab } from "$lib/stores/market";
  
  let items = [
    { name: $_("coins"), fn: () => {} },
    { name: $_("spot"), fn: () => {} },
    // { name: $_("leverage"), fn: () => {} },
    // { name: $_("perpetual"), fn: () => {} },
    // { name: $_("options"), fn: () => {} },
  ];
</script>

<!-- Tabs -->
<div class="tabs w-full overflow-x-auto no-scrollbar flex border-y-[0.8px] py-1">
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

<style>
</style>
