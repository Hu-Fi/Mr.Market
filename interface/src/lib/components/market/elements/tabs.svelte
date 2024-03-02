<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  const MARKET_BAR_ITEMS = [
    {
      name: $_("token"),
      key: "/market/token",
      fn: () => {
        goto("/market/token");
      },
    },
    {
      name: $_("spot"),
      key: "/market/spot",
      fn: () => {
        goto("/market/spot");
      },
    },
  ];
  $: active = $page.url.pathname.includes(MARKET_BAR_ITEMS[0].key)
    ? 0
    : $page.url.pathname.includes(MARKET_BAR_ITEMS[1].key)
      ? 1
      : 0;
</script>

<div class="tabs w-full overflow-x-auto no-scrollbar flex">
  {#each MARKET_BAR_ITEMS as item, i}
    <button
      class={clsx(
        "btn btn-sm btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none px-3 first:pl-4 flex flex-col",
        active === i && "border-base-content",
      )}
      on:click={() => {
        item.fn();
      }}
    >
      <span
        class={clsx("font-bold", active === i ? "opacity-100" : "opacity-60")}
        >{item.name}</span
      >
    </button>
  {/each}
</div>