<script lang="ts">
  import { _ } from "svelte-i18n";
  import { currentPairOnly } from "$lib/stores/spot";
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
</div>