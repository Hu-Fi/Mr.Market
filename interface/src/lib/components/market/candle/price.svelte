<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { formatDecimals, formatUSMoney, formatUSNumber, formatUsUnit } from "$lib/helpers/utils";
  import { CandlePair } from "$lib/stores/market";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";

  const ss = [
    {title: $_("24h_high"), value: 43226.7},
    {title: $_("24h_low"), value: 41610.0},
    {title: $_("24h_vol", {values:{coin:$CandlePair.first}}), value: 13090},
    {title: $_("24h_turnover", {values:{coin:$CandlePair.second}}),value: 55636346233}
  ]
  
</script>

<div class="flex p-4 justify-between">
  <!-- Price -->
  <div class="flex flex-col space-y-1">
    <!-- Price -->
    <span class={clsx("text-3xl font-bold" ,true ? UpColorText : DownColorText)}>
      {formatUSNumber($CandlePair.price)}
    </span>

    <div class="flex space-x-2 text-sm">
      <!-- USD Price -->
      <span> 
        {formatUSMoney($CandlePair.price)} 
      </span>

      <!-- Change -->
      <span class="{clsx(true ? UpColorText : DownColorText)}">
        {$CandlePair.percentage}%
      </span>
    </div>
  </div>

  <!-- Volume -->
  <div class="flex flex-col">
    {#each ss as s,i}
      <div class="flex justify-between text-xs w-full space-x-2">
        <span class="opacity-60"> {s.title} </span>
        <span> {i <= 1 ? formatDecimals(s.value, 1) : formatUsUnit(s.value)} </span>
      </div>
    {/each}
  </div>
</div>

<style>

</style>