<script lang="ts">
  import Slogan from "$lib/components/grow/marketMaking/initIntro/slogan.svelte";
  import IntroButtons from "$lib/components/grow/marketMaking/initIntro/introButtons.svelte";
  import BasicStats from "$lib/components/grow/marketMaking/baseSection/basicHuFiStats.svelte";
  import Loading from "$lib/components/common/loading.svelte";

  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { mixinConnected } from "$lib/stores/home";
  import { isFirstTimeMarketMaking } from "$lib/stores/market_making";
  import Bar from "$lib/components/grow/marketMaking/baseSection/bar.svelte";
  import BaseIntro from "$lib/components/grow/marketMaking/baseSection/baseIntro.svelte";
  const MARKET_MAKING_INTRO_KEY = "market-making-intro-seen";

  if (browser) {
    const hasSeenIntro = localStorage.getItem(MARKET_MAKING_INTRO_KEY) === "true";
    isFirstTimeMarketMaking.set(!hasSeenIntro);

    if (!hasSeenIntro) {
      localStorage.setItem(MARKET_MAKING_INTRO_KEY, "true");
    }
  }

  const noMarketMakingCreated = true;
</script>

<!-- If not connected, show start market making, button redirect to connect wallet -->
<!-- If connected and first time user, show start market making, button go to market-making -->
{#if $isFirstTimeMarketMaking}
  <div class="flex flex-col grow space-y-0">
    <Slogan />
    <div class="">
      <IntroButtons />
    </div>
  </div>
{:else}
   {#await page.data.campaign_stats}
   <div class="flex flex-col items-center justify-center grow h-screen">
    <Loading />
   </div>
   {:then data}
    <div class="flex flex-col grow space-y-0 mt-4 mx-4">
      <BasicStats rewardsPool={data.rewards_pool_usd} activeCampaigns={data.n_active_campaigns} />
      
      <Bar />
      {#if noMarketMakingCreated}
        <BaseIntro />
      {:else}
        <!-- Show created market making + create new btn -->
        <slot />
      {/if}
    </div>
   {/await}
{/if}