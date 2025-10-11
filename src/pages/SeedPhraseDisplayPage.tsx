import React, { useState, useEffect } from 'react';
import { generateSeedPhrase } from '../utils/seedPhrase';
import { setSecureSessionItem } from '../utils/security';

interface SeedPhraseDisplayPageProps {
  onSeedPhraseGenerated?: (seedPhrase: string[]) => void;
  onContinue?: () => void;
  onBack?: () => void;
}

const SeedPhraseDisplayPage: React.FC<SeedPhraseDisplayPageProps> = ({ onSeedPhraseGenerated, onContinue, onBack }) => {
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const phrase = generateSeedPhrase();
    setSeedPhrase(phrase);
    if (onSeedPhraseGenerated) {
      onSeedPhraseGenerated(phrase);
    }
  }, [onSeedPhraseGenerated]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase.join(' '));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleContinue = () => {
    if (seedPhrase.length > 0) {
      // Store seed phrase for verification using secure session storage
      setSecureSessionItem('seedPhrase', JSON.stringify(seedPhrase));
      if (onContinue) onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
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
            Save Your Seed Phrase
          </h1>
          <p className="text-gray-600">
            Write down these 12 words in order and store them safely. You'll need them to verify your account.
          </p>
        </div>

        {/* Security Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Security Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Never share your seed phrase with anyone</li>
                  <li>Store it in a secure, offline location</li>
                  <li>Anyone with access to these words can access your account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Seed Phrase Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Seed Phrase</h3>
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {isRevealed ? 'Hide' : 'Reveal'} Words
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {seedPhrase.map((word, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"
              >
                <div className="text-xs text-gray-500 mb-1">{index + 1}</div>
                <div className="font-mono text-sm font-medium text-gray-900">
                  {isRevealed ? word : '••••••'}
                </div>
              </div>
            ))}
          </div>

          {isRevealed && (
            <div className="flex justify-center">
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Confirmation Checkbox */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <span className="text-sm text-gray-700">
              I have written down my seed phrase and stored it in a safe place. I understand that I will need these words to verify my account.
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isRevealed}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Verification
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Next, you'll be asked to verify some words from your seed phrase
        </p>
      </div>
    </div>
  );
};

export default SeedPhraseDisplayPage;