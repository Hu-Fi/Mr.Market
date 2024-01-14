<script>
  import SinglePairLoader from "./singlePairLoader.svelte"
</script>

<div class="mt-4 border-t-4 border-t-base-200">
  <div class="px-4 py-3 flex space-x-4 items-center justify-start">
    {#each Array(2) as t}
      <div class="skeleton w-12 h-6">
      </div>
    {/each}
  </div>
</div>
<div class="flex flex-col space-y-6 mt-4 px-4">
  <!-- Title -->
  <div class="flex justify-between">
    <div class="w-8 h-3 skeleton" />
  </div>

  <!-- Pairs -->
  {#each Array(4) as pair}
    <SinglePairLoader />
  {/each}
</div>