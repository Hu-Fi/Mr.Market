<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";

  const links = [
    {
      name: "exchanges",
      path: "/manage/settings/exchanges",
      // Bank/Building icon
      icon: "M2 21h20M2 21h20M4 21v-8m16 8v-8M6 13h12m-12 0V9.5a2.5 2.5 0 0 1 2.5-2.5h7a2.5 2.5 0 0 1 2.5 2.5V13m-12 0h12m-12 0-2-4h16l-2 4M12 3l-9 4h18l-9-4Z",
    },
    {
      name: "spot_trading",
      path: "/manage/settings/spot-trading",
      // Candlestick Chart icon
      icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
    },
    {
      name: "market_making",
      path: "/manage/settings/market-making",
      // Refresh/Cycle icon
      icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99",
    },
    {
      name: "fees",
      path: "/manage/settings/fees",
      // Percentage/Ticket icon
      icon: "M16.5 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM7.5 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5.25 5.25a3 3 0 0 1 3-3h10.5a3 3 0 0 1 3 3v10.5a3 3 0 0 1-3 3H13.5m-3-12L4.5 19.5",
    },
  ];
</script>

<div class="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
  <div class="flex flex-col space-y-2">
    <h1
      class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-fit"
    >
      {$_("settings")}
    </h1>
    <p class="text-base-content/60 text-lg">
      {$_("manage_your_application_configuration")}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each links as link}
      <a
        href={link.path}
        class="group relative overflow-hidden rounded-3xl bg-base-100 border border-base-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <!-- Decorative background blob -->
        <div
          class="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"
        ></div>

        <div class="p-8 flex items-start space-x-5 relative z-10">
          <div
            class="p-4 bg-base-200/50 backdrop-blur-sm rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-content transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={link.icon}
              />
            </svg>
          </div>
          <div class="space-y-2">
            <h2
              class="card-title text-xl font-bold group-hover:text-primary transition-colors duration-300"
            >
              {$_(link.name)}
            </h2>
            <p class="text-sm text-base-content/70 leading-relaxed font-medium">
              {$_(`manage_${link.name}`)}
            </p>
          </div>
        </div>
      </a>
    {/each}
  </div>
</div>
