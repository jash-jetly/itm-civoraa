// Alternative OTP service that bypasses Supabase rate limits
// This uses a mock/simulation approach for development

interface OTPResponse {
  success: boolean;
  error?: string;
  otp?: string; // For development only
}

// In-memory storage for development (replace with proper backend in production)
const otpStorage = new Map<string, { otp: string; timestamp: number; attempts: number }>();

// Generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP without rate limits (development mode)
export const sendOTPAlternative = async (email: string): Promise<OTPResponse> => {
  try {
    console.log('🚀 Alternative OTP Service - No Rate Limits');
    console.log('📧 Sending OTP to:', email);
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with timestamp
    otpStorage.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ OTP Generated:', otp); // For development only
    console.log('💡 In production, this would be sent via email');
    
    // Show OTP in browser alert for development
    if (typeof window !== 'undefined') {
      alert(`Development Mode: Your OTP is ${otp}`);
    }
    
    return { 
      success: true, 
      otp // Return OTP for development (remove in production)
    };
    
  } catch (error) {
    console.error('❌ Alternative OTP Service Error:', error);
    return { 
      success: false, 
      error: 'Failed to send OTP' 
    };
  }
};

// Verify OTP without rate limits
export const verifyOTPAlternative = async (email: string, inputOtp: string): Promise<OTPResponse> => {
  try {
    console.log('🔍 Verifying OTP for:', email);
    
    const stored = otpStorage.get(email);
    
    if (!stored) {
      return { 
        success: false, 
        error: 'No OTP found. Please request a new one.' 
      };
    }
    
    // Check if OTP is expired (10 minutes)
    const isExpired = Date.now() - stored.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      otpStorage.delete(email);
      return { 
        success: false, 
        error: 'OTP has expired. Please request a new one.' 
      };
    }
    
    // Increment attempts
    stored.attempts++;
    
    // Check attempts (allow unlimited for development)
    // if (stored.attempts > 5) {
    //   otpStorage.delete(email);
    //   return { 
    //     success: false, 
    //     error: 'Too many attempts. Please request a new OTP.' 
    //   };
    // }
    
    // Verify OTP
    if (stored.otp === inputOtp) {
      otpStorage.delete(email); // Clean up
      console.log('✅ OTP verified successfully');
      return { success: true };
    } else {
      console.log('❌ Invalid OTP');
      return { 
        success: false, 
        error: 'Invalid OTP. Please try again.' 
      };
    }
    
  } catch (error) {
    console.error('❌ OTP Verification Error:', error);
    return { 
      success: false, 
      error: 'Failed to verify OTP' 
    };
  }
};

// Clear all stored OTPs (for development)
export const clearAllOTPs = (): void => {
  otpStorage.clear();
  console.log('🧹 All OTPs cleared');
};

// Get stored OTP for debugging (development only)
export const getStoredOTP = (email: string): string | null => {
  const stored = otpStorage.get(email);
  return stored ? stored.otp : null;
};