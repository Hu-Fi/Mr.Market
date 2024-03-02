<script lang="ts">
  import { page } from "$app/stores";
  import { sortCoins } from "$lib/helpers/sortTable";
  import { activeCoinTab, asc, selectedField } from "$lib/stores/home";
  
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/home/markets/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
    import { marketData } from "$lib/stores/market";

  let defaults = [
    {"id":"bitcoin","symbol":"btc","name":"Bitcoin","image":"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price":42632,"market_cap":835055181228,"market_cap_rank":1,"fully_diluted_valuation":895305808841,"total_volume":12859406774,"high_24h":42782,"low_24h":42095,"price_change_24h":52.9,"price_change_percentage_24h":0.12424,"market_cap_change_24h":2568819209,"market_cap_change_percentage_24h":0.30857,"circulating_supply":19586781,"total_supply":21000000,"max_supply":21000000,"ath":69045,"ath_change_percentage":-38.2734,"ath_date":"2021-11-10T14:24:11.849Z","atl":67.81,"atl_change_percentage":62751.51889,"atl_date":"2013-07-06T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:29.021Z"}, 
    {"id":"ethereum","symbol":"eth","name":"Ethereum","image":"https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628","current_price":2301.14,"market_cap":276572458394,"market_cap_rank":2,"fully_diluted_valuation":276572458394,"total_volume":8894579262,"high_24h":2309.18,"low_24h":2269.76,"price_change_24h":-3.9636198555340343,"price_change_percentage_24h":-0.17195,"market_cap_change_24h":-228094566.49066162,"market_cap_change_percentage_24h":-0.0824,"circulating_supply":120183924.988634,"total_supply":120183924.988634,"max_supply":null,"ath":4878.26,"ath_change_percentage":-52.84105,"ath_date":"2021-11-10T14:24:19.604Z","atl":0.432979,"atl_change_percentage":531227.60555,"atl_date":"2015-10-20T00:00:00.000Z","roi":{"times":71.15813436002082,"currency":"btc","percentage":7115.813436002083},"last_updated":"2024-01-01T15:12:26.113Z"}, 
    {"id":"tether","symbol":"usdt","name":"Tether","image":"https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661","current_price":1.001,"market_cap":91711230607,"market_cap_rank":3,"fully_diluted_valuation":91711230607,"total_volume":19199186371,"high_24h":1.002,"low_24h":0.996392,"price_change_24h":0.00090314,"price_change_percentage_24h":0.09034,"market_cap_change_24h":55080745,"market_cap_change_percentage_24h":0.06009,"circulating_supply":91705804322.0054,"total_supply":91705804322.0054,"max_supply":null,"ath":1.32,"ath_change_percentage":-24.40302,"ath_date":"2018-07-24T00:00:00.000Z","atl":0.572521,"atl_change_percentage":74.70453,"atl_date":"2015-03-02T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:10:15.840Z"}, 
    {"id":"binancecoin","symbol":"bnb","name":"BNB","image":"https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970","current_price":310.5,"market_cap":47772055754,"market_cap_rank":4,"fully_diluted_valuation":47772055754,"total_volume":840736267,"high_24h":318.42,"low_24h":307.61,"price_change_24h":-5.8930759455450925,"price_change_percentage_24h":-1.86261,"market_cap_change_24h":-895251678.3297043,"market_cap_change_percentage_24h":-1.83953,"circulating_supply":153856150,"total_supply":153856150,"max_supply":200000000,"ath":686.31,"ath_change_percentage":-54.83627,"ath_date":"2021-05-10T07:24:17.097Z","atl":0.0398177,"atl_change_percentage":778352.03282,"atl_date":"2017-10-19T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:23.690Z"}, 
    {"id":"solana","symbol":"sol","name":"Solana","image":"https://assets.coingecko.com/coins/images/4128/large/solana.png?1696504756","current_price":104.6,"market_cap":44910518269,"market_cap_rank":5,"fully_diluted_valuation":59134115821,"total_volume":1844442400,"high_24h":105.75,"low_24h":100.35,"price_change_24h":1.27,"price_change_percentage_24h":1.23024,"market_cap_change_24h":707886794,"market_cap_change_percentage_24h":1.60146,"circulating_supply":429897288.174792,"total_supply":566049936.847467,"max_supply":null,"ath":259.96,"ath_change_percentage":-59.81637,"ath_date":"2021-11-06T21:54:35.825Z","atl":0.500801,"atl_change_percentage":20758.78818,"atl_date":"2020-05-11T19:35:23.449Z","roi":null,"last_updated":"2024-01-01T15:12:26.654Z"}, 
    {"id":"ripple","symbol":"xrp","name":"XRP","image":"https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442","current_price":0.619553,"market_cap":33527067967,"market_cap_rank":6,"fully_diluted_valuation":61936232759,"total_volume":682609656,"high_24h":0.623844,"low_24h":0.609216,"price_change_24h":-0.004082136648631441,"price_change_percentage_24h":-0.65457,"market_cap_change_24h":-163491810.31513596,"market_cap_change_percentage_24h":-0.48527,"circulating_supply":54125149173,"total_supply":99988100379,"max_supply":100000000000,"ath":3.4,"ath_change_percentage":-81.78309,"ath_date":"2018-01-07T00:00:00.000Z","atl":0.00268621,"atl_change_percentage":22947.09284,"atl_date":"2014-05-22T00:00:00.000Z","roi":null,"last_updated":"2024-01-01T15:12:36.594Z"}, 
  ]
  
  $: tokens = $activeCoinTab === 0 ? defaults.slice(4,9) : 
              $activeCoinTab === 1 ? defaults :
              $activeCoinTab === 2 ? defaults.slice(5,10) :
              $activeCoinTab === 3 ? defaults.slice(1,6) :
              $activeCoinTab === 4 ? defaults.slice(3,7) :
              $activeCoinTab === 5 ? defaults.slice(5,9) :
              $activeCoinTab === 6 ? defaults.slice(1,9) :
              $activeCoinTab === 7 ? defaults.slice(3,6) :
              $activeCoinTab === 8 ? defaults.slice(2,8) : 
              $activeCoinTab === 9 ? defaults.slice(3,8) : 
              $activeCoinTab === 10 ? defaults.slice(1,7) : defaults

  $: sortedTokens = sortCoins($selectedField, tokens, $asc)

  let resolved = false;
  $page.data.market.then(x => {resolved = true, defaults=x, marketData.set(x)} ).catch(() => resolved = true)
</script>

<div class="w-full mb-24">
  {#if !resolved}
    <!-- Loading -->
    {#each Array(12) as _}
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

    <!-- Error -->
    <!-- <table class="table w-full">
      <TableColumns />
      <tbody>
        {#each sortedTokens as token}
          <SingleToken token={token} />
        {/each}
      </tbody>
    </table>
    <span>An error has occurred: {e}</span> -->
  {/if}
 

  
  
  <!-- <div class="flex items-center justify-center h-96 text-center p-4">
    An error has occurred:
    {$marketQuery.error.message}
  </div> -->
</div>

<style>
</style>
