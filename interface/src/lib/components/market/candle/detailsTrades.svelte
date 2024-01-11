<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { CandlePair } from "$lib/stores/market";
  import { formatDecimals } from "$lib/helpers/utils";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";

  const recentTrades = [
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
    {time: "23:00:52", side: $_("buy"), price: "42958.3", amount: 0.02},
  ]
</script>

<div class="flex flex-col space-y-4 px-4 mt-3">
  <!-- Explain -->
  <div class="grid grid-cols-4 text-[10px] opacity-60">
    <span class="font-medium opacity-60">{$_("time")}</span>
    <span class="font-medium opacity-60">{$_("side")}</span>
    <span class="font-medium text-end opacity-60">{$_("price_", {values: {coin:$CandlePair.second}})}</span>
    <span class="font-medium text-end opacity-60">{$_("amount_", {values: {coin:$CandlePair.first}})}</span>
  </div>
  
  <!-- Recent trades -->
  <div class="w-full grid grid-cols-4 items-center text-xs gap-3">
    {#each recentTrades as t}
      <span class="text-start opacity-50">
        {t.time}
      </span>
      <span class={clsx("text-start", t.side===$_("buy") ? UpColorText : DownColorText)}>
        {t.side}
      </span>

      <span class="text-end">
        {formatDecimals(t.price, 1)}
      </span>
      <span class="text-end">
        {t.amount}
      </span>
    {/each}
  </div>
</div>

<style>

</style>