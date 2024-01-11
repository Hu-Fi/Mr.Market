<div class="mx-4">
  <div class="mt-3">
    <div class="h-[300px] w-full skeleton rounded-none" />
  </div>
  
  <div class="mt-2 grid grid-flow-row grid-cols-6 gap-4">
    {#each Array(6) as i}
      <div
        class="skeleton min-w-8 h-6 w-10 rounded-md"
      />
    {/each}
  </div>
</div>