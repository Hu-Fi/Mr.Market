<script>
  import clsx from 'clsx';
  import { findExchangeIconByIdentifier } from '$lib/helpers/helpers';

  export let exchangeName = 'binance';
  export let clazz = '';
</script>

<img src={findExchangeIconByIdentifier(exchangeName)} alt={exchangeName} class={clsx(clazz)} />