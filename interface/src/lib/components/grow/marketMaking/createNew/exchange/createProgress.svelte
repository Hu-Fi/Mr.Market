<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  export let step = 1; // 2, 3
  export let exchangeName = "";
  export let tradingPair = "";
</script>

<div class="flex flex-col space-y-2">
  <div class="flex w-80 gap-2 mt-4">
    <div
      class={clsx(
        "h-1.5 flex-1 rounded-full transition-colors duration-300",
        step >= 1 ? "bg-base-content" : "bg-base-200",
      )}
    ></div>
    <div
      class={clsx(
        "h-1.5 flex-1 rounded-full transition-colors duration-300",
        step >= 2 ? "bg-base-content" : "bg-base-200",
      )}
    ></div>
    <div
      class={clsx(
        "h-1.5 flex-1 rounded-full transition-colors duration-300",
        step >= 3 ? "bg-base-content" : "bg-base-200",
      )}
    ></div>
  </div>
  <div class="grid grid-cols-3 w-80">
    <span
      class={clsx(
        "text-xs text-left font-bold capitalize transition-colors duration-300",
        step === 1 ? "text-base-content" : "text-base-content/30",
      )}
    >
      {step === 1 ? $_("choose_exchange") : exchangeName}
    </span>
    <span
      class={clsx(
        "text-xs text-center font-bold capitalize transition-colors duration-300",
        step === 2 ? "text-base-content" : "text-base-content/30",
      )}
    >
      {step === 3 ? tradingPair : $_("trading_pair")}
    </span>
    <span
      class={clsx(
        "text-xs text-right font-bold capitalize transition-colors duration-300",
        step === 3 ? "text-base-content" : "text-base-content/30",
      )}
    >
      {$_("amount")}
    </span>
  </div>
</div>
