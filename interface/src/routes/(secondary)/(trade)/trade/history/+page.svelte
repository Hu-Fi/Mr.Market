<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import SingleSpotHistory from "$lib/components/trade/history/singleSpotHistory.svelte";
	import OrderHistoryFilter from '$lib/components/dialogs/manageOrder/orderHistoryFilter.svelte';
</script>

<div class="mx-6">
  {#each Array(10) as a}
    <SingleSpotHistory />
  {/each}
</div>
<OrderHistoryFilter/>