<script>
  import { assetDetailDialog } from '$lib/stores/wallet';
</script>

<div class="flex justify-end px-6">
  <button on:click={() => assetDetailDialog.set(false)}>
    <!-- Close Icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      /></svg
    >
  </button>
</div>