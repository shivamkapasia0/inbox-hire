// Generate a secure encryption key
const generateKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};

// Get or create the encryption key
const getEncryptionKey = async () => {
  let key = localStorage.getItem('encryptionKey');
  if (!key) {
    const newKey = await generateKey();
    const exportedKey = await window.crypto.subtle.exportKey(
      "raw",
      newKey
    );
    key = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
    localStorage.setItem('encryptionKey', key);
  }
  
  const keyData = Uint8Array.from(atob(key), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

// Encrypt data
export const encrypt = async (data) => {
  try {
    const key = await getEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );

    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    return data;
  }
};

// Decrypt data
export const decrypt = async (encryptedData) => {
  try {
    const key = await getEncryptionKey();
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData;
  }
}; 