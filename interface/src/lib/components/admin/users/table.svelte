<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import Loading from "$lib/components/common/loading.svelte";
  import { fetchAllUsers } from "$lib/helpers/hufi/admin/users";
  import SingleUser from "$lib/components/admin/users/singleUser.svelte";

  let users: {
    user_id: string;
    type: string;
    identity_number: string;
    phone: string;
    full_name: string;
    avatar_url: string;
    jwt_token: string;
    created_at: string;
    last_updated: string;
    contributions: unknown[];
    walletAddress?: string | null;
  }[] = [];
  let isLoading = true;
  let isError = false;
  let search = '';

  const fetchUsers = async () => {
    search = '';
    isLoading = true;
    isError = false;
    try {
      const token = localStorage.getItem('admin-access-token');
      if (token) {
        const res = await fetchAllUsers(token);
        if (!res.data) {
          isError = true;
          return;
        }
        users = res.data;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      isError = true;
    } finally {
      isLoading = false;
    }
  };

  $: filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(search.toLowerCase()) || 
    user.user_id.toLowerCase().includes(search.toLowerCase()) || 
    user.identity_number.toLowerCase().includes(search.toLowerCase())
  );

  onMount(fetchUsers);
</script>

<div class="flex">
  <div class="join border rounded-xl w-full">
    <button
      class="btn join-item btn-square border-none shadow-none no-animation focus:bg-base-100 bg-base-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </button>
    <input
      type="text"
      bind:value={search}
      placeholder='Search by user name, mixin id, user id'
      class="input join-item block w-full bg-base-100 border-l-0 pl-0 focus:outline-none focus:border-0"
    />
  </div>
</div>

{#if isLoading}
  <div class="flex flex-col space-y-4 justify-center items-center py-36">
    <Loading />
  </div>
{:else if isError}
  <div class="flex flex-col space-y-4 justify-center items-center py-36">
    <span class="opacity-60">
      {$_("error_loading_users")}
    </span>
    <button class="btn" on:click={fetchUsers}>
      {$_("retry")}
    </button>
  </div>
{:else if filteredUsers && filteredUsers.length > 0}
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>{$_("name")}</th>
          <th>{$_("last_update")}</th>
          <th>{$_("mixin_id")}</th>
          <th>{$_("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredUsers as user}
          <SingleUser {user} />
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="flex flex-col space-y-4 justify-center items-center py-36">
    <span class="opacity-60">
      {$_("no_result_found")}
    </span>
    <button class="btn" on:click={fetchUsers}>
      {$_("refresh")}
    </button>
  </div>
{/if}
