<script>
    import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";

  const items = [
    // {'name': 'transfer', fn: () => {goto('/manage/rebalance/transfer')}},
    {'name': 'deposit', fn: () => {goto('/manage/rebalance/deposit')}},
    {'name': 'withdraw', fn: () => {goto('/manage/rebalance/withdraw')}},
  ];
</script>

<!-- Title -->
<div class="text-xl font-bold">{$_("actions")}</div>

<!-- Actions Section -->
<div class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-5 justify-center items-center gap-4">
  {#each items as item}
  <div class="stats shadow">
    <div class="stat">
      <button class="stat-value my-1 mr-2 text-base" on:click={()=>{item.fn()}}>
          {$_(item.name)}
        </button>
      </div>
    </div>
  {/each}
</div>