<script lang="ts">
  import { _ } from "svelte-i18n";
  import { formatTimestampToTime } from "$lib/helpers/utils";

  export let user: {
    user_id: string;
    type: string;
    identity_number: string;
    phone: string;
    full_name: string;
    avatar_url: string;
    jwt_token: string;
    created_at: string;
    last_updated: string;
    contributions: any[];
    walletAddress?: string | null;
  };
</script>

<tr>
  <th />
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="mask mask-squircle w-8 h-8">
          <img src={user.avatar_url} alt="" />
        </div>
      </div>
      <div>
        <div class="font-semibold">{user.full_name}</div>
        <div class="text-xs opacity-50">{user.identity_number}</div>
      </div>
    </div>
  </td>
  <td>
    {formatTimestampToTime(user.last_updated, true)}
  </td>
  <td>
    {user.identity_number}
  </td>
  <th>
    <div class="tooltip text-xs" data-tip={ $_("user_id") }>
      <button class="btn btn-ghost rounded-2xl btn-xs px-2" on:click={() => { navigator.clipboard.writeText(user.user_id) }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
        </svg>
      </button>
    </div>
  </th>
</tr>
