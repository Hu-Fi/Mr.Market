<script lang="ts">
  import { _ } from "svelte-i18n";
  import { pairBaseSymbol, pairTargetSymbol } from "$lib/stores/spot";
</script>

<div class="flex justify-between">
  <div class="flex flex-col text-xs opacity-60 text-start">
    <span>
      {$_("price")}
    </span>
    <span>
      {$pairBaseSymbol}
    </span>
  </div>

  <div class="flex flex-col text-xs opacity-60 text-end">
    <span>
      {$_("amount")}
    </span>
    <span>
      {$pairTargetSymbol}
    </span>
  </div>
</div>