<script lang="ts">
  export let icon = "more"
</script>

{#if icon === "spot"}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
  </svg>

{:else if icon === "swap"}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" stroke-width="1.5">
    <path fill="none" d="M0 0h24v24H0z"/>
    <path d="M19.375 15.103A8.001 8.001 0 0 0 8.03 5.053l-.992-1.737A9.996 9.996 0 0 1 17 3.34c4.49 2.592 6.21 8.142 4.117 12.77l1.342.774-4.165 2.214-.165-4.714 1.246.719zM4.625 8.897a8.001 8.001 0 0 0 11.345 10.05l.992 1.737A9.996 9.996 0 0 1 7 20.66C2.51 18.068.79 12.518 2.883 7.89L1.54 7.117l4.165-2.214.165 4.714-1.246-.719zm8.79 5.931L10.584 12l-2.828 2.828-1.414-1.414 4.243-4.242L13.414 12l2.829-2.828 1.414 1.414-4.243 4.242z"/>
  </svg>

{:else if icon === "earn"}
  <svg class="w-6 h-6" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 8.5C13.7193 8.29761 12.6344 8 11.7647 8C7.47636 8 4 10.6676 4 13.9583C4 15.8493 5.14794 17.5345 6.93824 18.6261L6.45318 20.2259C6.33635 20.6112 6.62471 21 7.02736 21H8.79147C8.92135 21 9.04773 20.9579 9.15161 20.8799L10.5462 19.8333H12.9831L14.3777 20.8799C14.4816 20.9579 14.608 21 14.7379 21H16.502C16.9046 21 17.193 20.6112 17.0761 20.2259L16.5911 18.6261C17.6577 17.9758 18.4963 17.1147 19 16.125" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M14.5 8.5L19 7L18.916 10.6283L21 11.5V15L19.0741 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M15.5 13C15.2239 13 15 12.7761 15 12.5C15 12.2239 15.2239 12 15.5 12C15.7761 12 16 12.2239 16 12.5C16 12.7761 15.7761 13 15.5 13Z" fill="black" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M2 10C2 10 2 12.4 4 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M12.8008 7.75296C12.9298 7.38131 13 6.98136 13 6.56472C13 4.59598 11.433 3 9.5 3C7.567 3 6 4.59598 6 6.56472C6 7.50638 6.35849 8.36275 6.94404 9" stroke="currentColor" stroke-linejoin="round"></path>
  </svg>

{:else if icon === "token"}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>

{:else if icon === 'candle_stick'}
  <svg class="w-6 h-6" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 16V14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 21V19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 13V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 8V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 13V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 5V3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 8.6V13.4C7 13.7314 6.73137 14 6.4 14H3.6C3.26863 14 3 13.7314 3 13.4V8.6C3 8.26863 3.26863 8 3.6 8H6.4C6.73137 8 7 8.26863 7 8.6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14 13.6V18.4C14 18.7314 13.7314 19 13.4 19H10.6C10.2686 19 10 18.7314 10 18.4V13.6C10 13.2686 10.2686 13 10.6 13H13.4C13.7314 13 14 13.2686 14 13.6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 5.6V10.4C21 10.7314 20.7314 11 20.4 11H17.6C17.2686 11 17 10.7314 17 10.4V5.6C17 5.26863 17.2686 5 17.6 5H20.4C20.7314 5 21 5.26863 21 5.6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>

{:else if icon === "arbitrage"}
  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 15.75C15.32 15.75 15.12 15.74 14.93 15.73C14.56 15.71 14.26 15.41 14.23 15.04C14.01 12.25 11.74 9.98999 8.95999 9.76999C8.58999 9.73999 8.28999 9.44001 8.26999 9.07001C8.25999 8.88001 8.25 8.69 8.25 8.5C8.25 4.5 11.5 1.25 15.5 1.25C19.5 1.25 22.75 4.5 22.75 8.5C22.75 12.5 19.5 15.75 15.5 15.75ZM9.75 8.35999C12.73 8.87999 15.12 11.27 15.64 14.25C18.75 14.17 21.25 11.63 21.25 8.5C21.25 5.33 18.67 2.75 15.5 2.75C12.38 2.75 9.83 5.24999 9.75 8.35999Z" fill="currentColor"/>
    <path d="M8.5 22.75C4.5 22.75 1.25 19.5 1.25 15.5C1.25 11.5 4.5 8.25 8.5 8.25C8.68 8.25 8.88001 8.25999 9.07001 8.26999C12.6 8.54999 15.46 11.41 15.73 14.92C15.74 15.12 15.75 15.31 15.75 15.5C15.75 19.5 12.5 22.75 8.5 22.75ZM8.5 9.75C5.33 9.75 2.75 12.33 2.75 15.5C2.75 18.67 5.33 21.25 8.5 21.25C11.67 21.25 14.25 18.67 14.25 15.5C14.25 15.34 14.24 15.18 14.23 15.03C14.01 12.26 11.75 9.98999 8.95999 9.76999C8.81999 9.75999 8.66 9.75 8.5 9.75Z" fill="currentColor"/>
    <path d="M3 7.34C2.77 7.34 2.54999 7.29999 2.32999 7.20999C1.66999 6.93999 1.25 6.3 1.25 5.59V3C1.25 2.04 2.04 1.25 3 1.25H5.59C6.3 1.25 6.92999 1.66999 7.20999 2.32999C7.47999 2.98999 7.32999 3.73999 6.82999 4.23999L4.23999 6.82999C3.89999 7.15999 3.46 7.34 3 7.34ZM3 2.75C2.86 2.75 2.75 2.86 2.75 3V5.59C2.75 5.74 2.84999 5.80001 2.89999 5.82001C2.95999 5.84001 3.07001 5.86999 3.17001 5.76999L5.76001 3.17999C5.86001 3.07999 5.84 2.97 5.81 2.91C5.78 2.85 5.71999 2.76001 5.57999 2.76001H3V2.75Z" fill="currentColor"/>
    <path d="M20.9988 22.7501H18.4088C17.6988 22.7501 17.0689 22.3301 16.7889 21.6701C16.5189 21.0101 16.6689 20.2601 17.1689 19.7601L19.7589 17.1701C20.2589 16.6701 21.0089 16.5201 21.6689 16.7901C22.3289 17.0601 22.7488 17.7001 22.7488 18.4101V21.0001C22.7488 21.9601 21.9588 22.7501 20.9988 22.7501ZM20.9888 18.1601C20.9388 18.1601 20.8788 18.1801 20.8188 18.2401L18.2289 20.83C18.1289 20.93 18.1488 21.0401 18.1788 21.1001C18.2088 21.1601 18.2688 21.2501 18.4088 21.2501H20.9988C21.1388 21.2501 21.2488 21.1401 21.2488 21.0001V18.4101C21.2488 18.2601 21.1488 18.2001 21.0988 18.1801C21.0688 18.1701 21.0288 18.1601 20.9888 18.1601Z" fill="currentColor"/>
  </svg>

{:else if icon === "market_making"}
  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><rect fill="none" height="24" width="24"></rect><path d="M2,19.99l7.5-7.51l4,4l7.09-7.97L22,9.92l-8.5,9.56l-4-4l-6,6.01L2,19.99z M3.5,15.49l6-6.01l4,4L22,3.92l-1.41-1.41 l-7.09,7.97l-4-4L2,13.99L3.5,15.49z"></path></svg>

{:else if icon === 'auto_invest'}
  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M12,2A11,11,0,1,0,23,13,11,11,0,0,0,12,2Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,22ZM23.71,6.71a1,1,0,0,1-1.42,0l-5-5A1,1,0,0,1,18.71.29l5,5A1,1,0,0,1,23.71,6.71ZM1,7a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l5-5A1,1,0,0,1,6.71,1.71l-5,5A1,1,0,0,1,1,7Zm17,5a1,1,0,0,1,0,2H12a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0v5Z"/></g></g><script xmlns=""/></svg>

{:else if icon === "more"}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>

{:else if icon === "invite"}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
  </svg>

{:else if icon === "leverage"}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
  </svg>

{:else if icon === "loan"}
  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>

{:else if icon === "future"}
  <svg class="w-6 h-6" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 23L2.5 17.5V6.5L12 1L21.5 6.5V17.5L12 23ZM12 3.312L4.5 7.653V16.347L12 20.689L19.5 16.347V7.653L12 3.311V3.312ZM12 16C10.9395 15.997 9.92294 15.5759 9.171 14.828C8.02724 13.6839 7.68525 11.9635 8.30448 10.4689C8.92371 8.97436 10.3822 8 12 8C13.0603 8.00284 14.0765 8.42402 14.828 9.172C16.3895 10.734 16.3895 13.266 14.828 14.828C14.0764 15.5757 13.0602 15.9968 12 16ZM12 10C11.0458 9.9998 10.2244 10.6736 10.0381 11.6094C9.85175 12.5452 10.3524 13.4823 11.2339 13.8476C12.1153 14.2129 13.1321 13.9047 13.6623 13.1114C14.1926 12.3182 14.0886 11.2608 13.414 10.586C13.0398 10.2098 12.5307 9.99879 12 10Z" fill="currentColor"/>
  </svg>

{:else if icon === "trading_account"}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>

{:else if icon === 'question'}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>

{:else if icon === 'community'}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
  
{/if}