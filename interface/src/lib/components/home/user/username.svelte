<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { user } from "$lib/stores/wallet";  
  import { mixinConnected } from "$lib/stores/home";

  const ForDev = {"type": "user","user_id": "44d9717d-8cae-4004-98a1-f9ad544dcfb1","identity_number": "28865","phone": "","full_name": "Zed Wong","biography": "","avatar_url": "https://mixin-images.zeromesh.net/7RKXjQPvFDSiTXVP4EMyEHK2xDPEcgBM0ZlY-ft_8FxWgmFCAhumR9dtX-BYfwAJ5KtfOF1AujmPbyFC6ZX1l2d_ELwynAgu2-0F=s256","relationship": "ME","mute_until": "0001-01-01T00:00:00Z","created_at": "2017-11-28T08:05:49.959425563Z","is_verified": false,"is_scam": false,"is_deactivated": false,"code_id": "936cf51e-7e32-4f62-a4ff-83cfe1d09daa","code_url": "https://mixin.one/codes/936cf51e-7e32-4f62-a4ff-83cfe1d09daa","features": null,"has_safe": true,"session_id": "63348dc8-4077-4023-b6b5-b3aaba1e29c3","device_status": "ACTIVE","has_pin": true,"receive_message_source": "EVERYBODY","accept_conversation_source": "CONTACTS","accept_search_source": "NOBODY","fiat_currency": "USD","transfer_notification_threshold": 0.01,"transfer_confirmation_threshold": 1000000,"pin_token_base64": "","pin_token": "","salt_base64": "","tip_key_base64": "","tip_counter": 0,"spend_public_key": "","has_emergency_contact": false}
</script>

{#if $mixinConnected}
  <div class="flex items-center mx-6 space-x-4">
    <div class="avatar w-12 h-12 ">
      <img src={$user.avatar_url} alt="-" class="rounded-full" />
    </div>

    <div class="flex flex-col my-2 space-y-0">
      <div class="text-xl font-extrabold">
        <span> {$user.full_name} </span>
        <!-- {ForDev.full_name} -->
      </div>
      <div>
        <span class="text-xs !text-[11px] font-medium"> {$_('mixin_id', {values: {id: $user.identity_number} })} </span>
        <!-- ForDev.identity_number -->
      </div>
    </div>
  </div>
{/if}