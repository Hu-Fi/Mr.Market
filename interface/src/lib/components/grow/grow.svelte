<script lang="ts">
  import { _ } from "svelte-i18n";
  import Entrance from "./elements/entrance.svelte";
  import Ongoing from "./elements/ongoing.svelte";
  import { mixinConnected } from "$lib/stores/home";
  import GrowAddMore from "$lib/components/dialogs/grow/growAddMore.svelte";
  import ConnectWalletBtn from "$lib/components/common/connectWalletBtn.svelte";
</script>

<div class="flex flex-col space-y-5">
  <Entrance />
</div>
{#if $mixinConnected}
  <Ongoing />
  <GrowAddMore />
{:else}
  <div class="flex flex-col space-y-6 grow justify-center items-center mb-12">
    <span>
      {$_('connect_wallet_order_intro')}
    </span>
    <ConnectWalletBtn clazz="btn-normal bg-base-content text-base-100 hover:bg-base-content"/>
  </div>
{/if}