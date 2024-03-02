<script>
  import clsx from "clsx";
import { _ } from "svelte-i18n";

  let max_amount_to_keep_in_bot = 30000;
  let spot_fee = 0.02;
  let save_loading = false;

  const loadSettings = () => {
    console.log('onMount load settings from server');
  }
  loadSettings()

  const saveSettings = () => {
    save_loading = true;
    console.log('call API to save settings with auth');
    setTimeout( () => {
      save_loading = false;
    }, 3000)
  }
</script>

<div class="flex flex-col space-y-8">
  <div>
    <span class="text-2xl font-semibold capitalize"> {$_('settings')} </span>
  </div>  

  <div id="amount" class="flex flex-col space-y-2">
    <span>
      {$_('max_amount_to_keep_in_bot')}
    </span>
    <div>
      <input type="text" class="input input-bordered focus:outline-none" bind:value={max_amount_to_keep_in_bot} />
    </div>
  </div>

  <div id="amount" class="flex flex-col space-y-2">
    <span>
      {$_('spot_fee')}
    </span>
    <div>
      <input type="text" class="input input-bordered focus:outline-none" bind:value={spot_fee} />
    </div>
  </div>

  <div>
    <button class="btn btn-sm rounded-2xl w-16" on:click={()=> { saveSettings() }}>
      <span class={clsx(save_loading && "loading")}>
        {$_('save')}
      </span>
    </button>
  </div>
</div>