<script>
  import { _ } from "svelte-i18n";

  const items = [
    {
      key: "delete_selected",
      name: $_("delete_selected"),
      fn: () => {
        console.log("delete message");
      },
    },
  ];
</script>

<div class="flex space-x-4">
  {#each items as item}
    <button class="btn">
      {item.name}
    </button>
  {/each}
</div>
