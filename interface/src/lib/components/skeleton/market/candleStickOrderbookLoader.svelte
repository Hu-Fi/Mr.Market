<div class="flex flex-col space-y-4 px-3 mt-3">
  <div class="flex justify-between px-2 text-sm items-center">
    <!-- Buy -->
    <div class="skeleton font-medium w-12 h-4 text-xs opacity-60" />

    <!-- Sell -->
    <div class="skeleton font-medium w-12 h-4 opacity-60" />
  </div>

  <!-- Explain -->
  <div class="flex justify-between px-2 text-[10px] opacity-60">
    <div class="skeleton font-medium w-12 h-4" />
    <div class="skeleton font-medium w-12 h-4" />
    <div class="skeleton font-medium w-12 h-4" />
  </div>
  
  <!-- Active Orders -->
  <div class="w-full grid grid-cols-2 text-xs">
    <!-- Buy -->
    <div class="flex flex-col">
      {#each Array(6) as _}
        <div class="flex items-center justify-center p-2 bids">
          <div class="skeleton w-full h-8 opacity-50 rounded-lg" />
        </div>    
      {/each}
    </div>

    <!-- Sell -->
    <div class="flex flex-col">
      {#each Array(6) as _}
        <div class="flex items-center justify-center p-2 bids">
          <div class="skeleton w-full h-8 opacity-50 rounded-lg" />
        </div>    
      {/each}
    </div>
  </div>
</div>