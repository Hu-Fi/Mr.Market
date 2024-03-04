<script lang="ts">
  import SingleSpotHistory from "$lib/components/spot/history/singleSpotHistory.svelte";
	import OrderHistoryFilter from '$lib/components/dialogs/manageOrder/orderHistoryFilter.svelte';
</script>

<div class="mx-6">
  {#each Array(10) as _}
    <SingleSpotHistory />
  {/each}
</div>
<OrderHistoryFilter/>