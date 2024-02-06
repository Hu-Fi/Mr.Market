<script lang="ts">
  import Input from "$lib/components/swap/input.svelte";
  import Switch from "$lib/components/swap/switch.svelte";
  import Output from "$lib/components/swap/output.svelte";
  import Confirm from "$lib/components/swap/confirm.svelte";
  import Info from "$lib/components/swap/info.svelte";
  import InputAssetDialog from "$lib/components/dialogs/swap/inputAsset.svelte";
  import OutputAssetDialog from "$lib/components/dialogs/swap/outputAsset.svelte";
  import InputBalanceDialog from "$lib/components/dialogs/swap/inputBalance.svelte";
  import OutputBalanceDialog from "$lib/components/dialogs/swap/outputBalance.svelte";
  import SwapConfirmDialog from "$lib/components/dialogs/swap/swapConfirm.svelte";
  import SupportedExchangesDialog from "$lib/components/dialogs/swap/supportedExchanges.svelte";
</script>

<div class="flex flex-col mt-8 -space-y-2.5">
  <Input />
  <Switch />
  <Output />
  <Info />
  <Confirm />
</div>

<InputAssetDialog />
<OutputAssetDialog />
<InputBalanceDialog />
<OutputBalanceDialog />
<SwapConfirmDialog />
<SupportedExchangesDialog />