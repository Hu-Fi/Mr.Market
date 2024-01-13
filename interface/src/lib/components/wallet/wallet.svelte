<script lang="ts">
  import { _ } from "svelte-i18n"
  import { userAssets } from "$lib/stores/wallet";
  import { mixinConnected } from "$lib/stores/home";
  import ConnectWallet from "./connect/connectWallet.svelte";
  import Loading from "$lib/components/common/loading.svelte"
  import Title from "$lib/components/wallet/balance/title.svelte";
  import Assets from "$lib/components/wallet/asset/assets.svelte";
  import Percentage from "$lib/components/wallet/balance/percentage.svelte";
</script>

{#if $mixinConnected && $userAssets}
  <div class="flex flex-col space-y-4">
    <Title />
    <Percentage />
  </div>

  <div class="mt-6 border-t-[10px] border-slate-100 mb-36">
    <Assets />
  </div>
{:else if $mixinConnected && !$userAssets}
  <div class="flex flex-col items-center justify-center space-y-6 h-[80vh]">
    <Loading />
    <span class="font-bold"> {$_('loading_assets')} </span>
  </div>
{:else}
  <ConnectWallet />
{/if}