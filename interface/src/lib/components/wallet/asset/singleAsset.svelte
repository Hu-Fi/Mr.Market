<button class="flex justify-between py-3" on:click={()=>{assetDetailAsset.set(asset); assetDetailDialog.set(true)}}>
  <div class="flex space-x-4 items-center justify-center">
    <!-- Left Icon -->
    <AssetIcon assetIcon={asset.details.icon_url} chainIcon={findChainIcon(asset.details.chain_id)} />
    
    <!-- Center Amount and USD Value -->
    <div class="flex flex-col space-y-0.5 items-start">
      <div>
        <span class="balance-font text-xl">{formatWalletBalance(asset.balance)}</span> <span class="text-xs !text-[10px]">{asset.details.symbol}</span>
      </div>
      
      <!-- Placeholder -->
      <span class="text-xs !text-[10px] opacity-40">≈ ${ formatDecimals(BN2(asset.balance).multipliedBy(asset.details.price_usd).multipliedBy(locale_currency).toNumber(), 2) }</span>
    </div>
  </div>
  
  <div class="flex flex-col justify-center items-end ">
    <!-- Right 24h Change and Price -->
    <div>
      <span class={clsx("text-xs opacity-60", Number(asset.details.change_usd) > 0 ? UpColorText : DownColorText)}> 
        {formatDecimals(BN(asset.details.change_usd).multipliedBy(100).toString(), 2)}% 
      </span>
    </div>
    <div>
      <span class="text-xs !text-[10px] opacity-40"> 
        ${formatWalletBalance(Number(asset.details.price_usd))} 
      </span>
    </div>
  </div>
</button>

<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { DownColorText, UpColorText } from "$lib/helpers/constants";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { assetDetailAsset, assetDetailDialog } from "$lib/stores/wallet"
  import { BN, BN2, findChainIcon, formatDecimals, formatWalletBalance } from "$lib/helpers/utils";    

  let locale_currency = 1;
  export let asset = {
    "balance": 320.85893223,
    "asset_id": "0ff3f325-4f34-334d-b6c0-a3bd8850fc06",
    "usdBalance": 0,
    "details": {
      "type": "safe_asset",
      "asset_id": "0ff3f325-4f34-334d-b6c0-a3bd8850fc06",
      "chain_id": "43d61dcd-e413-450d-80b8-101d5e903357",
      "symbol": "JPYC",
      "name": "JPY Coin",
      "icon_url": "https://mixin-images.zeromesh.net/CxP44pLrWUlNyP0xFx4nrOe-GIe9oPHFLKEjsgj7hja9bvWW4n-VkBvhArFlRm73ZrmalAGgVzHEk56VluNyjM-pTX0a4_cMveWORA=s128",
      "price_btc": "0",
      "price_usd": "0",
      "change_btc": "0",
      "change_usd": "0",
      "asset_key": "0x2370f9d504c7a6e775bf6e14b3f12846b594cd53",
      "precision": 18,
      "dust": "0.0001",
      "confirmations": 32,
      "kernel_asset_id": "7094b7c7867ee6c4d563a4eb7356428005390efb00be64c11180664dd0c2451e",
      "price_updated_at": "0001-01-01T00:00:00Z",
      "fee_asset_id": "43d61dcd-e413-450d-80b8-101d5e903357"
    }
  }
</script>
