/**
 * Utility functions for wallet address generation and management
 */

/**
 * Generates a unique 16-character wallet address
 * Uses a combination of timestamp, random characters, and checksum for uniqueness
 * @returns A 16-character alphanumeric wallet address
 */
export function generateWalletAddress(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Get timestamp-based component (4 chars)
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  
  // Generate random component (10 chars)
  let randomPart = '';
  for (let i = 0; i < 10; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Generate checksum (2 chars) based on timestamp and random part
  const combined = timestamp + randomPart;
  let checksum = 0;
  for (let i = 0; i < combined.length; i++) {
    checksum += combined.charCodeAt(i);
  }
  const checksumStr = (checksum % 1296).toString(36).toUpperCase().padStart(2, '0');
  
  return timestamp + randomPart + checksumStr;
}

/**
 * Validates if a wallet address has the correct format
 * @param address The wallet address to validate
 * @returns True if the address is valid, false otherwise
 */
export function isValidWalletAddress(address: string): boolean {
  // Check length
  if (address.length !== 16) {
    return false;
  }
  
  // Check if all characters are alphanumeric
  const validChars = /^[A-Z0-9]+$/;
  return validChars.test(address);
}

/**
 * Formats a wallet address for display (adds spacing for readability)
 * @param address The wallet address to format
 * @returns Formatted wallet address with spacing
 */
export function formatWalletAddress(address: string): string {
  if (!isValidWalletAddress(address)) {
    return address;
  }
  
  // Format as XXXX-XXXX-XXXX-XXXX
  return address.match(/.{1,4}/g)?.join('-') || address;
}