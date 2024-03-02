<script lang="ts">
	import type { AdminSingleKey } from '$lib/types/hufi/admin';
  import SingleApiKey from "$lib/components/admin/exchanges/singleAPIKey.svelte"

  const keys: AdminSingleKey[] = [
    { exchange: 'binance', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'binance', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '321rweqjifsadjifjYr4Rx-Af50DDqtlx'},
    { exchange: 'binance', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'binance', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '321rweqjifsadjifjYr4Rx-Af50DDqtlx'},
    { exchange: 'okx', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'okx', state: 'dead', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'okx', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'bitfinex', state: 'dead', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'bitfinex', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
    { exchange: 'bitfinex', state: 'alive', last_update: '2024-01-31T23:52:21Z', key: '0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx'},
  ];
</script>

<div>
  {#each keys as key}
    <SingleApiKey key={key} />
  {/each}
</div>