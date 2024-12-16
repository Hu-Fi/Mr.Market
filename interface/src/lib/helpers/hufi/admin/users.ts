import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

export async function fetchAllUsers(token: string) {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/user/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
