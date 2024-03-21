<div class="flex p-4 justify-between">
  <!-- Price -->
  <div class="flex flex-col space-y-2">
    <div class="h-9 w-24 skeleton" />

    <div class="flex space-x-2 text-sm">
      <!-- USD Price -->
      <div class="h-4 w-12 opacity-80 skeleton" />

      <!-- Change -->
      <div class="h-4 w-8 opacity-80 skeleton" />
    </div>
  </div>

  <!-- Volume -->
  <div class="flex flex-col items-center justify-center space-y-2">
    {#each Array(3) as _}
      <div class="flex justify-between text-xs w-full space-x-3">
        <div class="w-12 h-3 skeleton opacity-80" />
        <div class="w-8 h-3 skeleton" />
      </div>
    {/each}
  </div>
</div>
