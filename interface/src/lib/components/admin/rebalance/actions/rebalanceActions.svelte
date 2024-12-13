<script>
  import { _ } from "svelte-i18n";

  const items = [
    {'name': 'transfer', fn: () => {console.log('transfer')}},
    {'name': 'deposit', fn: () => {console.log('deposit')}},
    {'name': 'withdraw', fn: () => {console.log('withdraw')}},
    {'name': 'info', fn: () => {console.log('info')}},
    {'name': 'settings', fn: () => {console.log('settings')}},
  ];
</script>

<!-- Title -->
<div class="text-xl font-bold">{$_("actions")}</div>

<!-- Actions Section -->
<div class="grid grid-cols-5 gap-4">
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