<script lang="ts">
  import CandlePairSelector from "$lib/components/dialogs/candle/candlePairSelector.svelte"
  import Title from "$lib/components/market/candle/title.svelte";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <Title />
</div>

<CandlePairSelector />