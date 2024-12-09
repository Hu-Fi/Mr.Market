<script>
  import { _ } from "svelte-i18n"

  const texts = [
    $_('finish_creating_intro_1'),
    $_('finish_creating_intro_2'),
  ]
</script>

<div class="flex flex-col space-y-2 mx-4">
  {#each texts as text}
    <div class="flex flex-row space-x-1 items-center mx-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 opacity-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>      
      <span class="text-xs !text-[10px] opacity-50">
        {text}
      </span>
    </div>
  {/each}
</div>