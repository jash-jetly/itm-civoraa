import React, { useState, useEffect } from 'react';
import { getSecureSessionItem, setSecureSessionItem } from '../utils/security';
import { getRandomWordPositions, verifySeedPhrase } from '../utils/seedPhrase';

interface SeedPhraseVerificationPageProps {
  onVerified?: () => void;
  onBack?: () => void;
}

const SeedPhraseVerificationPage: React.FC<SeedPhraseVerificationPageProps> = ({ onVerified, onBack }) => {
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [verificationPositions, setVerificationPositions] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get seed phrase from secure session storage
    const storedSeedPhrase = getSecureSessionItem('seedPhrase');
    if (!storedSeedPhrase) {
      if (onBack) onBack();
      return;
    }

    try {
      const parsedSeedPhrase = JSON.parse(storedSeedPhrase);
      setSeedPhrase(parsedSeedPhrase);
      
      // Generate random positions for verification
      const positions = getRandomWordPositions(parsedSeedPhrase.length);
      setVerificationPositions(positions);
      
      // Initialize user inputs
      const initialInputs: { [key: number]: string } = {};
      positions.forEach(pos => {
        initialInputs[pos] = '';
      });
      setUserInputs(initialInputs);
    } catch (error) {
      console.error('Error parsing seed phrase:', error);
      if (onBack) onBack();
    }
  }, [onBack]);

  const handleInputChange = (position: number, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [position]: value
    }));
    setError('');
  };

  const handleVerification = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Prepare verification data
      const verificationData = verificationPositions.map(position => ({
        position,
        word: userInputs[position]
      }));

      // Verify the seed phrase
      const isValid = verifySeedPhrase(seedPhrase, verificationData);

      if (isValid) {
        // Clear seed phrase from session storage for security
        sessionStorage.removeItem('seedPhrase');
        
        // Mark seed phrase as verified using secure session storage
        setSecureSessionItem('seedPhraseVerified', 'true');
        
        // Navigate to final registration step
        if (onVerified) onVerified();
      } else {
        setError('Incorrect words. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSeedPhrase = () => {
    if (onBack) onBack();
  };

  const isFormValid = verificationPositions.every(position => 
    userInputs[position]?.trim().length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Seed Phrase
          </h1>
          <p className="text-gray-600">
            Enter the requested words from your seed phrase to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-8">
          {verificationPositions.map((position) => (
            <div key={position}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word #{position}
              </label>
              <input
                type="text"
                value={userInputs[position] || ''}
                onChange={(e) => handleInputChange(position, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter word #${position}`}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleVerification}
            disabled={!isFormValid || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify Seed Phrase'}
          </button>

          <button
            onClick={handleBackToSeedPhrase}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Back to Seed Phrase
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Can't remember your seed phrase? Go back to view it again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseVerificationPage;