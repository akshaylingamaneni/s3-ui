import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const IV_LENGTH = 16;
// Generate a 32-byte (256-bit) key from the environment variable
const ENCRYPTION_KEY = scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);

export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Return IV + encrypted data in base64
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function decrypt(text: string): Promise<string> {
  try {
    const [ivHex, encryptedHex] = text.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    
    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt');
  }
} 