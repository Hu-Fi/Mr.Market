import type { AdminPasswordResp } from "$lib/types/hufi/admin"
import { HUFI_BACKEND_URL } from "../constants"

export const AdminPassword = async (password: string): Promise<AdminPasswordResp> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during fetch:', error);
    throw error; // Or handle the error as appropriate for your application
  }
};
