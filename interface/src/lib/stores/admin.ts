import { writable } from "svelte/store";

export const submitted = writable(false);
export const checked = writable(false);
export const correct = writable(false);
export const loginLoading = writable(false);