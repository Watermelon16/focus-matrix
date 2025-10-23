// WebCrypto-based encryption vault for at-rest data encryption
// Supports passphrase-based key derivation (PBKDF2) and optional Passkey

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

interface EncryptedData {
  ciphertext: string; // base64
  iv: string; // base64
  salt?: string; // base64, only for passphrase-based
}

let cachedKey: CryptoKey | null = null;

export const vault = {
  /**
   * Initialize vault with passphrase
   */
  async initWithPassphrase(passphrase: string): Promise<void> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const key = await deriveKeyFromPassphrase(passphrase, salt);
    
    cachedKey = key;
    
    // Store salt in localStorage (not sensitive, needed for key derivation)
    localStorage.setItem('vault_salt', arrayBufferToBase64(salt));
    localStorage.setItem('vault_method', 'passphrase');
  },

  /**
   * Unlock vault with passphrase
   */
  async unlockWithPassphrase(passphrase: string): Promise<boolean> {
    const saltB64 = localStorage.getItem('vault_salt');
    if (!saltB64) return false;
    
    const salt = new Uint8Array(base64ToArrayBuffer(saltB64));
    const key = await deriveKeyFromPassphrase(passphrase, salt);
    
    cachedKey = key;
    return true;
  },

  /**
   * Check if vault is initialized
   */
  isInitialized(): boolean {
    return localStorage.getItem('vault_method') !== null;
  },

  /**
   * Check if vault is unlocked
   */
  isUnlocked(): boolean {
    return cachedKey !== null;
  },

  /**
   * Lock vault (clear cached key)
   */
  lock(): void {
    cachedKey = null;
  },

  /**
   * Encrypt record-level data
   */
  async encryptRecord(data: any): Promise<EncryptedData> {
    if (!cachedKey) throw new Error('Vault is locked');
    
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cachedKey,
      encoded
    );
    
    return {
      ciphertext: arrayBufferToBase64(ciphertext),
      iv: arrayBufferToBase64(iv),
    };
  },

  /**
   * Decrypt record-level data
   */
  async decryptRecord(encrypted: EncryptedData): Promise<any> {
    if (!cachedKey) throw new Error('Vault is locked');
    
    const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);
    const iv = base64ToArrayBuffer(encrypted.iv);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cachedKey,
      ciphertext
    );
    
    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
  },

  /**
   * Generate recovery code (base64 encoded key)
   */
  async exportRecoveryCode(): Promise<string> {
    if (!cachedKey) throw new Error('Vault is locked');
    
    const exported = await crypto.subtle.exportKey('raw', cachedKey);
    return arrayBufferToBase64(exported);
  },

  /**
   * Import recovery code
   */
  async importRecoveryCode(recoveryCode: string): Promise<void> {
    const keyData = base64ToArrayBuffer(recoveryCode);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
    
    cachedKey = key;
    localStorage.setItem('vault_method', 'recovery');
  },

  /**
   * Rotate encryption key (re-encrypt all data with new key)
   */
  async rotateKey(newPassphrase: string): Promise<void> {
    // This would require re-encrypting all tasks in IndexedDB
    // Implementation depends on app-level coordination
    throw new Error('Key rotation not yet implemented');
  },

  /**
   * Wipe all vault data
   */
  wipeVault(): void {
    cachedKey = null;
    localStorage.removeItem('vault_salt');
    localStorage.removeItem('vault_method');
  },
};

// Helper functions
async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

