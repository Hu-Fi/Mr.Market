<script lang="ts">
  import { formatDecimals } from "$lib/helpers/utils";
  import { currencySymbol, userAssets } from "$lib/stores/wallet";
</script>

<div class="flex flex-col">
  <!-- Dollar value title -->
  <div class="relative flex justify-center my-8 mb-3 space-x-2 mx-auto">
    <div class="absolute left-[-6px]">
      <span class="text-base balance-font opacity-30">
        {$currencySymbol}
      </span>
    </div>
    {#if $userAssets.totalUSDBalance}
      <span class="text-4xl font-medium balance-font">
        {
          $userAssets.totalUSDBalance <= 1 ? formatDecimals($userAssets.totalUSDBalance, 4) : formatDecimals($userAssets.totalUSDBalance, 2)
        }
      </span>
    {:else}
      <span class="text-4xl font-medium balance-font">
        0
      </span>
    {/if}
  </div>

  <!-- BTC Value -->
  <div class="flex justify-center items-center space-x-2">
    {#if $userAssets.totalBTCBalance}
      <span class="balance-font">
        {formatDecimals($userAssets.totalBTCBalance, 8)}
      </span>
    {:else}
      <span class="balance-font">
        0
      </span>
    {/if}
    <span class="text-xs opacity-50">
      BTC 
    </span>
  </div>
</div>