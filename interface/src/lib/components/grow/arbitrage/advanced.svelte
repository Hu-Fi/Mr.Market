<script>
  import exchange from "$lib/images/exchange.png"
  import AdvancedCoinSelector from "../arbitrage/advancedCoinSelector.svelte";
</script>

<div class="flex flex-col mt-36 space-y-4">
  <div class="flex justify-center items-center space-x-8">
    <AdvancedCoinSelector />
    <div class="w-12 h-12 opacity-80">
      <img src={exchange} alt="-" />
    </div>
    <AdvancedCoinSelector />
  </div>
</div>
