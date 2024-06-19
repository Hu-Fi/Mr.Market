<script lang="ts">
  import Amount from "$lib/components/grow/arbitrage/new/amount.svelte";
  import CreateIntro from "$lib/components/grow/justGrow/new/createIntro.svelte";
  import ExchangeView from "$lib/components/grow/arbitrage/new/exchangeView.svelte";
</script>

<div class="flex flex-col space-y-8">
  <ExchangeView />
  <Amount />
  <CreateIntro />
</div>