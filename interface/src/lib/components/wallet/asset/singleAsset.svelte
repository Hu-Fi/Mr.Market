<script lang="ts">
  import clsx from "clsx";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { assetDetailAsset, assetDetailDialog } from "$lib/stores/wallet";
  import {
    BN,
    BN2,
    findChainIcon,
    formatDecimals,
    formatWalletBalance,
  } from "$lib/helpers/utils";

  let locale_currency = 1;
  type AssetDetails = {
    type: string;
    asset_id: string;
    chain_id: string;
    symbol: string;
    name: string;
    icon_url: string;
    price_btc: string;
    price_usd: string;
    change_btc: string;
    change_usd: string;
    asset_key: string;
    precision: number;
    dust: string;
    confirmations: number;
    kernel_asset_id: string;
    price_updated_at: string;
    fee_asset_id: string;
  };

  type Asset = {
    balance: string;
    asset_id: string;
    usdBalance: number;
    details: AssetDetails;
  };

  export let asset: Asset;
</script>

<button
  class="flex justify-between py-3"
  on:click={() => {
    assetDetailAsset.set(asset);
    assetDetailDialog.set(true);
  }}
>
  <div class="flex space-x-4 items-center justify-center">
    <!-- Left Icon -->
    <AssetIcon
      assetIcon={asset.details.icon_url}
      chainIcon={findChainIcon(asset.details.chain_id)}
    />

    <!-- Center Amount and USD Value -->
    <div class="flex flex-col space-y-0.5 items-start">
      <div>
        <span class="balance-font text-xl"
          >{formatWalletBalance(Number(asset.balance))}</span
        > <span class="text-xs !text-[10px]">{asset.details.symbol}</span>
      </div>

      <!-- Placeholder -->
      <span class="text-xs !text-[10px] opacity-40"
        >≈ ${formatDecimals(
          BN2(asset.balance)
            .multipliedBy(asset.details.price_usd)
            .multipliedBy(locale_currency)
            .toNumber(),
          2,
        )}</span
      >
    </div>
  </div>

  <div class="flex flex-col justify-center items-end">
    <!-- Right 24h Change and Price -->
    <div>
      <span
        class={clsx(
          "text-xs opacity-60",
          Number(asset.details.change_usd) > 0 ? UpColorText : DownColorText,
        )}
      >
        {formatDecimals(
          BN(asset.details.change_usd).multipliedBy(100).toString(),
          2,
        )}%
      </span>
    </div>
    <div>
      <span class="text-xs !text-[10px] opacity-40">
        ${formatWalletBalance(Number(asset.details.price_usd))}
      </span>
    </div>
  </div>
</button>
