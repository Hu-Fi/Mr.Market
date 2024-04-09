<script lang="ts">
  import { _ } from "svelte-i18n";
  import SingleHistory from "$lib/components/grow/arbitrage/details/singleHistory.svelte";

  // TODO: Set type when backend is ready
  export let histories: Array<object>;
</script>

<div class="flex items-center p-6 bg-gray-100">
  <div class="flex flex-col w-full space-y-4">
    <div class="flex flex-col w-full items-start space-y-3">
      {#each histories as h}
        <SingleHistory type={h.type} />
      {/each}
    </div>
  </div>
</div>

<style>
    .bg-gray-100 {
        background-color: #F8FAFC;
    }
</style>