<script lang='ts'>
  import clsx from "clsx";
  import { goto } from "$app/navigation";
  import { darkTheme } from "$lib/stores/theme";
  import { currentCoin } from "$lib/stores/market";
  import emptyToken from "$lib/images/empty-token.svg"
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
	import { type CoingeckoToken } from '$lib/types/coingecko/token';
  import { formatDecimals, formatUSMoney, formatUSMoneyUnit } from "$lib/helpers/utils";
  
  export let token: CoingeckoToken;
</script>

<button class={clsx("flex w-full items-center justfy-between p-4 border-b-[0.1px] first:border-t-[0.1px]", $darkTheme ? "border-slate-800":"border-slate-50")} on:click={()=>{goto('/market/token/'+token.id); currentCoin.set(token)}} >
  <div class="flex flex-1 items-center space-x-3 text-left">
    <!-- Icon -->
    <div class="avatar w-9 h-9 p-0.5">
      <div class="rounded-full">
        <img src={findCoinIconBySymbol(token.symbol.toUpperCase()) || token.image || emptyToken} alt="" class="w-8 h-8" loading="lazy" />
      </div>
    </div>

    <!-- Symbol -->
    <div class="flex flex-col space-y-0.5">
      <span class="text-xs font-extrabold uppercase">
        {token.symbol}
      </span>

      <div class="flex space-x-1.5 items-center">
        {#if token.market_cap_rank}
          <div class={clsx("flex rounded-sm badge badge-xs px-0.5", $darkTheme ? "bg-slate-800" : "bg-slate-100")}>
            <span class="text-xs !text-[10px] opacity-90">
              {token.market_cap_rank}
            </span>
          </div>
        {/if}
        {#if token.market_cap > 0}
          <span class="text-xs !text-[10px] opacity-50">
            {formatUSMoneyUnit(token.market_cap)}
          </span>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex space-x-2">
    <!-- Price -->
    <div class="flex items-center">
      <span class="text-xs font-semibold">
        {formatUSMoney(token.current_price)}
      </span>
    </div>
    <!-- Price change -->
    <div class="w-[4.5rem] flex items-center justify-end">
      <div class={clsx("min-w-14 w-[4rem] h-7 flex justify-center items-center rounded-md px-2", Number(token.price_change_percentage_24h) > 0 ? UpColorBg : DownColorBg)}>
        <span class="text-center text-xs font-extrabold text-base-100">
          {formatDecimals(token.price_change_percentage_24h,2)}%
        </span>
      </div>
    </div>
  </div>
</button>