<script lang="ts">
  import { _ } from "svelte-i18n";
  import { cancelAllOrderDialog, currentPairOnly } from "$lib/stores/spot";
</script>

<div class="flex px-4 py-3 border-b border-base-200 items-center justify-between">
  <div class="flex items-center space-x-2">
    <input
      type="checkbox"
      bind:checked={$currentPairOnly}
      class="checkbox checkbox-xs rounded-md"
    />
    <span class="text-xs">
      {$_("current_pair_only")}
    </span>
  </div>

  <button
    class="btn btn-xs rounded-2xl no-animation"
    on:click={() => {
      cancelAllOrderDialog.set(true);
    }}
  >
    <span class="text-xs opacity-80">
      {$_("cancel_all")}
    </span>
  </button>
</div>

<style>
</style>
