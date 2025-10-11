import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// OTP Email Service using Supabase Auth
export const sendOTPEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Method 1: Try signInWithOtp without emailRedirectTo (should send OTP)
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        // No emailRedirectTo = OTP code instead of magic link
        data: {
          email_verified: false,
        }
      }
    });

    if (error) {
      console.error('Error sending OTP:', error);
      
      // Handle specific rate limit error
      if (error.message.includes('rate limit exceeded') || error.message.includes('429')) {
        return { 
          success: false, 
          error: 'Too many email requests. Please wait 5-10 minutes before trying again. This is a Supabase server limit to prevent spam.' 
        };
      }
      
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    
    // Handle rate limit errors in catch block too
    if (error?.message?.includes('rate limit exceeded') || error?.status === 429) {
      return { 
        success: false, 
        error: 'Too many email requests. Please wait 5-10 minutes before trying again. This is a Supabase server limit to prevent spam.' 
      };
    }
    
    return { success: false, error: 'Failed to send OTP' };
  }
};

// Verify OTP using Supabase Auth
export const verifyOTP = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email'
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log(`✅ OTP verified successfully for ${email}`);
      return { success: true };
    }

    return { success: false, error: 'Verification failed' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'Failed to verify OTP' };
  }
};