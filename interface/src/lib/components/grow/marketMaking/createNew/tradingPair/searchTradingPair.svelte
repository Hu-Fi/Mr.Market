<script lang="ts">
  import { _ } from "svelte-i18n";
  export let onSearch = () => {};

  const handleClick = () => {
    (document.getElementById("mm_search_trading_pair") as any).showModal();
    onSearch();
  };
</script>

<button
  class="btn btn-sm rounded-full bg-base-100 opacity-70 shadow"
  on:click={handleClick}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-4 h-4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
  <span class="text-xs">
    {$_("search")}
  </span>
</button>
