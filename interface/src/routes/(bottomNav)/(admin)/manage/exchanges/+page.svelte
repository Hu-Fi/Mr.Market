<script lang="ts">
  import KeyList from "$lib/components/admin/exchanges/keyList.svelte";
  import ExchangeStats from "$lib/components/admin/exchanges/exchangeStats.svelte";
  import ExchangeBalances from "$lib/components/admin/exchanges/exchangeBalances.svelte";
</script>

<div class="p-8 flex flex-col space-y-6">
  <ExchangeStats />
  <ExchangeBalances />
  <KeyList />
</div>