<script>
  import clsx from "clsx";
  export let exchangeName = '';
  export let clazz= '';

  // i18n support can be added later
  switch (exchangeName) {
    case 'binance':
      exchangeName = 'Binance';
      break;
    case 'bybit':
      exchangeName = 'Bybit';
      break;
    case 'kucoin':
      exchangeName = 'KuCoin';
      break;
    case 'gate.io':
      exchangeName = 'Gate.io';
      break;
    case 'okx':
      exchangeName = 'OKX';
      break;
    case 'huobi':
      exchangeName = 'Huobi';
      break;
    case 'mexc':
      exchangeName = 'MEXC';
      break;
    default:
      exchangeName = exchangeName;
  }
</script>

<span class={clsx(clazz)}>{exchangeName}</span>