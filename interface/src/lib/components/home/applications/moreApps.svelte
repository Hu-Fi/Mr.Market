<script lang="ts">  
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { bottomMode } from "$lib/stores/trade";
  import AppSection from "$lib/components/home/applications/appSection.svelte";

  const tradingApps = [
    {name: $_("swap"), icon: "swap", fn: ()=>{goto('/trade'); bottomMode.set(0)}},
    {name: $_("spot"), icon: "spot", fn: ()=>{goto('/trade'); bottomMode.set(1)}},
    // {name: $_("leverage"), icon: "leverage", fn: ()=>{goto('/trade'); bottomMode.set(2)}},
    // {name: $_("future"), icon: "future", fn: ()=>{goto('/trade'); bottomMode.set(3)}},
  ]
  const earnApps = [
    {name: $_("earn"), icon: "earn", fn: ()=>{goto('/grow')}},
    {name: $_("arbitrage"), icon: "arbitrage", fn: ()=>{goto('/grow/arbitrage')}},
    {name: $_("market_making"), icon: "market_making", fn: ()=>{goto('/grow/market_making')}},
    // {name: $_("auto_invest"), icon: "auto_invest", fn: ()=>{goto('/grow/auto_invest')}},
  ]
  const marketApps = [
    {name: $_("coins"), icon: "coins", fn: ()=>{goto('/market')}},
    {name: $_("candle_stick"), icon: "candle_stick", fn: ()=>{goto('/market/candle/BTC-USDT')}},
  ]
  const toolApps = [
    {name: $_("help_center"), icon: "question", fn: ()=>{}},
  ]
</script>

<div class="flex flex-col space-y-10 mt-4">
  <!-- Trade -->
  <AppSection title={$_("trade")} apps={tradingApps} />

  <!-- Earn -->
  <AppSection title={$_("earn")} apps={earnApps} />

  <!-- Market -->
  <AppSection title={$_("market")} apps={marketApps} />

  <!-- Utils -->
  <AppSection title={$_("tools")} apps={toolApps} />
</div>