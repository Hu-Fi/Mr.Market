<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  $page.data.spotInfo.then((res) => {
    if (!res.data) {
      return;
    }
    const pairs = res.data.trading_pairs
    const pair = pairs[0]
    const exchange = pair.exchange_id
    const symbols = pair.symbol.replace('/', '-')
    goto(`/spot/${exchange}/${symbols}`)
  })
</script>