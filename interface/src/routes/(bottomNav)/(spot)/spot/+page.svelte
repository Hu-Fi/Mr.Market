<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  $page.data.spotInfo.then((res) => {
    if (!res.data) {
      return;
    }
    const pairs = res.data.trading_pairs;

    // Find BTC pairs first, 
    // if not found, find ETH pairs, 
    // if not found, find SOL pairs, 
    // if not found, find USDT pairs, 
    // if not found, fall back to the first pair
    const trading_pair = pairs.find((pair) => pair.symbol.includes('BTC')) ||
                 pairs.find((pair) => pair.symbol.includes('ETH')) ||
                 pairs.find((pair) => pair.symbol.includes('SOL')) ||
                 pairs.find((pair) => pair.symbol.includes('USDT')) ||
                 pairs[0];
    const exchange = trading_pair.exchange_id;
    const symbols = trading_pair.symbol.replace('/', '-');
    goto(`/spot/${exchange}/${symbols}`);
  });
</script>