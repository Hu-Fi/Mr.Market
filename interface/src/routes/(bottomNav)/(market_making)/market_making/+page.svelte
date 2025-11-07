<script lang="ts">
  import Slogan from "$lib/components/grow/marketMaking/initIntro/slogan.svelte";
  import IntroButtons from "$lib/components/grow/marketMaking/initIntro/introButtons.svelte";

  import { onMount } from "svelte";
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
  <div class="flex flex-col flex-grow space-y-0">
    
  </div>
{/if}