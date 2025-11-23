<script lang="ts">
  import { _ } from "svelte-i18n";

  export let campaign: {
    type: string;
    status: string;
    address: string;
    startDate: string;
    endDate: string;
    totalFundedAmount: string;
    amountPaid: string;
    oracleFees: string;
    targetLabel: string;
    targetValue: string;
    reservedFunds: string;
    campaignResults: string;
    exchange: string;
    symbol: string;
    symbolIcon: string;
  };

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  }
</script>

<div
  class="bg-base-100 rounded-2xl p-6 text-base-content w-full max-w-5xl mx-auto shadow-lg border border-base-300"
>
  <!-- Header -->
  <div
    class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center"
      >
        <!-- Cube Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-base-content/60"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold">Campaign Data</h2>
    </div>
    <button
      class="btn btn-ghost bg-base-200 hover:bg-base-300 normal-case text-base-content/70 font-normal px-6"
      >Sign in to Join Campaign</button
    >
  </div>

  <!-- Tags and Meta -->
  <div
    class="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-4 mb-8"
  >
    <div class="flex items-center gap-3">
      <span
        class="badge badge-primary text-primary-content px-4 py-3 rounded-lg font-medium text-sm"
        >{campaign.type}</span
      >
      <span
        class="badge badge-success text-success-content px-4 py-3 rounded-lg font-medium text-sm"
        >{campaign.status}</span
      >
    </div>

    <div
      class="flex flex-wrap items-center gap-4 md:gap-6 text-base-content/60 text-sm"
    >
      <div class="flex items-center gap-2">
        <span>{campaign.address}</span>
        <button
          class="hover:text-base-content"
          on:click={() => copyToClipboard(campaign.address)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
          </svg>
        </button>
        <button class="hover:text-base-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
        <span>{campaign.startDate} - {campaign.endDate}</span>
      </div>

      <button class="hover:text-base-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
      </button>
    </div>

    <button
      class="ml-auto btn btn-outline border-base-content/20 text-base-content/70 hover:bg-base-300 hover:text-base-content normal-case font-normal btn-sm h-9"
      >Paid Amount Chart</button
    >
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Funded Amount -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">
        Total Funded Amount
      </p>
      <p class="text-xl font-bold text-primary">
        {campaign.totalFundedAmount}
      </p>
    </div>

    <!-- Amount Paid -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">Amount Paid</p>
      <p class="text-xl font-bold text-primary">{campaign.amountPaid}</p>
    </div>

    <!-- Oracle Fees -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">Oracle Fees</p>
      <p class="text-xl font-bold text-primary">{campaign.oracleFees}</p>
    </div>

    <!-- Target -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">
        {campaign.targetLabel}
      </p>
      <p class="text-xl font-bold text-primary">{campaign.targetValue}</p>
    </div>

    <!-- Reserved Funds -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">
        Reserved Funds
      </p>
      <p class="text-xl font-bold text-primary">{campaign.reservedFunds}</p>
    </div>

    <!-- Campaign Results -->
    <div class="bg-base-200 p-5 rounded-xl relative">
      <div class="flex justify-between items-start">
        <p class="text-xs font-medium text-base-content/60 mb-3">
          Campaign Results
        </p>
        <button class="text-base-content/50 hover:text-base-content/80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full {campaign.campaignResults === 'N/A'
            ? 'bg-error'
            : 'bg-warning'}"
        ></span>
        <span class="text-lg font-medium text-base-content"
          >{campaign.campaignResults}</span
        >
        {#if campaign.campaignResults !== "N/A"}
          <button
            class="ml-auto text-base-content/50 hover:text-base-content/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </button>
        {/if}
      </div>
    </div>

    <!-- Exchange -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">Exchange</p>
      <p class="text-lg font-medium text-base-content">{campaign.exchange}</p>
    </div>

    <!-- Symbol -->
    <div class="bg-base-200 p-5 rounded-xl">
      <p class="text-xs font-medium text-base-content/60 mb-3">Symbol</p>
      <div class="flex items-center gap-2">
        <img
          src={campaign.symbolIcon}
          alt={campaign.symbol}
          class="w-6 h-6 rounded-full"
        />
        <p class="text-lg font-medium text-base-content">{campaign.symbol}</p>
      </div>
    </div>
  </div>
</div>
