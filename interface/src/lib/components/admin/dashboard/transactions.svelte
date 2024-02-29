<script lang="ts">
  const txs = [
    {
      snapshot: '61164483-18e0-480f-a2c4-a153ca244b9d',
      timestamp: '2024-02-29',
      amount: 23351,
      type: 'spot_buy',
    }
  ]
</script>

<div class="w-full grid grid-cols-1 gap-4">
  <div class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">
          Latest Orders
        </h3>
        <span class="text-base font-normal text-gray-500"
          >This is a list of latest transactions</span
        >
      </div>
      <div class="flex-shrink-0">
        <a
          href="/manage/orders"
          class="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
          >View all</a
        >
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="overflow-x-auto rounded-lg">
        <div class="align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <!-- Table title -->
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transaction
                  </th>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date &amp; Time
                  </th>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                {#each txs as tx}
                  <tr>
                    <td
                      class="p-4 whitespace-nowrap text-sm font-normal text-gray-900"
                    >
                      {tx.snapshot}
                    </td>
                    <td
                      class="p-4 whitespace-nowrap text-sm font-normal text-gray-500"
                    >
                      {tx.timestamp}
                    </td>
                    <td
                      class="p-4 whitespace-nowrap text-sm font-semibold text-gray-900"
                    >
                      {tx.amount}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>