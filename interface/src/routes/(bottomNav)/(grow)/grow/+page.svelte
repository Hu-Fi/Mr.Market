<script lang="ts">
  import { user } from "$lib/stores/wallet";
  import { mixinConnected } from "$lib/stores/home";
  import Grow from "$lib/components/grow/grow.svelte";
  import { getUserStrategyOrders } from "$lib/helpers/mixin";

  (async()=>{
    if ($mixinConnected) {
      await getUserStrategyOrders($user.user_id);
    }
  })()
</script>

<Grow />  
