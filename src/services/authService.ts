import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  validateEmail, 
  validatePassword, 
  validateOTP, 
  otpRateLimiter, 
  clearAuthSession,
  setSecureSessionItem,
  getSecureSessionItem,
  sanitizeInput,
  sanitizeErrorMessage
} from '../utils/security';
import { generateWalletAddress } from '../utils/walletUtils';

export interface UserData {
  email: string;
  createdAt: any;
  lastLogin: any;
  walletAddress: string;
  seedPhraseVerified?: boolean;
  registrationStep?: 'email' | 'otp' | 'password' | 'seed_phrase' | 'completed';
}

export interface AuthFlowResult {
  success: boolean;
  step: 'login' | 'register' | 'otp' | 'password' | 'seed_phrase' | 'completed';
  message?: string;
  user?: User;
}

// Check if user exists in Firestore
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'itm', email));
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

// Create new user in Authentication and Firestore
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore 'itm' collection
    const userData: UserData = {
      email: email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      walletAddress: generateWalletAddress()
    };

    await setDoc(doc(db, 'itm', email), userData);
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in existing user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    // Sanitize and validate inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    const emailValidation = validateEmail(sanitizedEmail);
    const passwordValidation = validatePassword(sanitizedPassword);
    
    if (!emailValidation.isValid) {
      throw new Error(sanitizeErrorMessage(emailValidation.error || 'Invalid email format.'));
    }
    
    if (!passwordValidation.isValid) {
      throw new Error(sanitizeErrorMessage(passwordValidation.error || 'Invalid password format.'));
    }

    const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword);
    const user = userCredential.user;

    // Update last login time
    await setDoc(doc(db, 'itm', sanitizedEmail), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    // Clear any existing auth session data
    clearAuthSession();

    return user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// Sign out user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (email: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'itm', email));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Enhanced authentication flow - determines next step based on email
export const initiateAuthFlow = async (email: string): Promise<AuthFlowResult> => {
  try {
    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    
    if (!emailValidation.isValid) {
      return {
        success: false,
        step: 'register',
        message: sanitizeErrorMessage(emailValidation.error || 'Invalid email format.')
      };
    }

    const userExists = await checkUserExists(sanitizedEmail);
    
    if (userExists) {
      // User exists, proceed to password login
      setSecureSessionItem('authEmail', sanitizedEmail);
      return {
        success: true,
        step: 'login',
        message: 'User found. Please enter your password.'
      };
    } else {
      // Rate limit OTP requests client-side (server should also enforce)
      const rateCheck = otpRateLimiter.canMakeRequest(sanitizedEmail);
      if (!rateCheck.allowed) {
        return {
          success: false,
          step: 'register',
          message: sanitizeErrorMessage(rateCheck.error || 'Please wait before requesting another OTP.')
        };
      }

      // New user, send OTP via local SMTP service
      const otpResult = await sendOTPEmail(sanitizedEmail);
      if (otpResult.success) {
        setSecureSessionItem('authEmail', sanitizedEmail);
        setSecureSessionItem('registrationStep', 'otp');
        return {
          success: true,
          step: 'otp',
          message: 'Verification code sent to your email.'
        };
      } else {
        return {
          success: false,
          step: 'register',
          message: sanitizeErrorMessage(otpResult.error || 'Failed to send verification code.')
        };
      }
    }
  } catch (error) {
    console.error('Error in auth flow:', error);
    return {
      success: false,
      step: 'register',
      message: 'An error occurred. Please try again.'
    };
  }
};

// Verify OTP and proceed to password setup
export const verifyOTPAndProceed = async (email: string, otp: string): Promise<AuthFlowResult> => {
  try {
    // Sanitize and validate inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedOTP = sanitizeInput(otp);
    
    const emailValidation = validateEmail(sanitizedEmail);
    const otpValidation = validateOTP(sanitizedOTP);
    
    if (!emailValidation.isValid) {
      return {
        success: false,
        step: 'otp',
        message: sanitizeErrorMessage(emailValidation.error || 'Invalid email format.')
      };
    }
    
    if (!otpValidation.isValid) {
      return {
        success: false,
        step: 'otp',
        message: sanitizeErrorMessage(otpValidation.error || 'Invalid OTP format.')
      };
    }

    const verificationResult = await verifyOTP(sanitizedEmail, sanitizedOTP);
    if (verificationResult.success) {
      setSecureSessionItem('otpVerified', sanitizedEmail);
      setSecureSessionItem('registrationStep', 'password');
      return {
        success: true,
        step: 'password',
        message: 'Email verified successfully. Please set your password.'
      };
    } else {
      return {
        success: false,
        step: 'otp',
        message: sanitizeErrorMessage(verificationResult.error || 'Invalid verification code.')
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      step: 'otp',
      message: 'Verification failed. Please try again.'
    };
  }
};

// Set password after OTP verification
export const setPasswordAfterOTP = async (email: string, password: string): Promise<AuthFlowResult> => {
  try {
    // Sanitize and validate inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    const emailValidation = validateEmail(sanitizedEmail);
    const passwordValidation = validatePassword(sanitizedPassword);

    if (!emailValidation.isValid) {
      return {
        success: false,
        step: 'password',
        message: sanitizeErrorMessage(emailValidation.error || 'Invalid email format.')
      };
    }

    if (!passwordValidation.isValid) {
      return {
        success: false,
        step: 'password',
        message: sanitizeErrorMessage(passwordValidation.error || 'Password does not meet requirements.')
      };
    }

    // Ensure OTP was verified
    const otpVerified = getSecureSessionItem('otpVerified');
    if (otpVerified !== sanitizedEmail) {
      return {
        success: false,
        step: 'otp',
        message: 'Please verify your email first.'
      };
    }

    // Store password temporarily for final registration (securely)
    setSecureSessionItem('tempPassword', sanitizedPassword);
    setSecureSessionItem('tempEmail', sanitizedEmail);
    setSecureSessionItem('registrationStep', 'seed_phrase');

    return {
      success: true,
      step: 'seed_phrase',
      message: 'Password set. Please save your seed phrase.'
    };
  } catch (error) {
    console.error('Error setting password:', error);
    return {
      success: false,
      step: 'password',
      message: 'Failed to set password. Please try again.'
    };
  }
};

// Complete registration after seed phrase verification
export const completeRegistration = async (): Promise<AuthFlowResult> => {
  try {
    // Check if seed phrase was verified using secure session storage
    const seedPhraseVerified = getSecureSessionItem('seedPhraseVerified');
    const tempEmail = getSecureSessionItem('tempEmail');
    const tempPassword = getSecureSessionItem('tempPassword');
    
    if (!seedPhraseVerified || !tempEmail || !tempPassword) {
      return {
        success: false,
        step: 'seed_phrase',
        message: 'Please complete all verification steps.'
      };
    }

    // Validate stored data
    const emailValidation = validateEmail(tempEmail);
    const passwordValidation = validatePassword(tempPassword);
    
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      clearAuthSession();
      return {
        success: false,
        step: 'register',
        message: 'Invalid registration data. Please start over.'
      };
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, tempPassword);
    const user = userCredential.user;

    // Create user document in Firestore with enhanced data
    const userData: UserData = {
      email: tempEmail,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      walletAddress: generateWalletAddress(),
      seedPhraseVerified: true,
      registrationStep: 'completed'
    };

    await setDoc(doc(db, 'itm', tempEmail), userData);
    
    // Clean up session storage securely
    clearAuthSession();
    
    return {
      success: true,
      step: 'completed',
      message: 'Registration completed successfully!',
      user: user
    };
  } catch (error) {
    console.error('Error completing registration:', error);
    // Clean up on error
    clearAuthSession();
    return {
      success: false,
      step: 'seed_phrase',
      message: sanitizeErrorMessage('Registration failed. Please try again.')
    };
  }
};

// Resend OTP via local SMTP service
export const resendOTP = async (email: string): Promise<AuthFlowResult> => {
  try {
    const otpResult = await sendOTPEmail(email);
    if (otpResult.success) {
      return {
        success: true,
        step: 'otp',
        message: 'New verification code sent to your email.'
      };
    } else {
      return {
        success: false,
        step: 'otp',
        message: otpResult.error || 'Failed to resend verification code.'
      };
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
    return {
      success: false,
      step: 'otp',
      message: 'Failed to resend code. Please try again.'
    };
  }
};

// Local OTP API helpers
const OTP_API_BASE = (import.meta as any).env?.VITE_OTP_API_BASE || 'http://localhost:8000';

const sendOTPEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${OTP_API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || 'Failed to send OTP' };
    }
    return { success: Boolean(json.success) };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Network error sending OTP' };
  }
};

const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${OTP_API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || 'Failed to verify OTP' };
    }
    return { success: Boolean(json.success) };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Network error verifying OTP' };
  }
};