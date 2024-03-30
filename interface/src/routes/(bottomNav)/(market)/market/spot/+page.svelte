<script lang="ts">
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { sortSpot } from "$lib/helpers/sortTable";
  import type { PairsData } from "$lib/types/hufi/exchanges";
  import { activeSecondTab, asc, spotSelectedField } from "$lib/stores/market";
  import SinglePair from "$lib/components/market/elements/singlePair.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SpotTableColumns from "$lib/components/market/elements/spotTableColumns.svelte";

  let defaultsPairs: PairsData[] = [];
  $: pairs =
    $activeSecondTab === 0
      ? defaultsPairs
      : $activeSecondTab === 1
        ? defaultsPairs.filter((item) => {
            return item.exchange === "okx";
          })
        : $activeSecondTab === 2
          ? defaultsPairs.filter((item) => {
              return item.exchange === "bitfinex";
            })
          : $activeSecondTab === 3
            ? defaultsPairs.filter((item) => {
                return item.exchange === "mexc";
              })
            : $activeSecondTab === 4
              ? defaultsPairs.filter((item) => {
                  return item.exchange === "gate";
                })
              : $activeSecondTab === 5
                ? defaultsPairs.filter((item) => {
                    return item.exchange === "lbank";
                  })
                : defaultsPairs;

  $: sortedPairs = sortSpot($spotSelectedField, pairs, $asc);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let resolved = false;
  $page.data.pairs
    .then((x) => {
      (resolved = true), (defaultsPairs = x);
    })
    .catch((e) => {
      console.log(e);
      resolved = false;
    });
  onDestroy(() => {
    activeSecondTab.set(0);
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
        {#each sortedPairs as pair}
          <SinglePair {pair} />
        {/each}
      </tbody>
    </table>
  </div>
</div>
