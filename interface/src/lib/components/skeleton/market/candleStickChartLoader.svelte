<!-- Kline Tabs loader -->
<div class="flex px-5 mt-2 items-center space-x-2">
  <div class="grid grid-flow-row grid-cols-5 gap-1 grow">
    {#each Array(4) as _}
      <div class="skeleton opacity-80 min-w-8 w-10 h-5 px-1"></div>
    {/each}
    <div class="skeleton opacity-80 flex min-w-8 space-x-[-8px] w-12 h-5" />
  </div>

  <!-- Indicator button -->
  <div class="skeleton opacity-80 flex min-w-8 space-x-[-8px] w-12 h-5" />
</div>

<!-- Kline chart loader -->
<div class="h-[300px] w-full select-none flex items-center justify-center">
  <div class="skeleton opacity-80 w-full mx-4 h-[265px]" />
</div>
