<script>
  import { goto } from "$app/navigation";
  import { formatUSMoney } from "$lib/helpers/utils";
</script>

<button class="flex flex-col m-4 bg-base-100 rounded-2xl shadow border-t border-base-content/10 text-left bg-base-content/5"
  on:click={() => {
    return goto('/market-making/hufi');
  }}
>
  <div class="flex justify-between m-4 my-3">
    <span class="text-normal font-semibold">
      HuFi Campaigns
    </span>

    <span>
      ->
    </span>
  </div>
  <div class="grid grid-cols-2">
    <div class="stat p-4">
      <div class="stat-title">Rewards Pool</div>
      <div class="stat-value">{formatUSMoney(349)}</div>
    </div>

    <div class="stat p-4">
      <div class="stat-title">Active Campaigns</div>
      <div class="stat-value">4</div>
    </div>
  </div>
</button>