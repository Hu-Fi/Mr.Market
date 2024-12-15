<script>
  import { page } from "$app/stores";

  let asset;
  let chain;
  asset = $page.data.asset;
  chain = $page.data.chain;
  console.log(asset);
  console.log(chain);
</script>

<div class="flex flex-col text-wrap">
  {asset.symbol}
  {chain.symbol}
</div>
