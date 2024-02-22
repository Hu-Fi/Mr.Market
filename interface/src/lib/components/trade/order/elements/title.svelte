<script lang="ts">
  import { _ } from "svelte-i18n";
  import { pair } from "$lib/stores/trade";
</script>

<div class="flex justify-between">
  <div class="flex flex-col text-xs opacity-60 text-start">
    <span>
      {$_("price")}
    </span>
    <span>
      ({$pair.second})
    </span>
  </div>

  <div class="flex flex-col text-xs opacity-60 text-end">
    <span>
      {$_("amount")}
    </span>
    <span>
      ({$pair.first})
    </span>
  </div>
</div>