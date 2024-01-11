<script lang="ts">
  import { _ } from "svelte-i18n";
  import Title from "$lib/components/market/coin/title.svelte";
  import Chart from "$lib/components/market/coin/chart.svelte";
  import Infos from "$lib/components/market/coin/infos.svelte";
  import Loading from "$lib/components/home/loading.svelte";

</script>

<div class="h-full w-full">
  <Title />
  <Chart />
  <Infos />
</div>

<style>
</style>
