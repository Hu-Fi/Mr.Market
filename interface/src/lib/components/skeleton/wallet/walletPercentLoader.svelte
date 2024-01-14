<div class="flex flex-col space-y-4">
    <!-- Line -->
    <div class="mx-4 shadow-2xl flex join-item skeleton h-2" />

    <!-- Text -->
    <div class="grid grid-cols-3 gap-4 content-center px-4">
      {#each Array(3) as a, i}
        <div class="flex items-center justify-center space-x-2">
          <div class="h-2 w-0.5 rounded-full" />

          <div class="text-xs opacity-40 !ml-1 skeleton h-2 w-12" />
          
          <div class="text-xs opacity-40 skeleton h-2 w-4">
          </div>
        </div>
      {/each}
    </div>
</div>