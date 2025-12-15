<script lang="ts">
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { sortSpot } from "$lib/helpers/sortTable";
  import type { PairsData } from "$lib/types/hufi/exchanges";
  import { activeSpotTab, asc, spotSelectedField } from "$lib/stores/market";
  import SinglePair from "$lib/components/market/elements/singlePair.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SpotTableColumns from "$lib/components/market/elements/spotTableColumns.svelte";
  import NoResult from "$lib/components/common/NoResult.svelte";

  let defaultsPairs: PairsData[] = [];
  const exchangeMap: { [key: number]: string } = {
    1: "okx",
    2: "bitfinex",
    3: "mexc",
    4: "gate",
    5: "lbank",
  };
  $: pairs =
    $activeSpotTab === 0
      ? defaultsPairs
      : defaultsPairs.filter(
          (item) => item.exchange === exchangeMap[$activeSpotTab],
        );
  let sortedPairs: PairsData[] = [];
  $: sortedPairs = sortSpot($spotSelectedField, pairs, $asc);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let resolved = false;
  $page.data.pairs
    .then((x: PairsData[]) => {
      (resolved = true), (defaultsPairs = x);
    })
    .catch((e: unknown) => {
      console.log(e);
      resolved = false;
    });
  onDestroy(() => {
    activeSpotTab.set(0);
  });
</script>

<div class="flex flex-col">
  <div class="w-full mb-24">
    <table class="table w-full">
      {#if $page.url.pathname.includes("/market/token")}
        <TableColumns />
      {:else if $page.url.pathname.includes("/market/spot")}
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
