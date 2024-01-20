<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { onMount } from "svelte";
  import { BN, formatDecimals } from "$lib/helpers/utils";
  //@ts-ignore
  import { cleave } from "svelte-cleavejs";
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { mixinConnectLoading, mixinConnected } from "$lib/stores/home";
  import { BOT_ID, OAUTH_SCOPE, maskOption } from "$lib/helpers/constants";
  import { pair, price, amount, total, buy, orderType, current } from "$lib/stores/trade";
    import { darkTheme } from "$lib/stores/theme";

  let usdValue = 1
  let slider = 0
  let tooltipOpen = false;
  let balance =  6543.223;

  // Auto hide slider after finger left
  const handleInput = () => { tooltipOpen = true }; const handleChange = () => {tooltipOpen = false;};
  // Auto calculate Amount after total input
  const getAmount = () => {amount.set(formatDecimals(BN($total).dividedBy($price).toNumber(), 8) || "")}
  const getTotal = () => {total.set(formatDecimals(BN($amount).multipliedBy($price).toNumber(), 8) || "")}
  const setBalance = () => {total.set(balance); getAmount()}
  const setSlider = () => {total.set(formatDecimals(BN(balance).multipliedBy(slider).dividedBy(100).toNumber(), 8) || ""); getAmount()}
  
  const auth = async () => {
    mixinConnectLoading.set(true);
    authorize( { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce: true }, { onShowUrl: (url: string) => { window.open(url) }, onError: (error: any) => { console.error(error); return; }, onSuccess: async (token: any) => { await AfterMixinOauth(token); }, }, );
    mixinConnectLoading.set(false);
  };

  // Set total by slider
  $: slider, setSlider()
  // Auto update total after mode change
  $: $orderType, $price, getTotal()
  // Show 0 when estimated price is NaN
  $: est = $price ? BN($price).multipliedBy(usdValue) : 0
  // Set current price automatically when create
  onMount(()=>{price.set($current)})
</script>

<div class="">
  <!-- Price input -->
  <div class={clsx("flex justify-between items-center border px-2 py-1 my-1 rounded-lg border-base-300 focus-within:border-blue-400", $orderType.index === 1 ? $darkTheme ? "bg-slate-800":"bg-slate-50" : "bg-base-100")}>
    {#if $orderType.index === 0}
      <input type="tel" use:cleave={maskOption} bind:value={$price} placeholder={$_("price")} class={clsx("input input-sm text-base bg-base-100 w-full focus:outline-none focus:border-0 px-0")} />  
      <span class="text-xs opacity-60"> {$pair.second} </span>
    {:else if $orderType.index === 1}
      <input disabled placeholder={$_("market_price")} class={clsx("h-[2rem] text-base w-full px-0", $darkTheme ? "bg-slate-800":"bg-slate-50")} />
    {/if}
  </div>

  {#if $orderType.index === 0}
    <!-- Est value -->
    <div class="w-full truncate opacity-60">
      <span class="text-xs"> {$_('value')} {'$'+ est} </span>
    </div>
  {/if}

  {#if $orderType.index === 0}
    <!-- Amount input -->
    <div class="flex justify-between items-center border px-2 py-1 my-1 rounded-lg border-base-300 focus-within:border-blue-400">
      <input type="tel" on:keyup={getTotal} use:cleave={maskOption} bind:value={$amount} placeholder={$_("amount")} class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0" />
      <span class="text-xs opacity-60"> {$pair.first} </span>
    </div>
  {/if}

  <!-- Percentage slider -->
  <div class={clsx("opacity-100 flex flex-col my-2", tooltipOpen && "tooltip tooltip-top tooltip-open")} data-tip={slider+"%"}>
    <input type="range" min="0" max="100" bind:value={slider} on:input={handleInput} on:change={handleChange} class={clsx($buy ? "range-green":"range-red", "range range-xs")}  />
    <div class="w-full flex justify-between text-xs text-[8.75px] opacity-40 ">
      <span>0%</span>
      <span>25%</span>
      <span>50%</span>
      <span>75%</span>
      <span>100%</span>
    </div>
  </div>

  <!-- Total -->
  <div class="flex justify-between items-center border px-2 py-1 my-1 rounded-lg border-base-300 focus-within:border-blue-400">
    <input type="tel" on:keyup={getAmount} use:cleave={maskOption} bind:value={$total} placeholder={$_("total")} class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0" />
    <span class="text-xs opacity-60"> {$pair.second} </span>
  </div>

  <!-- Balance -->
  <div class="flex items-center justify-between mb-1 py-1">
    {#if $mixinConnected}
      <span class="text-xs opacity-60">{$_('balance')}:</span>
      <button class="" on:click={()=>{setBalance()}}><span class="text-xs opacity-90">{balance} {$pair.second}</span></button>
    {:else}
      <button class="flex w-full items-center space-x-1" on:click={()=>auth()}>
        <button><span class="text-xs opacity-90">{$_('connect_wallet')}</span></button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 mt-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
    {/if}
  </div>
</div>

<style>
.range-green::-moz-range-thumb {
  color: theme('colors.green.400');
  border-color: theme('colors.base-100');
  box-shadow: 0 0 0 1.5px grey inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
}
.range-red::-moz-range-thumb{
  color: theme('colors.red.400');
  border-color: theme('colors.base-100');
  box-shadow: 0 0 0 1.5px grey inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
}
input[type=range]{
    -webkit-appearance: none;
}
.range-green::-webkit-slider-thumb {
  color: theme('colors.green.400');
  border-color: theme('colors.base-100');
  box-shadow: 0 0 0 1.5px grey inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
}
.range-red::-webkit-slider-thumb {
  color: theme('colors.red.400');
  border-color: theme('colors.base-100');
  box-shadow: 0 0 0 1.5px grey inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
}

.tooltip::before {
  font-size: 0.75rem !important;
  line-height: 1rem !important;
}
</style>