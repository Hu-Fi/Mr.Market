<script>
  import { _ } from "svelte-i18n";

  const items = [
    {
      key: "bm",
      name: $_("broadcast_message"),
      keey: "boardcast message",
      fn: () => {
        console.log("boardcast message");
      },
    },
    {
      key: "pm",
      name: $_("private_message"),
      keey: "private message",
      fn: () => {
        console.log("boardcast message");
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
