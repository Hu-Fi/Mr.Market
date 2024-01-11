<script lang="ts">
  import { _ } from "svelte-i18n"
</script>

<div class="join px-4 rounded-xl !mt-4 grid grid-cols-2">
  <button class="btn btn-md bg-slate-100 hover:bg-slate-200 focus:bg-slate-100 h-[2.5rem] min-h-[2.5rem] border-none join-item no-animation" on:click={()=>{}}>
    <span class="font-normal"> {$_("send")} </span>
  </button>

  <button class="btn btn-md bg-slate-100 hover:bg-slate-200 focus:bg-slate-100 h-[2.5rem] min-h-[2.5rem] border-none join-item no-animation" on:click={()=>{}}>
    <span class="font-normal"> {$_("receive")} </span>
  </button>
</div>