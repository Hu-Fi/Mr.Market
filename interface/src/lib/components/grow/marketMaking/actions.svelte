<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { easyAdvancedMode, mmEasyStep } from "$lib/stores/grow";
</script>

<!-- Market making easy mode -->
<div class="flex items-center justify-center space-x-6 mb-12">
  <button class="btn btn-sm px-4 rounded-3xl no-animation bg-base-100 hover:bg-base-100 text-base-content btn-outline border-base-content/20 hover:border-base-content/20 hover:text-base-content opacity-80" 
    on:click={()=>{
      if($easyAdvancedMode === 0 && $mmEasyStep === 0) { goto('/grow'); return}
      if($easyAdvancedMode === 0 && $mmEasyStep === 1) { mmEasyStep.set(0); return}
      history.back()
    }}
  > 
    {$_('back')}
  </button>

  <button class="btn btn-sm px-4 rounded-3xl no-animation bg-slate-800 focus:bg-slate-800 hover:bg-slate-800 text-base-100" 
    on:click={()=>{mmEasyStep.set(0)}}
  > 
    {$_('confirm')} 
  </button>
</div>
