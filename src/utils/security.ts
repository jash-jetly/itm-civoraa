// Security utilities for authentication flow

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (!email.endsWith('@isu.ac.in')) {
    return { isValid: false, error: 'Only ISU email addresses are allowed' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character (@$!%*?&)' };
  }
  
  return { isValid: true };
};

// OTP validation
export const validateOTP = (otp: string): { isValid: boolean; error?: string } => {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }
  
  if (otp.length !== 6) {
    return { isValid: false, error: 'OTP must be 6 digits' };
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: 'OTP must contain only numbers' };
  }
  
  return { isValid: true };
};

// Rate limiting for OTP requests
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 3; // Reduced from 5 to 3 to stay under Supabase limits
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly cooldownMs = 2 * 60 * 1000; // Increased from 1 to 2 minutes between requests

  canMakeRequest(identifier: string): { allowed: boolean; error?: string; retryAfter?: number } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return { allowed: true };
    }

    // Check if window has expired
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return { allowed: true };
    }

    // Check cooldown period
    if (now - record.lastAttempt < this.cooldownMs) {
      const retryAfter = Math.ceil((this.cooldownMs - (now - record.lastAttempt)) / 1000);
      return { 
        allowed: false, 
        error: `Please wait ${Math.ceil(retryAfter / 60)} minutes before requesting another OTP to avoid server rate limits`,
        retryAfter 
      };
    }

    // Check max attempts
    if (record.count >= this.maxAttempts) {
      const retryAfter = Math.ceil((this.windowMs - (now - record.lastAttempt)) / 1000 / 60);
      return { 
        allowed: false, 
        error: `Too many OTP requests. Please wait ${retryAfter} minutes to avoid hitting email rate limits`,
        retryAfter: retryAfter * 60 
      };
    }

    // Update record
    this.attempts.set(identifier, { count: record.count + 1, lastAttempt: now });
    return { allowed: true };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const otpRateLimiter = new RateLimiter();

// Session security
export const clearAuthSession = (): void => {
  const keysToRemove = [
    'registrationEmail',
    'otpVerified',
    'passwordSet',
    'seedPhrase',
    'seedPhraseVerified',
    'registrationStep'
  ];
  
  keysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
  });
};

// Secure session storage with expiration
export const setSecureSessionItem = (key: string, value: string, expirationMinutes: number = 30): void => {
  const item = {
    value,
    expiry: Date.now() + (expirationMinutes * 60 * 1000)
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};

export const getSecureSessionItem = (key: string): string | null => {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Error message sanitization (prevent XSS)
export const sanitizeErrorMessage = (message: string): string => {
  return message.replace(/[<>]/g, '').substring(0, 200);
};