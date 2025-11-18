<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { formatDecimals, formatUSMoney } from "$lib/helpers/utils";
  export let rewardsPool = 0;
  export let activeCampaigns = 0;
</script>

<button class="flex flex-col my-4 rounded-2xl border-t border-slate-200 text-left bg-slate-50"
  on:click={() => {
    return goto('/market-making/hufi');
  }}
>
  <div class="flex justify-between m-4 my-3">
    <span class="text-normal font-normal">
      {$_('hufi_campaigns')}
    </span>

    <div class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </div>
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