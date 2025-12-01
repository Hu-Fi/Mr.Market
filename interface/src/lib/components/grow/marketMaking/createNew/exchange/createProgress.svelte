<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  export let step = 1; // 2, 3
  export let exchangeName = "";
  export let tradingPair = "";
</script>

<div class="flex flex-col space-y-2">
  <progress
    class="progress w-80 mt-4 h-1.5 opacity-60"
    value={step === 1 ? "20" : step === 2 ? "55" : "98"}
    max="100"
  ></progress>
  <div class="grid grid-cols-3 w-80">
    <span class={clsx("text-xs text-left capitalize opacity-60")}>
      {step === 1 ? $_("choose_exchange") : exchangeName}
    </span>
    <span class={clsx("text-xs text-center ml-4 opacity-60")}>
      {step === 3 ? tradingPair : $_("trading_pair")}
    </span>
    <span class="text-xs text-right opacity-60">
      {$_("amount")}
    </span>
  </div>
</div>
