<script>
  import { _ } from "svelte-i18n";
  import dropInTheWater from '$lib/images/drop-in-the-water-iilustration.png';
</script>

<div class="h-[30vh] mt-4 flex flex-col space-y-3 p-4 rounded-lg text-center text-base-content justify-center items-center">
  <span class="text-3xl font-extralight">
    {$_('market_making_slogan_1')}
  </span>
  <span class="text-sm font-semibold text-base-content/60">
    {$_('market_making_slogan_2')}
  </span>
</div>

<div class="my-0 mb-12 h-[30vh] flex justify-center items-center text-base-content/40">
  <img src={dropInTheWater} alt="A drop in the water" class="h-full" />
</div>