<script lang="ts">
  import Slogan from "$lib/components/grow/marketMaking/initIntro/slogan.svelte";
  import IntroButtons from "$lib/components/grow/marketMaking/initIntro/introButtons.svelte";
  import BasicStats from "$lib/components/grow/marketMaking/hufi/basicStats.svelte";
  import Loading from "$lib/components/common/loading.svelte";


  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { isFirstTimeMarketMaking } from "$lib/stores/market_making";
  onMount(() => {
    isFirstTimeMarketMaking.set(true)
  });
</script>

{#if $isFirstTimeMarketMaking}
  <div class="flex flex-col flex-grow space-y-0">
    <Slogan />
    <div class="">
      <IntroButtons />
    </div>
  </div>
{:else}
   {#await page.data.active_campaigns}
    <Loading />
   {:then data} 
    <div class="flex flex-col flex-grow space-y-0">
      {JSON.stringify(data)}
      <BasicStats />
    </div>
   {/await}
{/if}