import React, { useState, useEffect } from 'react';
import { completeRegistration } from '../services/authService';
import { clearAuthSession } from '../utils/security';

interface CompleteRegistrationPageProps {
  onComplete?: (email: string) => void;
  onRetry?: () => void;
  onStartOver?: () => void;
}

const CompleteRegistrationPage: React.FC<CompleteRegistrationPageProps> = ({ onComplete, onRetry, onStartOver }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleRegistrationCompletion = async () => {
      try {
        const result = await completeRegistration();
        
        if (result.success) {
          setSuccess(true);
          setIsLoading(false);
          
          // Auto-redirect after 3 seconds or call onComplete
          setTimeout(() => {
            if (onComplete && result.user) {
              onComplete(result.user.email || '');
            }
          }, 3000);
        } else {
          setError(result.message || 'Registration failed. Please try again.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Registration completion error:', error);
        setError('An error occurred during registration. Please try again.');
        setIsLoading(false);
        // Clear session on error
        clearAuthSession();
      }
    };

    handleRegistrationCompletion();
  }, [onComplete]);

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  const handleStartOver = () => {
    // Clear all session storage
    sessionStorage.clear();
    if (onStartOver) onStartOver();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          {/* Header with logos */}
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://i.ibb.co/vCkSQZzF/Gemini-Generated-Image-z435qzz435qzz435.png" 
              alt="CIVORAA" 
              className="w-20 h-20 rounded-lg object-cover"
            />
            <span className="text-3xl font-bold text-gray-400 mx-4">×</span>
            <img 
              src="https://formfees.com/wp-content/uploads/2021/12/ITM-Business-School-Logo.png" 
              alt="ITM" 
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Completing Registration
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          {/* Header with logos */}
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://i.ibb.co/vCkSQZzF/Gemini-Generated-Image-z435qzz435qzz435.png" 
              alt="CIVORAA" 
              className="w-20 h-20 rounded-lg object-cover"
            />
            <span className="text-3xl font-bold text-gray-400 mx-4">×</span>
            <img 
              src="https://formfees.com/wp-content/uploads/2021/12/ITM-Business-School-Logo.png" 
              alt="ITM" 
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="text-red-500">
              <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Registration Failed
            </h2>
            
            <p className="text-gray-600">
              {error}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-[#F97171] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#F97171]/80 focus:outline-none focus:ring-2 focus:ring-[#F97171] focus:ring-offset-2 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={handleStartOver}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          {/* Header with logos */}
          <div className="flex items-center justify-center mb-8">
            <img 
              src="https://i.ibb.co/vCkSQZzF/Gemini-Generated-Image-z435qzz435qzz435.png" 
              alt="CIVORAA" 
              className="w-20 h-20 rounded-lg object-cover"
            />
            <span className="text-3xl font-bold text-gray-400 mx-4">×</span>
            <img 
              src="https://formfees.com/wp-content/uploads/2021/12/ITM-Business-School-Logo.png" 
              alt="ITM" 
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="text-green-500">
              <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Registration Complete!
            </h2>
            
            <p className="text-gray-600">
              Your account has been successfully created and verified. Welcome to CIVORAA!
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Account Security Verified
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Email verified</li>
                      <li>Password set</li>
                      <li>Seed phrase confirmed</li>
                      <li>Account created in blockchain</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Redirecting to your dashboard in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CompleteRegistrationPage;