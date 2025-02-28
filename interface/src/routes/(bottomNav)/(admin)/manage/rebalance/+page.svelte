<script>
  import RebalanceActions from "$lib/components/admin/rebalance/actions/rebalanceActions.svelte";
  import BalanceSummary from "$lib/components/admin/rebalance/balance/balanceSummary.svelte";
  import RecordSummary from "$lib/components/admin/rebalance/record/recordSummary.svelte";
</script>

<div class="flex flex-col space-y-8 p-8">
  <BalanceSummary />
  <RebalanceActions />
  <!-- <RecordSummary /> -->
</div>
