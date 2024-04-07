<script lang="ts">
  import { _ } from "svelte-i18n"
  import AppIcon from "./appIcon.svelte";
  import { goto } from "$app/navigation";

  const bt = [
    {name: $_("spot"), icon: "spot", fn: ()=>{goto('/spot');}},
    {name: $_("market"), icon: "token", fn: ()=>{goto('/market');}},
    {name: $_("grow"), icon: "earn", fn: ()=>{goto('/grow')}},
    {name: $_("arbitrage"), icon: "arbitrage", fn: ()=>{goto('/grow/arbitrage')}},
    {name: $_("more"), icon: "more", fn: ()=>{goto('/home/more')}},

    // Enable in v2
    // {name: $_("invite"), icon: "invite", fn: ()=>{goto('/spot');}},
    // {name: $_("loan"), icon: "loan", fn: ()=>{goto('/spot');}},
    // {name: $_("trade.acc"), icon: "trading_account", fn: ()=>{goto('/grow')}},
    // {name: $_("future"), icon: "future", fn: ()=>{goto('/grow/arbitrage')}},
    // {name: $_("leverage"), icon: "leverage", fn: ()=>{goto('/home/more')}},
    // {name: $_("more"), icon: "more", fn: ()=>{goto('/home/more')}},
  ]
</script>

<div class="grid grid-cols-5 gap-4 px-4 py-2 pb-6 border-b border-base-200">
  {#each bt as b}
    <div class="flex flex-col justify-center items-center space-y-1.5">
      <button class="btn btn-sm bg-base-100 hover:bg-base-100 hover:border-base-300 rounded-xl border-base-300 w-10 h-10 text-center shadow-sm no-animation px-2" on:click={()=>b.fn()} data-testid={`home-page-app-${b.icon}`}>
        <AppIcon icon={b.icon} />
      </button>
      <span class="text-[10px] text-center w-12 max-h-4 text-ellipsis text-[calc(12px + 1.5vw)]"> {b.name} </span>
    </div>
  {/each}
</div>