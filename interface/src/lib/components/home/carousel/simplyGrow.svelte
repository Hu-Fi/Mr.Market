<script>
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
</script>

<div class="carousel-item w-full flex h-36 space-x-0">
    <div class="flex items-center avatar px-6 pl-8">
        <div class="w-12 rounded-xl opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        </div>
    </div>
    <div class="flex flex-col justify-between px-2">
        <div class="flex flex-col space-y-2 mt-2">
            <span class="text-xs mt-2 opacity-40">
                {$_("just_grow")}
            </span>
            <span class="text-sm text-base-content/80 font-bold">
                {$_("just_grow_intro_carousel")}
            </span>
        </div>
        <button
            class="btn btn-sm btn-outline border-base-300 hover:border-base-300 shadow-none no-animation hover:bg-base-100 hover:text-base-content focus:bg-base-100 rounded-full mb-2 w-1/2 text-base-content/80"
            on:click={() => {
                goto("/grow/just_grow");
            }}
        >
            <span class="text-xs">{$_("start_now")}</span>
        </button>
    </div>
</div>
