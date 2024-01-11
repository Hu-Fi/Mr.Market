<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
    import { Chart } from "svelte-lightweight-charts";

  const buys = [
    { price: 1, amount: 1 },
  ]
  const sells = [
    { price: 1, amount: 1 },
  ]
</script>

<div class="mt-3">
  <Chart />
</div>

<style>

</style>