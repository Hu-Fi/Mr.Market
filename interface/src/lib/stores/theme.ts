import { derived, writable } from "svelte/store"

// light, dark
export let theme = writable('light')

export let showSettingShortcut= writable(false)


export const detectSystemDark = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.set('dark')
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    theme.set(e.matches ? "dark" : "light");
  });
}