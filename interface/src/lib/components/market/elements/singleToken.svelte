<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { currentCoin } from "$lib/stores/market";
  import emptyToken from "$lib/images/empty-token.svg"
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
  import { formatDecimals, formatUSMoney, formatUSMoneyUnit } from "$lib/helpers/utils";
    import { darkTheme } from "$lib/stores/theme";

  export let token = {"id": "bitcoin","symbol": "btc","name": "Bitcoin","image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price": 42647,"market_cap": 835106968766,"market_cap_rank": 1,"fully_diluted_valuation": 895363344292,"total_volume": 12072391201,"high_24h": 42782,"low_24h": 42095,"price_change_24h": 153.96,"price_change_percentage_24h": 0.36232,"market_cap_change_24h": 3004861113,"market_cap_change_percentage_24h": 0.36112,"circulating_supply": 19586737,"total_supply": 21000000,"max_supply": 21000000,"ath": 69045,"ath_change_percentage": -38.24065,"ath_date": "2021-11-10T14:24:11.849Z","atl": 67.81,"atl_change_percentage": 62784.86453,"atl_date": "2013-07-06T00:00:00.000Z","roi": null,"last_updated": "2024-01-01T14:46:24.444Z"};
</script>

<button class={clsx("flex w-full items-center justfy-between p-4 border-b-[0.1px] first:border-t-[0.1px]", $darkTheme ? "border-slate-700":"border-slate-50")} on:click={()=>{goto('/market/coin/'+token.id); currentCoin.set(token)}} >
  <div class="flex flex-1 items-center space-x-3 text-left">
    <!-- Icon -->
    <div class="avatar w-8 h-8 p-0.5">
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
          <div class="flex rounded-sm badge badge-xs bg-slate-100 px-0.5">
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