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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#F97171]/5 via-transparent to-transparent opacity-30"></div>

      <div className="relative z-10 w-full max-w-2xl space-y-8 animate-fade-in">
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
          <h1 className="text-4xl font-bold tracking-tight">Save Your Seed Phrase</h1>
          <p className="text-[#9DA3AF] text-sm">Write down these 12 words and store them safely.</p>
        </div>

        {/* Security Warning */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-white">Important Security Notice</h3>
              <ul className="mt-2 text-xs text-[#9DA3AF] space-y-1 list-disc pl-5">
                <li>Never share your seed phrase with anyone</li>
                <li>Store it in a secure, offline location</li>
                <li>Anyone with these words can access your account</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seed Phrase Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Seed Phrase</h3>
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="text-sm text-[#F97171] hover:text-[#F97171]/80 font-medium"
            >
              {isRevealed ? 'Hide' : 'Reveal'} Words
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {seedPhrase.map((word, index) => (
              <div
                key={index}
                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 text-center"
              >
                <div className="text-xs text-[#9DA3AF] mb-2">{index + 1}</div>
                <div className="font-mono text-sm font-medium text-white">
                  {isRevealed ? word : '••••••'}
                </div>
              </div>
            ))}
          </div>

          {isRevealed && (
            <div className="flex justify-center">
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2 text-sm text-[#9DA3AF] hover:text-white border border-[#1A1A1A] rounded-xl px-3 py-2 hover:bg-[#0A0A0A] transition-colors"
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
        <label className="flex items-start gap-3 mt-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 text-[#F97171] focus:ring-[#F97171] border-[#1A1A1A] bg-[#0A0A0A] rounded"
            required
          />
          <span className="text-sm text-[#9DA3AF]">
            I have written down my seed phrase and stored it in a safe place. I understand that I will need these words to verify my account.
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!isRevealed}
          className="w-full mt-6 py-4 bg-[#F97171] hover:bg-[#F97171]/90 disabled:bg-[#F97171]/50 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] disabled:cursor-not-allowed"
        >
          Continue to Verification
        </button>

        <p className="text-[#9DA3AF]/60 text-xs text-center mt-4">
          Next, you'll be asked to verify some words from your seed phrase
        </p>
      </div>
    </div>
  );
};

export default SeedPhraseDisplayPage;