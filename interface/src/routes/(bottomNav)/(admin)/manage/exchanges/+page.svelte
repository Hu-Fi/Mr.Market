<script lang="ts">
  import Actions from "$lib/components/admin/exchanges/actions.svelte";
  import KeyList from "$lib/components/admin/exchanges/keyList.svelte";
  import ExchangeStats from "$lib/components/admin/exchanges/exchangeStats.svelte";
  import ExchangeBalances from "$lib/components/admin/exchanges/exchangeBalances.svelte";
</script>

<div class="p-8 flex flex-col space-y-6">
  <ExchangeStats />
  <Actions />
  <ExchangeBalances />
  <KeyList />
</div>