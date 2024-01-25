<script lang="ts">
	import { clsx } from 'clsx';
  export let chain0Icon = "https://mixin-images.zeromesh.net/96l-LTbahgBXnKfLRHtiQybyk9kpA-eVIMYnzs4twATFtIq3Ayvw5zRfhGrt5IOGqUxxJuFXINJMTNkRlWpnFVbsA4Ep6FAn0pWP=s128"
  export let asset0Icon = "https://mixin-images.zeromesh.net/96l-LTbahgBXnKfLRHtiQybyk9kpA-eVIMYnzs4twATFtIq3Ayvw5zRfhGrt5IOGqUxxJuFXINJMTNkRlWpnFVbsA4Ep6FAn0pWP=s128"
  export let chain1Icon = "https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128"
  export let asset1Icon = "https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128"
  export let clazz = "w-9 h-9"
  export let claxx = "w-3 h-3"
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
</script>

<div class="relative flex items-center">
  <div class="min-w-[2rem] inline-grid grid-cols-2 -space-x-1 rotate-45">
    <div class={clsx("avatar", clazz,"-rotate-45")}>
      <AssetIcon chainIcon={chain0Icon} assetIcon={asset0Icon} clazz={clazz} claxx={claxx}/>
    </div>
    <div class={clsx("avatar", clazz,"-rotate-45")}>
      <AssetIcon chainIcon={chain1Icon} assetIcon={asset1Icon} clazz={clazz} claxx={claxx} />
    </div>
  </div>
</div>