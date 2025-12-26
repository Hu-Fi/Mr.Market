<script lang="ts">
  import { _ } from "svelte-i18n";
  import SingleHistory from "$lib/components/grow/marketMaking/details/singleHistory.svelte";

  // TODO: Set type when backend is ready
  export let histories: any[];
</script>

<div class="flex items-center p-6">
  <div class="flex flex-col w-full space-y-4">
    <span class="opacity-60 text-sm">
      {$_("history")}
    </span>

    <div class="flex flex-col w-full items-start space-y-3">
      {#each histories as h}
        <SingleHistory type={h.type} />
      {/each}
    </div>
  </div>
</div>
