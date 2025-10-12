import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showInputs, setShowInputs] = useState(false);

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
      
      // Generate random positions for verification (4 words)
      const positions = getRandomWordPositions(4);
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#F97171]/5 via-transparent to-transparent opacity-30"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        {/* Header with logos */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <img
            src="https://i.ibb.co/vCkSQZzF/Gemini-Generated-Image-z435qzz435qzz435.png"
            alt="CIVORAA Logo"
            className="w-20 h-20 rounded-2xl object-cover"
          />
          <div className="text-3xl font-bold text-[#9DA3AF]">×</div>
          <img
            src="https://formfees.com/wp-content/uploads/2021/12/ITM-Business-School-Logo.png"
            alt="ITM Logo"
            className="w-20 h-20 rounded-2xl object-cover bg-white p-2"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Verify Your Seed Phrase</h1>
          <p className="text-[#9DA3AF] text-sm">Enter the requested words from your seed phrase to continue</p>
        </div>

        {error && (
          <p className="text-[#F97171] text-xs mt-2 bg-[#F97171]/10 border border-[#F97171]/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-6 mt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Seed Phrase Words</span>
            <button
              type="button"
              onClick={() => setShowInputs(!showInputs)}
              className="flex items-center text-sm text-[#F97171] hover:text-[#F97171]/80 transition-colors"
            >
              {showInputs ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showInputs ? 'Hide' : 'Show'}
            </button>
          </div>
          {verificationPositions.map((position) => (
            <div key={position}>
              <label className="block text-sm text-[#9DA3AF] font-medium mb-2">
                Word #{position}
              </label>
              <input
                type={showInputs ? 'text' : 'password'}
                value={userInputs[position] || ''}
                onChange={(e) => handleInputChange(position, e.target.value)}
                placeholder={`Enter word #${position}`}
                autoComplete="off"
                spellCheck="false"
                className="w-full px-4 py-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-white placeholder-[#9DA3AF]/50 focus:outline-none focus:border-[#F97171]/50 focus:ring-2 focus:ring-[#F97171]/20"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4 mt-6">
          <button
            onClick={handleVerification}
            disabled={!isFormValid || isLoading}
            className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/50 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Seed Phrase'}
          </button>

          <button
            onClick={handleBackToSeedPhrase}
            className="w-full py-4 bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-[#0B0B0B] focus:outline-none"
          >
            Back to Seed Phrase
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#9DA3AF]/60 text-xs">Can't remember your seed phrase? Go back to view it again.</p>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseVerificationPage;