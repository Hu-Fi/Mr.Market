<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { mixinConnected } from "$lib/stores/home";
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { BOT_ID, OAUTH_SCOPE } from "$lib/helpers/constants";

  $: load = false;
  const auth = async () => {
    load = true;
    authorize(
      { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce: true },
      {
        onShowUrl: (url: string) => {
          window.open(url)
        },
        onError: (error: any) => {
          console.error(error);
          return;
        },
        onSuccess: async (token: any) => {
          //token: eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiI5ZWU4ZTQzZS04NzczLTQyMDgtYjY2ZC0yMWZjNGU2NmNjMWYiLCJleHAiOjE3MzU0NDkxMTAsImlhdCI6MTcwMzkxMzExMCwiaXNzIjoiM2ZiNjgyNjMtNGYwNi00NzZlLTgzZGItNTAzZDI1ZDU2YjkzIiwic2NwIjoiUFJPRklMRTpSRUFEIEFTU0VUUzpSRUFEIFNOQVBTSE9UUzpSRUFEIn0.R-JHH-MkmyfF6s9r-hASQaNmp3Vo8spfIyysQFhbW4cOlY7cAV9iMN0tZh2n9uLaspEah7z9oVeOksunBlXlUmcMkhwvl5IGi9AQ6YcpXMHlUiMg6tZWQBfOHPZnF3Tm8ULzGjaVHqSZkLQu0HxtQ2Cmhqg-7S_PwdXuf34ro28
          await AfterMixinOauth(token)
          return;
        },
      },
    );
    load = false;
  };
</script>

<div class="flex items-center justify-between p-4 rounded-2xl mt-1">
  <div class="flex flex-col justify-center w-full">
    <!-- Title -->
    <div class="flex items-center space-x-1 opacity-60">
      <span class="text-sm font-normal">
        {$_('total_balance')}
      </span>
    </div>
  
    <!-- Amount -->
    <div class="flex items-end space-x-2 mt-2 pb-1 justify-between">
      <div class="flex items-end space-x-1">
        <span class="text-2xl font-extrabold  break-words max-w-[calc(100vw-98px-30px-32px-16px)]">
          *****
        </span>
      </div>
    </div>
  </div>
  <!-- Right -->
  <div class="">
    <button class="btn btn-sm h-[2.5rem] rounded-full bg-blue-500 hover:bg-blue-500 no-animation" on:click={()=>{auth(); load=true}}>
      <span class={clsx("mx-3 font-semibold text-sm text-base-100", load && "loading")}>{$_('connect')}</span>
    </button>
  </div>
</div>


<style>

</style>