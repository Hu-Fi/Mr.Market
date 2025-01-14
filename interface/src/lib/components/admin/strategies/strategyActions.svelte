<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";

  const actions = [
    { name: 'Execute Arbitrage', fn: () => { /* Add logic to execute arbitrage */ } },
    { name: 'Execute Market Making', fn: () => { /* Add logic to execute market making */ } },
    { name: 'Execute Volume Strategy', fn: () => { /* Add logic to execute volume strategy */ } },
  ];
</script>

<div class="text-xl font-bold">{$_("strategy_actions")}</div>
<div class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 justify-center items-center gap-4">
  {#each actions as action}
    <div class="stats shadow">
      <div class="stat">
        <button class="stat-value my-1 mr-2 text-base" on:click={action.fn}>
          {action.name}
        </button>
      </div>
    </div>
  {/each}
</div>