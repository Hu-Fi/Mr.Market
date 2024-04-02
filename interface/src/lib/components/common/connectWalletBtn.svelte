<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { mixinConnectLoading } from "$lib/stores/home";
  import { BOT_ID, OAUTH_SCOPE } from "$lib/helpers/constants";

  const auth = async () => {
    mixinConnectLoading.set(true);
    authorize(
      { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce: true },
      {
        onShowUrl: (url: string) => {
          window.open(url);
        },
        onError: (error: Error) => {
          console.error(error);
          mixinConnectLoading.set(false);
          return;
        },
        onSuccess: async (token: string) => {
          await AfterMixinOauth(token);
          mixinConnectLoading.set(false);
        },
      },
    );
  };

  export let clazz: string;
</script>

<button
  class={clsx("btn rounded-full no-animation", clazz)}
  on:click={async () => {
    await auth();
  }}
>
  <span
    class={clsx(
      "font-semibold",
      $mixinConnectLoading && "loading loading-xs mx-3",
    )}
  >
    {$_("connect_wallet")}
  </span>
</button>
