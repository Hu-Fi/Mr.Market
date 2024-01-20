<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { createAIName } from "$lib/stores/grow";
</script>

<div class="flex flex-col space-y-2 mx-2">
  <span class="text-sm">
    {$_('name')} 
  </span>

  <input class="input input-bordered focus:outline-none" bind:value={$createAIName} />
</div>