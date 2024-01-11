<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import PairSelector from "$lib/components/dialogs/candle/pairSelector.svelte"
  import Title from "$lib/components/market/candle/title.svelte";
  import Tabs from "$lib/components/market/candle/tabs.svelte";

</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <Title />
</div>
<!-- <div class="mt-3 pb-1 border-b">
  <Tabs />
</div> -->

<PairSelector />