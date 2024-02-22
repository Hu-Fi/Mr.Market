<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let pair = {"base": "ETH","target": "USDT","market": {"name": "Binance","identifier": "binance","has_trading_incentive": false},"last": 2237.81,"volume": 812295.4703,"converted_last": {"btc": 0.05184604,"eth": 0.99926491,"usd": 2239.99},"converted_volume": {"btc": 42136,"eth": 812117,"usd": 1820473077},"trust_score": "green","bid_ask_spread_percentage": 0.010447,"timestamp": "2024-01-04T05:16:59+00:00","last_traded_at": "2024-01-04T05:16:59+00:00","last_fetch_at": "2024-01-04T05:16:59+00:00","is_anomaly": false,"is_stale": false,"trade_url": "https://www.binance.com/en/trade/ETH_USDT?ref=37754157","token_info_url": null,"coin_id": "ethereum","target_coin_id": "tether"}
</script>

<button class="flex items-center justify-between first:mt-4" on:click={()=>{console.log(`goto ${pair.market.identifier} ${pair.base}/${pair.target}`)}}>
  <div class="flex space-x-3 items-center">
    <!-- Icon -->
    <img class="w-8 h-8" src={findExchangeIconByIdentifier(pair.market.identifier)} alt={pair.market.name} />

    <!-- Title -->
    <div class="flex flex-col text-start">
      <div>
        <span class="text-md font-semibold">{pair.base}</span><span class="text-xs opacity-50">/{pair.target}</span>
      </div>
      <span class="text-xs opacity-40">
        {pair.market.name}
      </span>
    </div>
  </div>

  <!-- Price -->
  <div class="flex items-center">
    <span class="text-sm">
      {pair.last}
      {pair.target}
    </span>
  </div>
</button>

<style>
</style>
