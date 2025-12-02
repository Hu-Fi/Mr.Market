import { createHash } from "crypto";
import { goto } from "$app/navigation";
import { HUFI_BACKEND_URL } from "../constants"
import type { AdminPasswordResp } from "$lib/types/hufi/admin"
import { submitted, checked, correct } from "$lib/stores/admin";

export const AdminPassword = async (password: string): Promise<AdminPasswordResp> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during fetch:', error);
    throw error;
  }
};

export const checkPassword = async (pass: string): Promise<string> => {
  if (!pass) {
    return '';
  }
  try {
    const r: { access_token: string } = await AdminPassword(pass)
    return r.access_token;
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const autoCheckPassword = async (path: string = '/manage/dashboard'): Promise<boolean> => {
  const pass = localStorage.getItem('admin-password')
  if (!pass) {
    return false
  }
  const hashedAdminPassword = createHash("sha256").update(pass).digest("hex");
  const accessToken = await checkPassword(hashedAdminPassword);
  if (accessToken) {
    submitted.set(true);
    checked.set(true);
    correct.set(true);
    localStorage.setItem("admin-access-token", accessToken);
    goto(path);
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
  localStorage.removeItem('admin-access-token')
  goto('/manage')
}