<script lang="ts">
  import { _ } from "svelte-i18n";
  import { sortCoins, sortSpot } from "$lib/helpers/sortTable";
  import Tbd from "$lib/components/common/TBD.svelte";
  import SinglePair from "$lib/components/market/elements/singlePair.svelte";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import { activeTab, activeSecondTab, asc, selectedField } from "$lib/stores/market";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import { page } from "$app/stores";

  let start = 0; let end = 15;
  let defaults = [
    {"id":"bitcoin","symbol":"btc","name":"Bitcoin","image":"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price":42632,"market_cap":835055181228,"market_cap_rank":1,"fully_diluted_valuation":895305808841,"total_volume":12859406774,"high_24h":42782,"low_24h":42095,"price_change_24h":52.9,"price_change_percentage_24h":0.12424,"market_cap_change_24h":2568819209,"market_cap_change_percentage_24h":0.30857,"circulating_supply":19586781,"total_supply":21000000,"max_supply":21000000,"ath":69045,"ath_change_percentage":-38.2734,"ath_date":"2021-11-10T14:24:11.849Z","atl":67.81,"atl_change_percentage":62751.51889,"atl_date":"2013-07-06T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:29.021Z"}, 
    {"id":"ethereum","symbol":"eth","name":"Ethereum","image":"https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628","current_price":2301.14,"market_cap":276572458394,"market_cap_rank":2,"fully_diluted_valuation":276572458394,"total_volume":8894579262,"high_24h":2309.18,"low_24h":2269.76,"price_change_24h":-3.9636198555340343,"price_change_percentage_24h":-0.17195,"market_cap_change_24h":-228094566.49066162,"market_cap_change_percentage_24h":-0.0824,"circulating_supply":120183924.988634,"total_supply":120183924.988634,"max_supply":null,"ath":4878.26,"ath_change_percentage":-52.84105,"ath_date":"2021-11-10T14:24:19.604Z","atl":0.432979,"atl_change_percentage":531227.60555,"atl_date":"2015-10-20T00:00:00.000Z","roi":{"times":71.15813436002082,"currency":"btc","percentage":7115.813436002083},"last_updated":"2024-01-01T15:12:26.113Z"}, 
    {"id":"tether","symbol":"usdt","name":"Tether","image":"https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661","current_price":1.001,"market_cap":91711230607,"market_cap_rank":3,"fully_diluted_valuation":91711230607,"total_volume":19199186371,"high_24h":1.002,"low_24h":0.996392,"price_change_24h":0.00090314,"price_change_percentage_24h":0.09034,"market_cap_change_24h":55080745,"market_cap_change_percentage_24h":0.06009,"circulating_supply":91705804322.0054,"total_supply":91705804322.0054,"max_supply":null,"ath":1.32,"ath_change_percentage":-24.40302,"ath_date":"2018-07-24T00:00:00.000Z","atl":0.572521,"atl_change_percentage":74.70453,"atl_date":"2015-03-02T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:10:15.840Z"}, 
    {"id":"binancecoin","symbol":"bnb","name":"BNB","image":"https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970","current_price":310.5,"market_cap":47772055754,"market_cap_rank":4,"fully_diluted_valuation":47772055754,"total_volume":840736267,"high_24h":318.42,"low_24h":307.61,"price_change_24h":-5.8930759455450925,"price_change_percentage_24h":-1.86261,"market_cap_change_24h":-895251678.3297043,"market_cap_change_percentage_24h":-1.83953,"circulating_supply":153856150,"total_supply":153856150,"max_supply":200000000,"ath":686.31,"ath_change_percentage":-54.83627,"ath_date":"2021-05-10T07:24:17.097Z","atl":0.0398177,"atl_change_percentage":778352.03282,"atl_date":"2017-10-19T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:23.690Z"}, 
    {"id":"solana","symbol":"sol","name":"Solana","image":"https://assets.coingecko.com/coins/images/4128/large/solana.png?1696504756","current_price":104.6,"market_cap":44910518269,"market_cap_rank":5,"fully_diluted_valuation":59134115821,"total_volume":1844442400,"high_24h":105.75,"low_24h":100.35,"price_change_24h":1.27,"price_change_percentage_24h":1.23024,"market_cap_change_24h":707886794,"market_cap_change_percentage_24h":1.60146,"circulating_supply":429897288.174792,"total_supply":566049936.847467,"max_supply":null,"ath":259.96,"ath_change_percentage":-59.81637,"ath_date":"2021-11-06T21:54:35.825Z","atl":0.500801,"atl_change_percentage":20758.78818,"atl_date":"2020-05-11T19:35:23.449Z","roi":null,"last_updated":"2024-01-01T15:12:26.654Z"}, 
    {"id":"ripple","symbol":"xrp","name":"XRP","image":"https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442","current_price":0.619553,"market_cap":33527067967,"market_cap_rank":6,"fully_diluted_valuation":61936232759,"total_volume":682609656,"high_24h":0.623844,"low_24h":0.609216,"price_change_24h":-0.004082136648631441,"price_change_percentage_24h":-0.65457,"market_cap_change_24h":-163491810.31513596,"market_cap_change_percentage_24h":-0.48527,"circulating_supply":54125149173,"total_supply":99988100379,"max_supply":100000000000,"ath":3.4,"ath_change_percentage":-81.78309,"ath_date":"2018-01-07T00:00:00.000Z","atl":0.00268621,"atl_change_percentage":22947.09284,"atl_date":"2014-05-22T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:36.594Z"}, 
    {"id":"usd-coin","symbol":"usdc","name":"USDC","image":"https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694","current_price":1,"market_cap":24477527030,"market_cap_rank":7,"fully_diluted_valuation":24478961914,"total_volume":5789561019,"high_24h":1.003,"low_24h":0.995867,"price_change_24h":-0.000704671913125621,"price_change_percentage_24h":-0.07042,"market_cap_change_24h":-164921728.69119644,"market_cap_change_percentage_24h":-0.66926,"circulating_supply":24489880107.8115,"total_supply":24491315715.1549,"max_supply":null,"ath":1.17,"ath_change_percentage":-14.73616,"ath_date":"2019-05-08T00:40:28.300Z","atl":0.877647,"atl_change_percentage":13.92903,"atl_date":"2023-03-11T08:02:13.981Z","roi":null,"last_updated":"2024-01-01T15:12:31.623Z"}, 
    {"id":"staked-ether","symbol":"steth","name":"Lido Staked Ether","image":"https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206","current_price":2298.57,"market_cap":21166016643,"market_cap_rank":8,"fully_diluted_valuation":21166168993,"total_volume":9322742,"high_24h":2307.61,"low_24h":2271.15,"price_change_24h":-3.300903373248275,"price_change_percentage_24h":-0.1434,"market_cap_change_24h":-11473134.615947723,"market_cap_change_percentage_24h":-0.05418,"circulating_supply":9211463.9972709,"total_supply":9211530.30019135,"max_supply":9211463.9972709,"ath":4829.57,"ath_change_percentage":-52.44075,"ath_date":"2021-11-10T14:40:47.256Z","atl":482.9,"atl_change_percentage":375.65245,"atl_date":"2020-12-22T04:08:21.854Z","roi":null,"last_updated":"2024-01-01T15:12:20.338Z"}, 
    {"id":"cardano","symbol":"ada","name":"Cardano","image":"https://assets.coingecko.com/coins/images/975/large/cardano.png?1696502090","current_price":0.600832,"market_cap":21067277401,"market_cap_rank":9,"fully_diluted_valuation":27053093578,"total_volume":377685333,"high_24h":0.605611,"low_24h":0.589121,"price_change_24h":-0.003222113718426845,"price_change_percentage_24h":-0.53342,"market_cap_change_24h":-75437529.77026749,"market_cap_change_percentage_24h":-0.3568,"circulating_supply":35043219006.4836,"total_supply":45000000000,"max_supply":45000000000,"ath":3.09,"ath_change_percentage":-80.51128,"ath_date":"2021-09-02T06:00:10.474Z","atl":0.01925275,"atl_change_percentage":3024.74577,"atl_date":"2020-03-13T02:22:55.044Z","roi":null,"last_updated":"2024-01-01T15:12:29.988Z"}, 
    {"id":"avalanche-2","symbol":"avax","name":"Avalanche","image":"https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1696512369","current_price":39.59,"market_cap":14455159297,"market_cap_rank":10,"fully_diluted_valuation":17145953583,"total_volume":598043700,"high_24h":39.86,"low_24h":38.12,"price_change_24h":-0.11411875962905782,"price_change_percentage_24h":-0.28745,"market_cap_change_24h":-54748456.873298645,"market_cap_change_percentage_24h":-0.37732,"circulating_supply":365476964.791937,"total_supply":433509950.930094,"max_supply":720000000,"ath":144.96,"ath_change_percentage":-72.73807,"ath_date":"2021-11-21T14:18:56.538Z","atl":2.8,"atl_change_percentage":1310.86488,"atl_date":"2020-12-31T13:15:21.540Z","roi":null,"last_updated":"2024-01-01T15:12:35.695Z"}, 
    {"id":"dogecoin","symbol":"doge","name":"Dogecoin","image":"https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1696501409","current_price":0.090842,"market_cap":12946586009,"market_cap_rank":11,"fully_diluted_valuation":12946555113,"total_volume":361258477,"high_24h":0.09077,"low_24h":0.088825,"price_change_24h":0.00067929,"price_change_percentage_24h":0.7534,"market_cap_change_24h":108195533,"market_cap_change_percentage_24h":0.84275,"circulating_supply":142475236383.705,"total_supply":142475246383.705,"max_supply":null,"ath":0.731578,"ath_change_percentage":-87.62387,"ath_date":"2021-05-08T05:08:23.458Z","atl":0.0000869,"atl_change_percentage":104085.39696,"atl_date":"2015-05-06T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:34.577Z"}, 
    {"id":"polkadot","symbol":"dot","name":"Polkadot","image":"https://assets.coingecko.com/coins/images/12171/large/polkadot.png?1696512008","current_price":8.29,"market_cap":10862939885,"market_cap_rank":12,"fully_diluted_valuation":11532175016,"total_volume":238259307,"high_24h":8.52,"low_24h":8.1,"price_change_24h":-0.207005526809251,"price_change_percentage_24h":-2.43501,"market_cap_change_24h":-250976405.0068817,"market_cap_change_percentage_24h":-2.25822,"circulating_supply":1313956089.46937,"total_supply":1394906373.62786,"max_supply":null,"ath":54.98,"ath_change_percentage":-84.96174,"ath_date":"2021-11-04T14:10:09.301Z","atl":2.7,"atl_change_percentage":206.51751,"atl_date":"2020-08-20T05:48:11.359Z","roi":null,"last_updated":"2024-01-01T15:12:30.955Z"}, 
    {"id":"tron","symbol":"trx","name":"TRON","image":"https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1696502193","current_price":0.106931,"market_cap":9424556733,"market_cap_rank":13,"fully_diluted_valuation":9424575075,"total_volume":305144950,"high_24h":0.108999,"low_24h":0.106118,"price_change_24h":-0.000202790028133851,"price_change_percentage_24h":-0.18929,"market_cap_change_24h":-23210547.94091797,"market_cap_change_percentage_24h":-0.24567,"circulating_supply":88317106879.7391,"total_supply":88317278756.6272,"max_supply":null,"ath":0.231673,"ath_change_percentage":-53.92991,"ath_date":"2018-01-05T00:00:00.000Z","atl":0.00180434,"atl_change_percentage":5815.27958,"atl_date":"2017-11-12T00:00:00.000Z","roi":{"times":55.279517848303264,"currency":"usd","percentage":5527.951784830327},"last_updated":"2024-01-01T15:12:36.185Z"}, 
    {"id":"matic-network","symbol":"matic","name":"Polygon","image":"https://assets.coingecko.com/coins/images/4713/large/polygon.png?1698233745","current_price":0.9844,"market_cap":9139708441,"market_cap_rank":14,"fully_diluted_valuation":9845700748,"total_volume":505234717,"high_24h":1.011,"low_24h":0.957401,"price_change_24h":-0.014919046194254215,"price_change_percentage_24h":-1.49292,"market_cap_change_24h":-147930980.07458687,"market_cap_change_percentage_24h":-1.59277,"circulating_supply":9282943566.203985,"total_supply":10000000000,"max_supply":10000000000,"ath":2.92,"ath_change_percentage":-66.26436,"ath_date":"2021-12-27T02:08:34.307Z","atl":0.00314376,"atl_change_percentage":31194.36967,"atl_date":"2019-05-10T00:00:00.000Z","roi":{"times":373.29662362513955,"currency":"usd","percentage":37329.662362513955},"last_updated":"2024-01-01T15:12:32.925Z"}, 
    {"id":"chainlink","symbol":"link","name":"Chainlink","image":"https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1696502009","current_price":15.2,"market_cap":8460560765,"market_cap_rank":15,"fully_diluted_valuation":15193609054,"total_volume":334034360,"high_24h":15.42,"low_24h":14.87,"price_change_24h":-0.20859849285938914,"price_change_percentage_24h":-1.35411,"market_cap_change_24h":-108413232.08157063,"market_cap_change_percentage_24h":-1.26518,"circulating_supply":556849971.2305644,"total_supply":1000000000,"max_supply":1000000000,"ath":52.7,"ath_change_percentage":-71.11865,"ath_date":"2021-05-10T00:13:57.214Z","atl":0.148183,"atl_change_percentage":10170.72526,"atl_date":"2017-11-29T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:21.382Z"}, 
    {"id":"the-open-network","symbol":"ton","name":"Toncoin","image":"https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png?1696517498","current_price":2.27,"market_cap":8005264926,"market_cap_rank":16,"fully_diluted_valuation":11814654532,"total_volume":25888590,"high_24h":2.36,"low_24h":2.26,"price_change_24h":-0.010162815436641992,"price_change_percentage_24h":-0.44603,"market_cap_change_24h":132470899,"market_cap_change_percentage_24h":1.68264,"circulating_supply":3455905049.93155,"total_supply":5100433856.62578,"max_supply":null,"ath":5.29,"ath_change_percentage":-56.22457,"ath_date":"2021-11-12T06:50:02.476Z","atl":0.519364,"atl_change_percentage":345.94335,"atl_date":"2021-09-21T00:33:11.092Z","roi":null,"last_updated":"2024-01-01T15:12:18.313Z"}, 
    {"id":"wrapped-bitcoin","symbol":"wbtc","name":"Wrapped Bitcoin","image":"https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857","current_price":42424,"market_cap":6703806014,"market_cap_rank":17,"fully_diluted_valuation":6703806014,"total_volume":120223320,"high_24h":42756,"low_24h":42162,"price_change_24h":-145.76797972858185,"price_change_percentage_24h":-0.34242,"market_cap_change_24h":-10996738.462234497,"market_cap_change_percentage_24h":-0.16377,"circulating_supply":158168.98879455,"total_supply":158168.98879455,"max_supply":158168.98879455,"ath":70643,"ath_change_percentage":-39.97598,"ath_date":"2021-11-10T14:40:19.650Z","atl":3139.17,"atl_change_percentage":1250.77008,"atl_date":"2019-04-02T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:22.484Z"}, 
  ]
  const defaultsPairs = [
    {first: "BTC", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "ETH", second: "USDT", price: 2288, percentage: -1.58, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "SOL", second: "USDT", price: 95.55, percentage: +20.21, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "BNB", second: "USDT", price: 253, percentage: -0.63, favorite: false, icon: "https://logosandtypes.com/wp-content/uploads/2022/04/okx.svg", "exchange": "okx"},
    {first: "SUI", second: "USDT", price: 0.7299, percentage: +4.9, favorite: false, icon: "https://logosandtypes.com/wp-content/uploads/2022/04/okx.svg", "exchange": "okx"},
    {first: "UNI", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "BTC", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "ETH", second: "USDT", price: 2288, percentage: -1.58, favorite: false, icon: "https://logosandtypes.com/wp-content/uploads/2022/04/okx.svg", "exchange": "okx"},
    {first: "SOL", second: "USDT", price: 95.55, percentage: +20.21, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "BNB", second: "USDT", price: 253, percentage: -0.63, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "SUI", second: "USDT", price: 0.7299, percentage: +4.9, favorite: false, icon: "https://pbs.twimg.com/profile_images/1484586799921909764/A9yYenz3_400x400.png", "exchange": "coinbase"},
    {first: "UNI", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://pbs.twimg.com/profile_images/1484586799921909764/A9yYenz3_400x400.png", "exchange": "coinbase"},
  ]
  $: pairs = $activeTab === 1 ?  
              $activeSecondTab === 0 ? defaultsPairs :
              $activeSecondTab === 1 ? defaultsPairs.filter((item)=>{return item.exchange === 'binance'}) :
              $activeSecondTab === 2 ? defaultsPairs.filter((item)=>{return item.exchange === 'okx'}) :
              $activeSecondTab === 3 ? defaultsPairs.filter((item)=>{return item.exchange === 'coinbase'}) :
              $activeSecondTab === 4 ? defaultsPairs.filter((item)=>{return item.exchange === 'bitfinex'}) :
              $activeSecondTab === 5 ? defaultsPairs.filter((item)=>{return item.exchange === 'gate.io'}) : defaultsPairs : defaultsPairs 
  $: tokens = $activeTab === 0 ?
              $activeSecondTab === 0 ? defaults.slice(4,9) : 
              $activeSecondTab === 1 ? defaults :
              $activeSecondTab === 2 ? defaults.slice(5,10) :
              $activeSecondTab === 3 ? defaults.slice(1,6) :
              $activeSecondTab === 4 ? defaults.slice(3,7) :
              $activeSecondTab === 5 ? defaults.slice(5,9) :
              $activeSecondTab === 6 ? defaults.slice(1,9) :
              $activeSecondTab === 7 ? defaults.slice(3,6) :
              $activeSecondTab === 8 ? defaults.slice(2,8) : 
              $activeSecondTab === 9 ? defaults.slice(3,8) : 
              $activeSecondTab === 10 ? defaults.slice(1,7) : defaults : defaults

  $: sortedTokens = sortCoins($selectedField, tokens, $asc)
  $: sortedPairs = sortSpot($selectedField, pairs, $asc)

  let resolved = false;
  $page.data.market.then(x => {resolved = true, defaults=x} ).catch(x => resolved = true)
</script>

<div class="w-full mb-24">
  <table class="table w-full">
    {#if $activeTab === 0}

      {#if !resolved}
        <!-- Loading -->
        {#each Array(12) as i}
          <SingleTokenLoader />
        {/each} 
      {:else} 
        <!-- Success -->
        <table class="table w-full">
          <TableColumns />
          <tbody>
            {#each sortedTokens as token}
              <SingleToken token={token} />
            {/each}
          </tbody>          
        </table>
      {/if}
    
    {:else if $activeTab === 1}
      <TableColumns />

      <tbody class="h-full">
        {#each sortedPairs as pair}
          <SinglePair pair={pair}/>
        {/each}
      </tbody>
      
    {:else}
      <div class="my-36">
        <Tbd />
      </div>
    {/if}
  </table>
</div>

<style>
</style>
