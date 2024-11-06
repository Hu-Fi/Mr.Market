<script lang="ts">
  import Exchange from "$lib/components/grow/marketMaking/new/easy/exchange.svelte";
  import Amount from "$lib/components/grow/marketMaking/new/easy/amount.svelte";
  import Web3Address from "$lib/components/common/web3Address.svelte";
  import CreateIntro from "$lib/components/grow/justGrow/new/createIntro.svelte";
</script>

<div class="flex flex-col space-y-8">
  <Exchange />
  <Amount />
  <Web3Address />
  <CreateIntro />
</div>