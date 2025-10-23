import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple AES-GCM E2EE helpers
export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new Uint8Array(salt), iterations: 100_000, hash: 'SHA-256' } as Pbkdf2Params,
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptJson(obj: unknown, passphrase: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKeyFromPassphrase(passphrase, salt);
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data));
  return btoa(JSON.stringify({ iv: Array.from(iv), salt: Array.from(salt), cipher: Array.from(cipher) }));
}

export async function decryptJson<T>(payloadB64: string, passphrase: string): Promise<T> {
  const { iv, salt, cipher } = JSON.parse(atob(payloadB64));
  const key = await deriveKeyFromPassphrase(passphrase, new Uint8Array(salt));
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, new Uint8Array(cipher));
  return JSON.parse(new TextDecoder().decode(new Uint8Array(plain)));
}
