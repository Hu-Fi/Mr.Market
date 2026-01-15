<script>
  import { _ } from "svelte-i18n";
  import CreateProgress from "../exchange/createProgress.svelte";
  export let exchangeName = "";
</script>

<div class="flex flex-col gap-2 mx-6">
  <span class="text-xl font-semibold text-base-content">
    {$_("select_trading_pair")}
  </span>

  <CreateProgress step={2} {exchangeName} />
</div>
