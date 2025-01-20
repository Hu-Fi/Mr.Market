<script lang="ts">
  import clsx from "clsx";
  import { goto } from "$app/navigation";
  import type { PairsData } from "$lib/types/hufi/exchanges";
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
  import { formatDecimals, formatUSMoney } from "$lib/helpers/utils";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let pair: PairsData;
</script>

<button class="flex items-center justify-between w-full p-4" on:click={() => {
    goto(`/spot/${pair.exchange_id}/${pair.symbol.replace('/', '-')}`);
  }
}>
  <div class="flex space-x-3 items-center">
    <!-- Icon -->
    <img class="w-8 h-8" src={findExchangeIconByIdentifier(pair.exchange_id)} alt={pair.exchange_id} />

    <!-- Title -->
    <div class="flex flex-col text-start">
      <div>
        <span class="text-md font-semibold">{pair.symbol.split('/')[0]}</span><span class="text-xs opacity-50">/{pair.symbol.split('/')[1]}</span>
      </div>
      <span class="text-xs opacity-40 capitalize">
        {pair.exchange_id}
      </span>
    </div>
  </div>


  <!-- Price -->
  <div class="flex items-center space-x-2">
    <div>
      <span class="text-xs font-semibold">
        {formatUSMoney(pair.price)}
      </span>
    </div>

    <!-- Price change -->
    <div class="w-[4.5rem] flex items-center justify-end">
      {#if pair.change}
        <div class={clsx("min-w-14 w-[4rem] h-7 flex justify-center items-center rounded-md px-2", pair.change > 0 ? UpColorBg : DownColorBg)}>
          <span class="text-center text-xs font-extrabold text-base-100">
            {formatDecimals(pair.change,2)}%
          </span>
        </div>
      {:else}
        <div class={clsx("min-w-14 w-[4rem] h-7 flex justify-center items-center rounded-md px-2", 'bg-gray-400')}>
          <span class="text-center text-xs font-extrabold text-base-100">
            0%
          </span>
        </div>
      {/if}
    </div>
  </div>
</button>