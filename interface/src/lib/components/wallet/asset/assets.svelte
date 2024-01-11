<div class="flex flex-col px-5">
  {#if $userAssets}
    {#each Object.values($userAssets.balances) as asset}
      <SingleAsset {asset} />
    {/each}
  {/if}
</div>


<script lang="ts">
  import { _ } from "svelte-i18n";
  import SingleAsset from "$lib/components/wallet/asset/singleAsset.svelte";
  import { userAssets } from "$lib/stores/wallet";

  let data = {
    balances: {
      "f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c": {
        balance: 339342.44088321,
        asset_id: "f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c",
        usdBalance: 1674241.681680011683,
        details: {
          type: "safe_asset",
          asset_id: "f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c",
          chain_id: "43d61dcd-e413-450d-80b8-101d5e903357",
          symbol: "BOX",
          name: "BOX Token",
          icon_url:
            "https://mixin-images.zeromesh.net/ml7tg1ZGrQt6IJSvEusWFfthosOB98GWN7r4EkmgSP8tbJHxK7OWki9zfZFFDCDOJE0nlLBR6dc4nbUguXE3Bg4=s128",
          price_btc: "0.00011",
          price_usd: "4.93499585",
          change_btc: "-0.0013643155162615193",
          change_usd: "0.008880874040826657",
          asset_key: "0x045414e728067ab3da4bceafc0d992d59183463a",
          precision: 18,
          dust: "0.0001",
          confirmations: 32,
          kernel_asset_id:
            "da5f6dbd3102cd89b1b040c6b61e5f2b696bcb989dff7d8ecee8872aacf65592",
          price_updated_at: "2024-01-08T15:02:08.375365178Z",
          fee_asset_id: "43d61dcd-e413-450d-80b8-101d5e903357",
        },
      },
      "c6d0c728-2624-429b-8e0d-d9d19b6592fa": {
        balance: 22.315052999999996,
        asset_id: "c6d0c728-2624-429b-8e0d-d9d19b6592fa",
        usdBalance: 12702311.000173679999,
        details: {
          type: "safe_asset",
          asset_id: "c6d0c728-2624-429b-8e0d-d9d19b6592fa",
          chain_id: "c6d0c728-2624-429b-8e0d-d9d19b6592fa",
          symbol: "BTC",
          name: "Bitcoin",
          icon_url:
            "https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128",
          price_btc: "1",
          price_usd: "44856",
          change_btc: "0",
          change_usd: "0.009747203025459785",
          asset_key: "c6d0c728-2624-429b-8e0d-d9d19b6592fa",
          precision: 8,
          dust: "0.0001",
          confirmations: 3,
          kernel_asset_id:
            "fe6b7788944d328778f98e3e81588215b5a07de4f9a4a7de4db4535b404e65db",
          price_updated_at: "2024-01-08T15:04:20.106655129Z",
          fee_asset_id: "c6d0c728-2624-429b-8e0d-d9d19b6592fa",
        },
      },
      "b91e18ff-a9ae-3dc7-8679-e935d9a4b34b": {
        balance: 230345.29373952000003,
        asset_id: "b91e18ff-a9ae-3dc7-8679-e935d9a4b34b",
        usdBalance: 23210.52403325952,
        details: {
          type: "safe_asset",
          asset_id: "b91e18ff-a9ae-3dc7-8679-e935d9a4b34b",
          chain_id: "25dabac5-056a-48ff-b9f9-f67395dc407c",
          symbol: "USDT",
          name: "Tether USD",
          icon_url:
            "https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128",
          price_btc: "0.00002232",
          price_usd: "1.001",
          change_btc: "-0.009320905459387484",
          change_usd: "0",
          asset_key: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          precision: 6,
          dust: "0.0001",
          confirmations: 20,
          kernel_asset_id:
            "5b9d576914e71e2362f89bb867eb69084931eb958f9a3622d776b861602275f4",
          price_updated_at: "2024-01-08T15:04:20.008726466Z",
          fee_asset_id: "25dabac5-056a-48ff-b9f9-f67395dc407c",
        },
      },
      "30e340a7-3284-3f04-8594-fbdd8f2da79f": {
        balance: 1892421.92297421,
        asset_id: "30e340a7-3284-3f04-8594-fbdd8f2da79f",
        usdBalance: 2194.19307452084456,
        details: {
          type: "safe_asset",
          asset_id: "30e340a7-3284-3f04-8594-fbdd8f2da79f",
          chain_id: "43d61dcd-e413-450d-80b8-101d5e903357",
          symbol: "HMT",
          name: "Human Token",
          icon_url:
            "https://mixin-images.zeromesh.net/rXVPsR7G8pZsAuWB2-UUDd1q8Ok4amyZwkBaRJt9qFDHruTnYKR0tffYoDwzz4-nHwnsKRyy26wRJaVXc5_kOj6eP3JKlgJYVCGMJg=s128",
          price_btc: "0.00000111",
          price_usd: "0.04978695",
          change_btc: "-0.008928571428571428",
          change_usd: "-0.00032789005061514023",
          asset_key: "0xd1ba9bac957322d6e8c07a160a3a8da11a0d2867",
          precision: 18,
          dust: "0.0001",
          confirmations: 32,
          kernel_asset_id:
            "611f5b40f8cd763db90ea011af09178d97f3621247a1209a3bd7916dc67abdf7",
          price_updated_at: "2024-01-08T15:04:26.231899153Z",
          fee_asset_id: "43d61dcd-e413-450d-80b8-101d5e903357",
        },
      },
      "c94ac88f-4671-3976-b60a-09064f1811e8": {
        balance: 3190589,
        asset_id: "c94ac88f-4671-3976-b60a-09064f1811e8",
        usdBalance: 402131234.195040221999996,
        details: {
          type: "safe_asset",
          asset_id: "c94ac88f-4671-3976-b60a-09064f1811e8",
          chain_id: "43d61dcd-e413-450d-80b8-101d5e903357",
          symbol: "XIN",
          name: "Mixin",
          icon_url:
            "https://mixin-images.zeromesh.net/UasWtBZO0TZyLTLCFQjvE_UYekjC7eHCuT_9_52ZpzmCC-X-NPioVegng7Hfx0XmIUavZgz5UL-HIgPCBECc-Ws=s128",
          price_btc: "0.00280792",
          price_usd: "125.98",
          change_btc: "-0.01714101698000273",
          change_usd: "-0.006936780703137317",
          asset_key: "0xa974c709cfb4566686553a20790685a47aceaa33",
          precision: 18,
          dust: "0.0001",
          confirmations: 32,
          kernel_asset_id:
            "a99c2e0e2b1da4d648755ef19bd95139acbbe6564cfb06dec7cd34931ca72cdc",
          price_updated_at: "2024-01-08T15:01:35.762272044Z",
          fee_asset_id: "43d61dcd-e413-450d-80b8-101d5e903357",
        },
      },
      "6cfe566e-4aad-470b-8c9a-2fd35b49c68d": {
        balance: 1.3729802,
        asset_id: "6cfe566e-4aad-470b-8c9a-2fd35b49c68d",
        usdBalance: 0.9818689412874,
        details: {
          type: "safe_asset",
          asset_id: "6cfe566e-4aad-470b-8c9a-2fd35b49c68d",
          chain_id: "6cfe566e-4aad-470b-8c9a-2fd35b49c68d",
          symbol: "EOS",
          name: "EOS",
          icon_url:
            "https://mixin-images.zeromesh.net/OTwqLjEwc6v0JutJc-1sYkh_juFOvVbFz26WvvwfLGdKq6ZtwAT-wKhX0k-5PsgOK_Pd9rCQjZfwMJmiNXCBzpHnjapBtkCqAVCTCg=s128",
          price_btc: "0.00001594",
          price_usd: "0.715137",
          change_btc: "-0.03569267997580157",
          change_usd: "-0.025755984322444324",
          asset_key: "eosio.token:EOS",
          precision: 4,
          dust: "0.0001",
          confirmations: 64,
          kernel_asset_id:
            "6ac4cbffda9952e7f0d924e4cfb6beb29d21854ac00bfbf749f086302d0f7e5d",
          price_updated_at: "2024-01-08T15:01:30.27045449Z",
          fee_asset_id: "6cfe566e-4aad-470b-8c9a-2fd35b49c68d",
        },
      },
      "4d8c508b-91c5-375b-92b0-ee702ed2dac5": {
        balance: 89629872,
        asset_id: "4d8c508b-91c5-375b-92b0-ee702ed2dac5",
        usdBalance: 89719501.87199998,
        details: {
          type: "safe_asset",
          asset_id: "4d8c508b-91c5-375b-92b0-ee702ed2dac5",
          chain_id: "43d61dcd-e413-450d-80b8-101d5e903357",
          symbol: "USDT",
          name: "Tether USD",
          icon_url:
            "https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128",
          price_btc: "0.00002232",
          price_usd: "1.001",
          change_btc: "-0.009320905459387484",
          change_usd: "0",
          asset_key: "0xdac17f958d2ee523a2206206994597c13d831ec7",
          precision: 6,
          dust: "0.0001",
          confirmations: 32,
          kernel_asset_id:
            "d4c304ffc3270ee0f3468913bd8027225201f0eccd336d47062d76c6e2b6bb27",
          price_updated_at: "2024-01-08T15:04:19.905990094Z",
          fee_asset_id: "43d61dcd-e413-450d-80b8-101d5e903357",
        },
      },
    },
    totalUSDBalance: 51442153.758655352416,
    totalBTCBalance: 478.1007369215359,
  };
</script>