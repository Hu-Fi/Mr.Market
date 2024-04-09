<script lang="ts">
	import { clsx } from 'clsx';
  export let chainIcon = ""
  export let assetIcon = ""
  export let clazz = "w-9 h-9"
  export let claxx = "w-3 h-3"
  export let imageClass = ""
</script>

<div class={clsx("relative", clazz)}>
  <img src={assetIcon} alt="-" class={imageClass} />
  {#if chainIcon}
    <div class={clsx("absolute bottom-0 left-0.5 rounded-full border border-base-100", claxx)}>
      <img src={chainIcon} alt="-" class={imageClass} />
    </div>
  {/if}
</div>