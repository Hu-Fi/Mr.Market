<script lang="ts">
  import Orders from "$lib/components/spot/order/elements/orders.svelte";
  import Title from "$lib/components/spot/order/elements/title.svelte";
  import Tools from "$lib/components/spot/order/elements/tools.svelte";
</script>

<div class="flex flex-col space-y-2">
  <Title />
  <Orders />
  <Tools />
</div>