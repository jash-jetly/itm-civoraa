import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock OTP storage for development
const mockOTPs = new Map<string, { code: string; timestamp: number }>();

// OTP Email Service (Mock for development)
export const sendOTPEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with timestamp (expires in 5 minutes)
    mockOTPs.set(email, {
      code: otpCode,
      timestamp: Date.now()
    });

    // Log OTP for development (remove in production)
    console.log(`🔐 OTP for ${email}: ${otpCode}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Failed to send OTP' };
  }
};

// Verify OTP (Mock for development)
export const verifyOTP = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const storedOTP = mockOTPs.get(email);
    
    if (!storedOTP) {
      return { success: false, error: 'No OTP found for this email' };
    }

    // Check if OTP is expired (5 minutes)
    const isExpired = Date.now() - storedOTP.timestamp > 5 * 60 * 1000;
    if (isExpired) {
      mockOTPs.delete(email);
      return { success: false, error: 'OTP has expired' };
    }

    // Verify OTP code
    if (storedOTP.code !== token) {
      return { success: false, error: 'Invalid OTP code' };
    }

    // OTP is valid, remove it from storage
    mockOTPs.delete(email);
    console.log(`✅ OTP verified successfully for ${email}`);

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Failed to verify OTP' };
  }
};