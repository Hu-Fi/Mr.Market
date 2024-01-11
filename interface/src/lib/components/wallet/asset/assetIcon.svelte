<script lang="ts">
  export let chainIcon = ""
  export let assetIcon = ""
  // export let sameChain = false;
</script>

<div class="relative w-9 h-9">
  <img src={assetIcon} alt="-" />
  <!-- {#if !sameChain} -->
    <div class="absolute bottom-0 left-0.5 w-3 h-3 rounded-full border border-base-100">
      <img src={chainIcon} alt="-" />
    </div>
  <!-- {/if} -->
</div>