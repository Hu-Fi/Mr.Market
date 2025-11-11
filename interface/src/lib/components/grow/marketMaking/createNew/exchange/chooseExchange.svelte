<script>
  import { _ } from "svelte-i18n";
</script>

<div class="flex flex-col gap-2 mx-6">
  <span class="text-2xl font-semibold">
    {$_("launch_market_making")}
  </span>

  <span class="font-light text-sm opacity-60">
    {$_("which_exchange_to_market_make_on")}
  </span>
</div>