<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { formatDecimals, formatUSMoney } from "$lib/helpers/utils";
  export let rewardsPool = 0;
  export let activeCampaigns = 0;
</script>

<button class="flex flex-col my-4 bg-base-100 rounded-2xl border-t border-slate-200 text-left bg-slate-50"
  on:click={() => {
    return goto('/market-making/hufi');
  }}
>
  <div class="flex justify-between m-4 my-3">
    <span class="text-normal font-normal">
      {$_('hufi_campaigns')}
    </span>

    <span>
      ->
    </span>
  </div>
  <div class="grid grid-cols-2 border-t border-slate-100">
    <div class="stat p-4">
      <div class="stat-title">{$_('rewards_pool')}</div>
      <div class="stat-value text-3xl mt-0.5 text-slate-700">{formatUSMoney(formatDecimals(rewardsPool, 1))}</div>
    </div>

    <div class="stat p-4">
      <div class="stat-title">{$_('active_campaigns')}</div>
      <div class="stat-value text-3xl mt-0.5 text-slate-700">{activeCampaigns}</div>
    </div>
  </div>
</button>