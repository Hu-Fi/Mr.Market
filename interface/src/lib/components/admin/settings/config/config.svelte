<script>
  import clsx from "clsx";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { fetchSettings } from "$lib/helpers/hufi/admin/settings";

  let spot_fee = 0.002;
  let save_loading = false;
  let modify_fee = false;

  const loadSettings = async () => {
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const settings = await fetchSettings(token);
    console.log('onMount load settings from server', settings);
    if (!settings || !settings.data) {
      return;
    }
    spot_fee = settings.data.spot_fee;
  }
  onMount(() => {
    loadSettings();
  });

  const saveSettings = () => {
    save_loading = true;
    setTimeout( () => {
      save_loading = false;
    }, 3000)
  }
</script>

<div class="flex flex-col space-y-8">
  <div class="py-4 pt-0 space-y-4">
    <div class="text-xl font-bold">{$_("settings")}</div>
  </div>
  <div id="amount" class="flex flex-col space-y-2">
    <span>
      {$_('spot_fee')}
    </span>
    <div class="flex flex-row space-x-4">
      <input type="text" class="input input-bordered focus:outline-none" disabled={!modify_fee} bind:value={spot_fee} />
      <button class={clsx("rounded-2xl w-16", modify_fee && "hidden")} on:click={()=> { modify_fee = !modify_fee }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
    </div>
  </div>

  <div>
    <button class="btn btn-sm rounded-2xl w-16" on:click={()=> { saveSettings() }}>
      <span class={clsx(save_loading && "loading loading-sm")}>
        {$_('save')}
      </span>
    </button>
  </div>
</div>