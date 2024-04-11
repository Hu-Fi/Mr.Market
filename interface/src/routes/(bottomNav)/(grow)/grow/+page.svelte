<script lang="ts">
  import { mixinConnected } from "$lib/stores/home";
  import Grow from "$lib/components/grow/grow.svelte";
  import { getUserStrategyOrders } from "$lib/helpers/mixin";

  (async()=>{
    if ($mixinConnected) {
      await getUserStrategyOrders();
    }
  })()
</script>

<Grow />  
