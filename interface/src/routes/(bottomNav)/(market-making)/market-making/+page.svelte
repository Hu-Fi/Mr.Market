<script lang="ts">
  import Slogan from "$lib/components/grow/marketMaking/initIntro/slogan.svelte";
  import IntroButtons from "$lib/components/grow/marketMaking/initIntro/introButtons.svelte";
  import BasicStats from "$lib/components/grow/marketMaking/baseSection/basicHuFiStats.svelte";
  import Loading from "$lib/components/common/loading.svelte";

  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { mixinConnected } from "$lib/stores/home";
  import { isFirstTimeMarketMaking } from "$lib/stores/market_making";
  import Bar from "$lib/components/grow/marketMaking/baseSection/bar.svelte";
  import BaseIntro from "$lib/components/grow/marketMaking/baseSection/baseIntro.svelte";
  onMount(() => {
    isFirstTimeMarketMaking.set(true)
  });
  
  const noMarketMakingCreated = true;
</script>

<!-- If not connected, show start market making, button redirect to connect wallet -->
<!-- If connected and first time user, show start market making, button go to market-making -->
{#if $isFirstTimeMarketMaking}
  <div class="flex flex-col flex-grow space-y-0">
    <Slogan />
    <div class="">
      <IntroButtons />
    </div>
  </div>
{:else}
   {#await page.data.campaign_stats}
   <div class="flex flex-col items-center justify-center flex-grow h-[100vh]">
    <Loading />
   </div>
   {:then data}
    <div class="flex flex-col flex-grow space-y-0 mt-4 mx-4">
      <BasicStats rewardsPool={data.rewards_pool_usd} activeCampaigns={data.n_active_campaigns} />
      
      <Bar />
      {#if noMarketMakingCreated}
        <BaseIntro />
      {:else}
        <slot />
      {/if}
    </div>
   {/await}
{/if}