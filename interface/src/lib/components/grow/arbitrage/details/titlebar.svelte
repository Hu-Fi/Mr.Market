<script lang="ts">
  import { _ } from "svelte-i18n";
  import PairIcon from "$lib/components/common/pairIcon.svelte";

  export let exchange0 = "";
  export let exchange1 = "";
  export let exchange0Icon = '';
  export let exchange1Icon = '';
</script>

<div class="flex items-center w-full justify-between p-6 mt-2 text-center bg-gray-100">
  <div class="flex flex-col m-auto space-y-2">
    <span class="text-xl font-bold t">
      {$_("exchange")}
    </span>
    <div class="m-auto">
      <PairIcon asset0Icon={exchange0Icon} asset1Icon={exchange1Icon} directionRight={false} clazz="w-9 h-9" rotate={false} />
    </div>
    <div class="flex items-center space-x-1 capitalize">
      <span class="text-xl font-bold">
        {exchange0} & {exchange1}
      </span>
    </div>
  </div>

</div>

<style>
    hr {
        border-top: 1px solid #eeeeee;
    }
    div.bg-gray-100 {
        background-color: #F8FAFC;
    }
</style>
