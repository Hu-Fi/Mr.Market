<script>
    import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n"
</script>

<div class="flex flex-col grow mx-6 h-full justify-center items-center space-y-6 mb-24">
  <div class="border p-3.5 rounded-2xl border-slate-200">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  </div>

  <div class="font-bold">
    <span class="text-base font-bold">
      {$_('ready_to_grow_your_wealth')}
    </span>
  </div>
  <div>
    <button class="h-[40px] bg-slate-800 rounded-full no-animation hover:bg-slate-800" data-testid="create-new-just-grow" on:click={()=>goto('/grow/just_grow/new/one')}>
      <span class="text-slate-50 text-sm mx-4">
        {$_('create_just_grow')}
      </span>
    </button>
  </div>
</div>