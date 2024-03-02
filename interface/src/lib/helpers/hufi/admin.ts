import { goto } from "$app/navigation";
import { HUFI_BACKEND_URL } from "../constants"
import type { AdminPasswordResp } from "$lib/types/hufi/admin"
import { submitted, checked, correct } from "$lib/stores/admin";

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


export const checkPassword = async (pass: string): Promise<boolean> => {
  if (!pass) {
    return false;
  }
  const r = await AdminPassword(pass)
  return r.result;
}

export const autoCheckPassword = async (): Promise<boolean> => {
  const pass = localStorage.getItem('admin-password')
  if (!pass) {
    return false
  }
  if (await checkPassword(pass)) {
    submitted.set(true);
    checked.set(true);
    correct.set(true);
    localStorage.setItem('admin-password', pass);
    goto('/manage/dashboard')
    return true;
  }
  submitted.set(true);
  checked.set(true);
  correct.set(false);
  return false;
}

export const exit = () => {
  submitted.set(false);
  checked.set(false);
  correct.set(false);
  localStorage.removeItem('admin-password')
  goto('/manage/login')
}