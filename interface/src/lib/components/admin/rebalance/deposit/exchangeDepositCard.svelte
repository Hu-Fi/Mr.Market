<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import toast from "svelte-french-toast";
  import { getDepositAddressByKeyIdAndCurrency } from "$lib/helpers/hufi/admin/exchange";

  const keyId = $page.params.id;
  const currencyId = $page.params.currency;
  const networkId = $page.params.network;

  async function fetchDepositAddress() {
    if (!keyId || !currencyId || !networkId) {
      return;
    }
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const res = await getDepositAddressByKeyIdAndCurrency(token, {
      apiKeyId: keyId,
      network: networkId,
      symbol: currencyId,
    });
    if (res.code === 500) {
      toast.error(res.message);
      return;
    }
    console.log(res);
  }

  onMount(async() => {
    fetchDepositAddress();
    
  });
</script>

  {keyId}
  {currencyId}
  {networkId}
