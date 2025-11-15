<script lang="ts">
  export let supportedTradingPairs = [];
</script>

<dialog id="mm_search_trading_pair" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box min-h-[40vh]">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click outside to close</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>