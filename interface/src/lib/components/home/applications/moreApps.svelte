<script lang="ts">  
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
	import { HUMAN_PROTOCOL_GROUP_URL } from '$lib/helpers/constants';
  import AppSection from "$lib/components/home/applications/appSection.svelte";

  const tradingApps = [
    {name: $_("swap"), icon: "swap", fn: ()=>{goto('/swap');}},
    {name: $_("spot"), icon: "spot", fn: ()=>{goto('/spot');}},
    // {name: $_("leverage"), icon: "leverage", fn: ()=>{goto('/leverage');}},
    // {name: $_("future"), icon: "future", fn: ()=>{goto('/future');}},
  ]
  const earnApps = [
    {name: $_("market_making"), icon: "market_making", fn: ()=>{goto('/grow/market_making')}},
    // {name: $_("auto_invest"), icon: "auto_invest", fn: ()=>{goto('/grow/auto_invest')}},
  ]
  const marketApps = [
    {name: $_("token"), icon: "token", fn: ()=>{goto('/market')}},
    {name: $_("candle_stick"), icon: "candle_stick", fn: ()=>{goto('/market/candle/okx/BTC-USDT')}},
  ]
  const toolApps = [
    {name: $_("help_center"), icon: "question", fn: ()=>{}},
    {name: $_("community"), icon: "community", fn: ()=>{ window.open(HUMAN_PROTOCOL_GROUP_URL) }},
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