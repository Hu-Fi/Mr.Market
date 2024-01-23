import { getMixinContext } from "$lib/helpers/mixin"
import { derived, get, writable } from "svelte/store"

// light, dark
export const theme = writable('light')
export const darkTheme = derived(theme, ($theme) => {return $theme != 'light'})
export const showSettingShortcut= writable(false)


export const detectSystemDark = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.set('dark')
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    theme.set(e.matches ? "dark" : "light");
  });
  const mixinContext = getMixinContext()
  if (!mixinContext) {
    return
  }
  if (mixinContext.appearance === 'dark') {
    theme.set('dark')
  }
}

export const toggleTheme = () => {
  switch(get(theme)) {
    case 'light': theme.set('dark'); break;
    case 'dark': theme.set('light'); break;
    default: theme.set('light'); break;
  }
}