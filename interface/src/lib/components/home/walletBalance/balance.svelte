<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { darkTheme } from "$lib/stores/theme";
  import { hideBalance } from "$lib/stores/home";
  import { userAssets } from "$lib/stores/wallet";
  import { BN, formatDecimals, formatUSNumber } from "$lib/helpers/utils";
  import HideBalance from "$lib/components/home/walletBalance/hideBalance.svelte";
	import BalanceNumberLoader from '$lib/components/skeleton/home/balanceNumberLoader.svelte';

  let open = false;
  let currency = "USDT"
  let currencyRate = 1.0
  let currencies = [
    { name: "USDT", fn: (name: string)=>{currency=name, currencyRate = 1}},
    { name: "USD", fn: (name: string)=>{currency=name, currencyRate = 1.01}},
    { name: "EUR", fn: (name: string)=>{currency=name, currencyRate = 1.2}},
    { name: "AED", fn: (name: string)=>{currency=name, currencyRate = 0.4}},
    { name: "CNY", fn: (name: string)=>{currency=name, currencyRate = 0.2}},
  ]
  
  $: coinBalance = $userAssets ? formatDecimals($userAssets.totalUSDBalance, 3) : 0
  $: balance = BN(coinBalance).dividedBy(currencyRate).toNumber()
</script>

<div class="flex items-center justify-between p-4 rounded-2xl">
  <div class="flex flex-col justify-center w-full">
    <!-- Title -->
    <div class="flex items-center space-x-1 opacity-60">
      <span class="text-sm font-normal">
        {$_('total_balance')}
      </span>
      <div class="">
        <HideBalance />
      </div>
    </div>
  
    <!-- Amount -->
    <div class="flex items-end space-x-2 mt-1 pb-1 justify-between">
      {#if !$hideBalance}
        <div class="flex items-end space-x-1">
          {#if $userAssets}
            <span class="text-4xl font-medium break-words max-w-[calc(100vw-98px-30px-32px-16px)] balance-font">
              {formatUSNumber(formatDecimals(balance, 2))}
            </span>  
            
            <details class="dropdown dropdown-bottom" bind:open={open}>
              <summary class="flex items-center p-0 btn btn-sm shadow-none bg-base-100 border-none hover:bg-base-100 focus:bg-base-100 focus:border-none no-animation space-x-[-8px]">
                <span class="text-sm font-medium">
                  {currency}
                </span>
                <div>
                  {#if open}
                    <!-- Caret Up Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={"currentColor"}></path></svg>
                  {:else}
                    <!-- Caret Down Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={"currentColor"}></path></svg>
                  {/if}      
                </div>
              </summary>
              <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32">
                {#each currencies as c}
                  <li><button class="text-start text-sm" on:click={()=>{open=false; c.fn(c.name)}}>{c.name}</button></li>
                {/each}
              </ul>
            </details>
          {:else}
            <BalanceNumberLoader />
          {/if}
        </div>
      {:else}
        <span class="text-4xl font-extrabold ">
          {"*****"}
        </span>
      {/if}
    </div>
  </div>
  <!-- Right -->
  <button class={clsx("btn btn-sm rounded-full no-animation", $darkTheme ? "bg-slate-800 hover:bg-slate-800 hover:border-slate-800 focus:bg-slate-800": "bg-slate-100 hover:bg-slate-100 border border-slate-100 focus:border-slate-100")} on:click={()=>goto("/wallet")}>
    <span class="mx-3 text-sm text-base-content">{$_('view')}</span>
  </button>
</div>