<script>
  import { onDestroy } from "svelte";
  import { mmEasyStep } from "$lib/stores/grow";
  import EasyAsset from "$lib/components/grow/marketMaking/easyAsset.svelte"
  import EasyAmount from "$lib/components/grow/marketMaking/easyAmount.svelte";

  onDestroy(()=>{mmEasyStep.set(0);})
</script>

<div class="flex flex-col mt-24 space-y-20">
  <EasyAsset />
  <EasyAmount />
</div>

<!-- Dialog -->
