<script lang="ts">
  const items = [
    {name: 'spot', last_update: '2024-02-29 16:04:50', count: 123, active: true},
    {name: 'swap', last_update: '2024-02-29 16:04:50', count: 353, active: true},
    {name: 'users', last_update: '2024-02-29 16:04:50', count: 2421, active: true},
    {name: 'market making', last_update: '2024-02-29 16:04:50', count: 2135, active: true},
    {name: 'arbitrage', last_update: '2024-02-29 16:04:50', count: 4234, active: true},
  ]
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-center gap-4">
  {#each items as item}
    <div class="stats shadow">  
      <div class="stat">
        <div class="stat-figure text-green-500">
          {#if item.active}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
            </svg>          
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
            </svg>          
          {/if}          
        </div>
        <div class="stat-title">
          <span class="">Table [{item.name}] </span>
        </div>
        <div class="stat-value">{item.count}</div>
        <div class="stat-desc">{item.last_update}</div>
      </div>
    </div>
  {/each}
</div>