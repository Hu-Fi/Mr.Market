declare module 'svelte-cleavejs' {
  import type { Action } from 'svelte/action';

  export const cleave: Action<HTMLInputElement, any>;
}
