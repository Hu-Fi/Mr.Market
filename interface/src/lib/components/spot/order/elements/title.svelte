<script lang="ts">
  import { _ } from "svelte-i18n";
  import { pair } from "$lib/stores/spot";
</script>

<div class="flex justify-between">
  <div class="flex flex-col text-xs opacity-60 text-start">
    <span>
      {$_("price")}
    </span>
    <span>
      ({$pair.symbol.split('/')[0]})
    </span>
  </div>

  <div class="flex flex-col text-xs opacity-60 text-end">
    <span>
      {$_("amount")}
    </span>
    <span>
      ({$pair.symbol.split('/')[1]})
    </span>
  </div>
</div>