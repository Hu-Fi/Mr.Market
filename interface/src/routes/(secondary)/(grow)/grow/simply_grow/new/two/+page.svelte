<script lang="ts">
  import Amount from "$lib/components/grow/simplyGrow/new/amount.svelte";
  import Info from "$lib/components/grow/simplyGrow/new/info.svelte";
  import Intro from "$lib/components/grow/simplyGrow/new/createIntro.svelte";
  import Web3Address from "$lib/components/common/web3Address.svelte";
</script>

<div class="flex flex-col space-y-8">
  <Info />
  <div class="flex flex-col space-y-4">
    <Amount />
  </div>
  <Web3Address />
  <div class="!mt-10">
    <Intro />
  </div>
</div>