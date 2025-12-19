<script>
  import { _ } from "svelte-i18n";
  import CreateProgress from "../exchange/createProgress.svelte";
  export let exchangeName = "";
  export let tradingPair = "";
</script>

<div class="flex flex-col gap-2 mx-6">
  <span class="text-xl font-semibold">
    {$_("enter_deposit_amount")}
  </span>

  <CreateProgress step={3} {exchangeName} {tradingPair} />
</div>
