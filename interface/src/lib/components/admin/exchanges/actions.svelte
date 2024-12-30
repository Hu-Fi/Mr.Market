<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";

  const items = [
    {
      key: "add",
      name: $_("add_api_key"),
      keey: "add api key",
      fn: () => {
        goto('/manage/exchanges/add')
      },
    },
  ];
</script>

<div
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center items-center gap-4 mt-4"
>
  {#each items as item}
    <div class="stats shadow">
      <div class="stat">
        <button class="stat-value my-1 mr-2 text-lg" on:click={()=>{item.fn()}}>
          {item.name}
        </button>
      </div>
    </div>
  {/each}
</div>
