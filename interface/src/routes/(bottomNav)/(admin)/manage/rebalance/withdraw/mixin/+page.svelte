<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import WithdrawFromMixin from "$lib/components/admin/rebalance/withdraw/withdrawFromMixin.svelte";
</script>

<div class="flex flex-col min-h-screen bg-base-100">
  <!-- Header -->
  <div class="flex items-center gap-2 p-4 bg-base-100">
    <!-- Arrow left -->
    <button class="btn btn-ghost btn-circle" on:click={() => { goto('/manage/rebalance/withdraw') }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </button>
    <!-- Title -->
    <h1 class="text-xl font-bold">{$_("withdraw")}</h1>
  </div>
  <WithdrawFromMixin />
</div>