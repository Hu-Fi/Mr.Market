import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

export const initi18n = async () => {
  register('en-US', () => import('./en.json'));
  register('zh-CN', () => import('./zh.json'));
  // register('zh-HK', () => import('.zh-HK/.json'));
  // register('fr', () => import('.fr/.json'));
  // register('es', () => import('.es/.json'));
  // register('de', () => import('.de/.json'));
  // register('ru', () => import('.ru/.json'));
  // register('ar', () => import('.ar/.json'));
  return await Promise.allSettled([
    init({
      fallbackLocale: 'en-US',
      initialLocale: getLocaleFromNavigator() || 'en-US',
    })
  ])
}

export const langs = [
  { name: "English", key: "en-US" },
  { name: "简体中文", key: "zh-CN" },
  { name: "繁體中文", key: "zh-HK" },
  { name: "français", key: "fr" },
  { name: "Deutsch", key: "de" },
  { name: "Español", key: "es" },
  { name: "ру́сский язы́к", key: "ru" },
  { name: "اَلْعَرَبِيَّةُ", key: "ar" },  
]

export const getNameByKey = (k: string): string => {
  switch (k) {
    case "en":
      return "English"
    case "zh":
      return "简体中文"
    case "zh_hk":
      return "繁體中文"
    case "fr":
      return "français"
    case "de":
      return "Deutsch"
    case "es":
      return "Español"
    case "ru":
      return "ру́сский язы́к"
    case "ar":
      return "اَلْعَرَبِيَّةُ"
    default:
      return "English"
  }
}