/**
 * Utility functions for wallet address generation and management
 */

/**
 * Generates a unique 16-character crypto-style wallet address
 * Uses hexadecimal format to mimic real crypto wallet addresses
 * @returns A 16-character hexadecimal wallet address
 */
export function generateWalletAddress(): string {
  const hexChars = '0123456789ABCDEF';
  
  // Generate 16 random hexadecimal characters
  let address = '';
  for (let i = 0; i < 16; i++) {
    address += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  
  return address;
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
  
  // Check if all characters are hexadecimal
  const validChars = /^[0-9A-F]+$/;
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