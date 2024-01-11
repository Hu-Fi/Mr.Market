<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { formatDecimals } from "$lib/helpers/utils";
  import { CandleTooltipData } from "$lib/stores/market";

  const keys = [
    $_("time"),
    $_("open"),
    $_("high"),
    $_("low"),
    $_("close"),
    // $_("amount"),
    // $_("turnover"),
  ];
  const keeys = [
    "time",
    "open",
    "high",
    "low",
    "close",
    // "amount",
    // "turnover",
  ];

  $: values = Object.values($CandleTooltipData);
</script>

<div class="flex flex-col space-y-1 justify-between text-[10px]">
  {#each keys as key, i}
    <div class="flex space-x-3 justify-between w-22">
      <span>
        {key}
      </span>
      <span>
        {key === $_("time")
          ? $CandleTooltipData[keeys[i]]
          : formatDecimals($CandleTooltipData[keeys[i]], 2)}
      </span>
    </div>
  {/each}
</div>

<style>
</style>
