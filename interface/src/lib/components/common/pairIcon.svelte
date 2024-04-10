<script lang="ts">
	import { clsx } from 'clsx';
  export let chain0Icon = ""
  export let chain1Icon = ""
  export let asset0Icon = "https://mixin-images.zeromesh.net/96l-LTbahgBXnKfLRHtiQybyk9kpA-eVIMYnzs4twATFtIq3Ayvw5zRfhGrt5IOGqUxxJuFXINJMTNkRlWpnFVbsA4Ep6FAn0pWP=s128"
  export let asset1Icon = "https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128"
  export let clazz = "w-9 h-9"
  export let claxx = "w-3 h-3"
  export let space = "-space-x-1"
  export let directionRight = true
  export let rotate = true
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
</script>

<div class="relative flex items-center">
  <div class={clsx("min-w-[2rem] inline-grid grid-cols-2", space, rotate ? (directionRight ? "rotate-45" : "-rotate-45") : '')}>
    <div class={clsx("avatar", clazz, rotate ? (directionRight ? "-rotate-45" : 'rotate-45') : 'z-10')}>
      <AssetIcon chainIcon={chain0Icon} assetIcon={asset0Icon} clazz={clazz} claxx={claxx} imageClass={clsx({'rounded-full': !rotate})} />
    </div>
    <div class={clsx("avatar", clazz, rotate ? (directionRight ? "-rotate-45" : 'rotate-45') : 'ml-minus-10')}>
      <AssetIcon chainIcon={chain1Icon} assetIcon={asset1Icon} clazz={clazz} claxx={claxx} imageClass={clsx({'rounded-full': !rotate})} />
    </div>
  </div>
</div>

<style>
  .ml-minus-10 {
      margin-left: -15px !important;
  }
</style>