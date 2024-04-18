<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { CandlePair } from "$lib/stores/market";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";
  import {
    formatDecimals,
    formatUSMoney,
    formatUSNumber,
    formatUsUnit,
  } from "$lib/helpers/utils";

  $: ss = [
    { title: $_("24h_high"), value: $CandlePair.info?.high },
    { title: $_("24h_low"), value: $CandlePair.info?.low },
    {
      title: $_("24h_vol", {
        values: { coin: $CandlePair.symbol.split("/")[0] },
      }),
      value: $CandlePair.info?.volume,
    },
  ];
</script>

<div class="flex p-4 justify-between">
  <!-- Price -->
  <div class="flex flex-col space-y-1">
    <span class={clsx("text-3xl font-bold", UpColorText)}>
      {formatUSNumber($CandlePair.price)}
    </span>

    <div class="flex space-x-2 text-sm">
      <!-- USD Price -->
      <span>
        {formatUSMoney($CandlePair.price)}
      </span>

      <!-- Change -->
      {#if $CandlePair.change}
        <span class={clsx($CandlePair.change > 0 ? UpColorText : DownColorText)}>
          {formatDecimals($CandlePair.change, 2)}%
        </span>
      {/if}
    </div>
  </div>

  <!-- Volume -->
  <div class="flex flex-col items-center justify-center space-y-1">
    {#each ss as s, i}
      {#if s.value}
        <div class="flex justify-between text-xs w-full space-x-2">
          <span class="opacity-60"> {s.title} </span>
          <span>
            {i <= 1 ? formatDecimals(s.value, 1) : formatUsUnit(s.value)}
          </span>
        </div>
      {/if}
    {/each}
  </div>
</div>
