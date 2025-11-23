<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  const handleBack = () => {
    if ($page.url.pathname === "/market-making/hufi") {
      goto("/market-making");
    } else {
      goto("/market-making/hufi");
    }
  };
</script>

<header class="sticky top-0 z-10 bg-base-100">
  <div
    class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]"
  >
    <div class="flex items-center space-x-4 w-full px-4">
      <button on:click={() => handleBack()}>
        <!-- Chevron left Icon -->
        <svg
          class="w-7 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          /></svg
        >
      </button>
    </div>

    <div class="flex items-center space-x-4">
      <!-- <MixinMenu /> -->
    </div>
  </div>
</header>

<slot />
