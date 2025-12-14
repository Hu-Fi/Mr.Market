import type { PageLoad } from './$types';
import { getAllAPIKeys } from '$lib/helpers/hufi/admin/exchanges';
import { browser } from '$app/environment';

export const load: PageLoad = async () => {
  if (browser) {
    const token = localStorage.getItem('admin-access-token');
    if (token) {
      try {
        const apiKeys = await getAllAPIKeys(token);
        return {
          apiKeys,
        };
      } catch (e) {
        console.error('Failed to load API keys', e);
        return {
          apiKeys: []
        };
      }
    }
  }
  return {
    apiKeys: [],
  };
};
