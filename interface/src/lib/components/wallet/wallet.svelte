<script lang="ts">
  import clsx from "clsx";
  import { darkTheme } from "$lib/stores/theme";
  import { userAssets } from "$lib/stores/wallet";
  import { mixinConnected } from "$lib/stores/home";
  import Title from "$lib/components/wallet/balance/title.svelte";
  import Assets from "$lib/components/wallet/asset/assets.svelte";
  import NoBalance from "$lib/components/wallet/balance/noBalance.svelte";
  import Percentage from "$lib/components/wallet/balance/percentage.svelte";
  import ConnectWallet from "$lib/components/wallet/connect/connectWallet.svelte";
	import WalletPageLoader from '$lib/components/skeleton/wallet/walletPageLoader.svelte';
</script>

<!-- Have balance -->
{#if $mixinConnected && $userAssets && $userAssets.balances && $userAssets.balances.length > 0}
  <div class="flex flex-col space-y-4">
    <Title />
    <Percentage />
  </div>

  <div class={clsx("mt-6 border-t mb-36", $darkTheme ? "border-slate-900" : "border-base-200")}>
    <Assets />
  </div>
<!-- Zero balance -->
{:else if $mixinConnected && $userAssets && $userAssets.balances && $userAssets.balances.length === 0}
  <NoBalance />
<!-- Loading -->
{:else if $mixinConnected && !$userAssets}
  <WalletPageLoader />
{:else}
  <ConnectWallet />
{/if}