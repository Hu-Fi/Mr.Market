<script lang="ts">
  import { _ } from "svelte-i18n"
  import Apps from "$lib/components/home/applications/apps.svelte";
  import Balance from "$lib/components/home/walletBalance/balance.svelte";
  import Tabs from "$lib/components/home/markets/tabs.svelte";
  import Coins from "$lib/components/home/markets/coins.svelte";
  import ConnectMixin from "./oauth/connectMixin.svelte";
  import { mixinConnected } from "$lib/stores/home";
</script>

<div class="mt-0 flex flex-col space-y-2 mb-36">
  {#if $mixinConnected}
    <Balance />
  {:else}
    <ConnectMixin />
  {/if}
  <Apps />
  <Tabs/>
  <Coins />
</div>