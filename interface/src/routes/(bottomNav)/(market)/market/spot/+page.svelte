<script lang="ts">
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
	import { invalidate } from '$app/navigation';
  import { sortSpot } from "$lib/helpers/sortTable";
  import { activeSpotTab, asc, spotSelectedField } from "$lib/stores/market";
  import SinglePair from "$lib/components/market/elements/singlePair.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SpotTableColumns from "$lib/components/market/elements/spotTableColumns.svelte";
  import NoResult from "$lib/components/common/NoResult.svelte";

  $: Pairs = [];
  $: sortedPairs = sortSpot($spotSelectedField, Pairs, $asc)?.filter((pair) => {
    if ($activeSpotTab === 'all') {
      return pair
    } else {
      return pair.exchange_id === $activeSpotTab
    }
  });

  let resolved = false;
  const loadPairs = async () => {
    $page.data.spotInfo.then((x) => {
      resolved = true;
      const pairs = x.data.trading_pairs.filter((pair) => {
        if (pair.enable) {
          return pair
        }
      });
      Pairs = pairs;
    })
    .catch((e) => {
      console.log(e);
      resolved = false;
    }); 
  }
  onMount(() => {
    const interval = setInterval(() => {
      console.log(`Trading info updated at ${new Date().toISOString()}`)
			invalidate('market');
      loadPairs()
		}, 3000); // 3 seconds
    loadPairs()
    return () => {
			clearInterval(interval);
		};
  });
  onDestroy(() => {
    activeSpotTab.set('all');
  });
</script>

<div class="flex flex-col">
  <div class="w-full mb-24">
    <table class="table w-full">
      {#if $page.url.pathname.includes('/market/token')}
        <TableColumns />
      {:else if $page.url.pathname.includes('/market/spot')}
        <SpotTableColumns />
      {/if}

      <tbody class="h-full">
        {#if sortedPairs.length > 0}
          {#each sortedPairs as pair}
            <SinglePair {pair} />
          {/each}
        {:else}
          <NoResult />
        {/if}
      </tbody>
    </table>
  </div>
</div>
