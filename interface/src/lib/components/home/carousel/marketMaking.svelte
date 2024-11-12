<script>
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
</script>

<div class="carousel-item w-full flex h-36 space-x-0">
    <div class="flex items-center avatar px-6 pl-8">
        <div class="w-12 rounded-xl opacity-60">
            <svg
                class="w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><rect fill="none" height="24" width="24"></rect><path
                    d="M2,19.99l7.5-7.51l4,4l7.09-7.97L22,9.92l-8.5,9.56l-4-4l-6,6.01L2,19.99z M3.5,15.49l6-6.01l4,4L22,3.92l-1.41-1.41 l-7.09,7.97l-4-4L2,13.99L3.5,15.49z"
                ></path></svg
            >
        </div>
    </div>
    <div class="flex flex-col justify-between px-2">
        <div class="flex flex-col space-y-2 mt-2">
            <span class="text-xs mt-2 opacity-40">
                {$_("market_making")}
            </span>
            <span class="text-sm text-base-content/80 font-bold">
                {$_("market_making_intro_carousel")}
            </span>
        </div>
        <button
            class="btn btn-sm btn-outline border-base-300 hover:border-base-300 shadow-none no-animation hover:bg-base-100 hover:text-base-content focus:bg-base-100 rounded-full mb-2 w-1/2 text-base-content/80"
            on:click={() => {
                goto("/grow/market_making");
            }}
        >
            <span class="text-xs">{$_("start_now")}</span>
        </button>
    </div>
</div>
