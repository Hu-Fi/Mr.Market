<script lang="ts">
  import Entrance from "./elements/entrance.svelte";
  import Ongoing from "./elements/ongoing.svelte";
  import { mixinConnected } from "$lib/stores/home";
  import GrowAddMore from "$lib/components/dialogs/grow/growAddMore.svelte";
  import ConnectWalletBtn from "$lib/components/common/connectWalletBtn.svelte";
</script>

<div class="flex flex-col space-y-5">
  <Entrance />
</div>
{#if mixinConnected}
  <Ongoing />
  <GrowAddMore />
{:else}
  <div class="flex items-center justify-center">
    <ConnectWalletBtn clazz="btn-normal"/>
  </div>
{/if}