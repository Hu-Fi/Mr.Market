<script lang="ts">
  import Apps from "$lib/components/home/applications/apps.svelte";
  import Balance from "$lib/components/home/walletBalance/balance.svelte";
  import Tabs from "$lib/components/home/markets/tabs.svelte";
  import Coins from "$lib/components/home/markets/coins.svelte";
  import Carousel from "$lib/components/home/carousel/carousel.svelte";
  import ConnectMixin from "$lib/components/home/oauth/connectMixin.svelte";
  import { mixinConnected } from "$lib/stores/home";
</script>

<div class="mt-0 flex flex-col space-y-2 mb-36">
  {#if $mixinConnected}
    <Balance />
  {:else}
    <ConnectMixin />
  {/if}
  <Apps />
  <Carousel />
  <Tabs/>
  <Coins />
</div>