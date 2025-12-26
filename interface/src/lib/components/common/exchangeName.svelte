<script>
  import clsx from "clsx";
  export let exchangeName = "";
  export let clazz = "";

  // i18n support can be added later
  switch (exchangeName) {
    case "alpaca":
      exchangeName = "Alpaca";
      break;
    case "apex":
      exchangeName = "Apex";
      break;
    case "arkham":
      exchangeName = "ARKHAM";
      break;
    case "ascendex":
      exchangeName = "AscendEX";
      break;
    case "backpack":
      exchangeName = "Backpack";
      break;
    case "bequant":
      exchangeName = "Bequant";
      break;
    case "bigone":
      exchangeName = "BigONE";
      break;
    case "binance":
      exchangeName = "Binance";
      break;
    case "binanceus":
      exchangeName = "BinanceUS";
      break;
    case "bingx":
      exchangeName = "BingX";
      break;
    case "bit2c":
      exchangeName = "Bit2C";
      break;
    case "bitbank":
      exchangeName = "bitbank";
      break;
    case "bitbns":
      exchangeName = "Bitbns";
      break;
    case "bitfinex":
      exchangeName = "Bitfinex";
      break;
    case "bitflyer":
      exchangeName = "bitFlyer";
      break;
    case "bitget":
      exchangeName = "Bitget";
      break;
    case "bithumb":
      exchangeName = "Bithumb";
      break;
    case "bitmart":
      exchangeName = "BitMart";
      break;
    case "bitmex":
      exchangeName = "BitMEX";
      break;
    case "bitopro":
      exchangeName = "BitoPro";
      break;
    case "bitrue":
      exchangeName = "Bitrue";
      break;
    case "bitso":
      exchangeName = "Bitso";
      break;
    case "bitstamp":
      exchangeName = "Bitstamp";
      break;
    case "bitteam":
      exchangeName = "BIT.TEAM";
      break;
    case "bittrade":
      exchangeName = "BitTrade";
      break;
    case "bitvavo":
      exchangeName = "Bitvavo";
      break;
    case "blockchaincom":
      exchangeName = "Blockchain.com";
      break;
    case "blofin":
      exchangeName = "BloFin";
      break;
    case "btcalpha":
      exchangeName = "BTC-Alpha";
      break;
    case "btcbox":
      exchangeName = "BtcBox";
      break;
    case "btcmarkets":
      exchangeName = "BTCMarkets";
      break;
    case "btcturk":
      exchangeName = "BTCTurk";
      break;
    case "bullish":
      exchangeName = "Bullish";
      break;
    case "bybit":
      exchangeName = "Bybit";
      break;
    case "cex":
      exchangeName = "CEX.IO";
      break;
    case "coinbase":
      exchangeName = "CoinbaseAdvanced";
      break;
    case "coinbaseexchange":
      exchangeName = "CoinbaseExchange";
      break;
    case "coinbaseinternational":
      exchangeName = "CoinbaseInternational";
      break;
    case "coincatch":
      exchangeName = "CoinCatch";
      break;
    case "coincheck":
      exchangeName = "coincheck";
      break;
    case "coinex":
      exchangeName = "CoinEx";
      break;
    case "coinmate":
      exchangeName = "CoinMate";
      break;
    case "coinmetro":
      exchangeName = "Coinmetro";
      break;
    case "coinone":
      exchangeName = "CoinOne";
      break;
    case "coinsph":
      exchangeName = "Coins.ph";
      break;
    case "coinspot":
      exchangeName = "CoinSpot";
      break;
    case "cryptocom":
      exchangeName = "Crypto.com";
      break;
    case "cryptomus":
      exchangeName = "Cryptomus";
      break;
    case "deepcoin":
      exchangeName = "DeepCoin";
      break;
    case "defx":
      exchangeName = "DefxX";
      break;
    case "delta":
      exchangeName = "DeltaExchange";
      break;
    case "deribit":
      exchangeName = "Deribit";
      break;
    case "derive":
      exchangeName = "derive";
      break;
    case "digifinex":
      exchangeName = "DigiFinex";
      break;
    case "dydx":
      exchangeName = "dYdX";
      break;
    case "exmo":
      exchangeName = "EXMO";
      break;
    case "fmfwio":
      exchangeName = "FMFW.io";
      break;
    case "foxbit":
      exchangeName = "Foxbit";
      break;
    case "gate":
      exchangeName = "Gate";
      break;
    case "gemini":
      exchangeName = "Gemini";
      break;
    case "hashkey":
      exchangeName = "HashKeyGlobal";
      break;
    case "hibachi":
      exchangeName = "Hibachi";
      break;
    case "hitbtc":
      exchangeName = "HitBTC";
      break;
    case "hollaex":
      exchangeName = "HollaEx";
      break;
    case "htx":
      exchangeName = "HTX";
      break;
    case "hyperliquid":
      exchangeName = "Hyperliquid";
      break;
    case "independentreserve":
      exchangeName = "IndependentReserve";
      break;
    case "indodax":
      exchangeName = "INDODAX";
      break;
    case "kraken":
      exchangeName = "Kraken";
      break;
    case "krakenfutures":
      exchangeName = "KrakenFutures";
      break;
    case "kucoin":
      exchangeName = "KuCoin";
      break;
    case "kucoinfutures":
      exchangeName = "KuCoinFutures";
      break;
    case "latoken":
      exchangeName = "Latoken";
      break;
    case "lbank":
      exchangeName = "LBank";
      break;
    case "luno":
      exchangeName = "luno";
      break;
    case "mercado":
      exchangeName = "MercadoBitcoin";
      break;
    case "mexc":
      exchangeName = "MEXCGlobal";
      break;
    case "modetrade":
      exchangeName = "ModeTrade";
      break;
    case "myokx":
      exchangeName = "MyOKX(EEA";
      break;
    case "ndax":
      exchangeName = "NDAX";
      break;
    case "novadax":
      exchangeName = "NovaDAX";
      break;
    case "oceanex":
      exchangeName = "OceanEx";
      break;
    case "okx":
      exchangeName = "OKX";
      break;
    case "okxus":
      exchangeName = "OKX(US";
      break;
    case "onetrading":
      exchangeName = "OneTrading";
      break;
    case "oxfun":
      exchangeName = "OXFUN";
      break;
    case "p2b":
      exchangeName = "p2b";
      break;
    case "paradex":
      exchangeName = "Paradex";
      break;
    case "paymium":
      exchangeName = "Paymium";
      break;
    case "phemex":
      exchangeName = "Phemex";
      break;
    case "poloniex":
      exchangeName = "Poloniex";
      break;
    case "probit":
      exchangeName = "ProBit";
      break;
    case "timex":
      exchangeName = "TimeX";
      break;
    case "tokocrypto":
      exchangeName = "Tokocrypto";
      break;
    case "toobit":
      exchangeName = "Toobit";
      break;
    case "upbit":
      exchangeName = "Upbit";
      break;
    case "wavesexchange":
      exchangeName = "Waves.Exchange";
      break;
    case "whitebit":
      exchangeName = "WhiteBit";
      break;
    case "woo":
      exchangeName = "WOOX";
      break;
    case "woofipro":
      exchangeName = "WOOFIPRO";
      break;
    case "xt":
      exchangeName = "XT";
      break;
    case "yobit":
      exchangeName = "YoBit";
      break;
    case "zaif":
      exchangeName = "Zaif";
      break;
    case "zonda":
      exchangeName = "Zonda";
      break;
    default:
      exchangeName = exchangeName;
  }
</script>

<span class={clsx(clazz)}>{exchangeName}</span>
