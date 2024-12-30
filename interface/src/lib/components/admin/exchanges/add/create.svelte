<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import { addExchangeApiKey } from "$lib/helpers/hufi/admin/exchange";
  import type { ExchangeAPIKeysConfig } from "$lib/types/hufi/exchanges";

  let loading = false;
  let items = [
    { key: 'name', value: '', info: $_('name_info') },
    { key: 'exchange', value: '', info: $_('exchange_info') },
    { key: 'api_key', value: '', info: $_('api_key_info') },
    { key: 'api_secret', value: '', info: $_('api_secret_info') },
    { key: 'api_extra', value: '', info: $_('api_extra_info') },
  ];

  $:valid = items.every(item => item.key === 'api_extra' || item.value.trim() !== '');

  const addNewApiKey = async () => {
    if (!valid) {
      return;
    }

    loading = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      return;
    }

    try {
      loading = true;
      const data: ExchangeAPIKeysConfig = items.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as ExchangeAPIKeysConfig);
      const res = await addExchangeApiKey(token, data);
      console.log(res);
      if (res.code === 200) {
        toast.success(`Successfully added API key`);
      } else {
        toast.error(`${res.message}`);
      }
    } catch (e: any) {
      toast.error(`${e.message}`);
      loading = false;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-4">
  <div class=" flex items-center space-x-3">
    <button class="btn btn-ghost btn-circle" on:click={() => { goto("/manage/exchanges"); }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
    </button>
    <span class="font-bold">
      {$_("add_api_key")}
    </span>
  </div>

  <div class="mb-32 flex flex-col space-y-6 m-4">
    {#each items as { key, info }, index}
      <div class="flex flex-col space-y-3">
        <div>
          <span class="text-sm"> {key} </span>
          <!-- <span class="text-xs text-gray-500"> {info} </span> -->
        </div>
        {#if key === 'api_secret' || key === 'api_extra'}
          <input
            type="password"
            placeholder={info}
            bind:value={items[index].value}
            class="input input-bordered w-full max-w-xs focus:outline-none"
          />
        {:else}
          <input
            type="text"
            placeholder={info}
            bind:value={items[index].value}
            class="input input-bordered w-full max-w-xs focus:outline-none"
          />
        {/if}
      </div>
    {/each}

    <div>
      <button on:click={() => { addNewApiKey() }} class="btn" disabled={!valid}>
        <span class={loading ? 'loading bg-black/60' : ''}> {$_('add')} </span>
      </button>
    </div>
  </div>
</div>
