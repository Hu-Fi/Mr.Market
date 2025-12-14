<script lang="ts">
  import { userSearch } from "$lib/stores/admin";
</script>

<div class="flex">
  <div class="join rounded-xl w-full">
    <button
      class="btn join-item btn-square border-none shadow-none no-animation focus:bg-base-100 bg-base-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </button>
    <input
      type="text"
      bind:value={$userSearch}
      placeholder="Search by user name, mixin id, user id"
      class="input join-item block w-full bg-base-100 border-l-0 pl-0 focus:outline-none focus:border-0"
    />
  </div>
</div>
