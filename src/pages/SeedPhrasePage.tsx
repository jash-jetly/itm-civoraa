import { useState } from 'react';
import { Copy, CheckCircle, AlertTriangle } from 'lucide-react';

interface SeedPhrasePageProps {
  onContinue: () => void;
}

const SEED_PHRASE = [
  'abandon', 'ability', 'able', 'about',
  'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident'
];

export default function SeedPhrasePage({ onContinue }: SeedPhrasePageProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SEED_PHRASE.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(249,113,113,0.03)_25%,rgba(249,113,113,0.03)_50%,transparent_50%,transparent_75%,rgba(249,113,113,0.03)_75%,rgba(249,113,113,0.03))] bg-[length:60px_60px] animate-slide"></div>
      <div className="absolute inset-0 bg-gradient-radial from-[#9DA3AF]/5 via-transparent to-transparent opacity-50"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-[#F97171]" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Your Seed Phrase
          </h1>
          <p className="text-[#9DA3AF] text-sm leading-relaxed">
            Write this down and store it somewhere safe. You'll need it to recover your account.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#F97171]/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(249,113,113,0.15)]">
          <div className="grid grid-cols-3 gap-3">
            {SEED_PHRASE.map((word, index) => (
              <div
                key={index}
                className="bg-black/50 border border-[#1A1A1A] rounded-lg px-3 py-2.5 text-center"
              >
                <span className="text-[#9DA3AF] text-xs block mb-1">{index + 1}</span>
                <span className="text-white text-sm font-medium">{word}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-4 bg-[#F97171] hover:bg-[#F97171]/90 text-black font-semibold rounded-xl transition-all shadow-[0_0_30px_rgba(249,113,113,0.3)] hover:shadow-[0_0_40px_rgba(249,113,113,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy & Save
            </>
          )}
        </button>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded bg-[#0A0A0A] border-2 border-[#1A1A1A] checked:bg-[#F97171] checked:border-[#F97171] transition-all cursor-pointer"
            />
            <span className="text-[#9DA3AF] text-sm group-hover:text-white transition-colors">
              I have saved my seed phrase in a secure location
            </span>
          </label>

          <button
            onClick={onContinue}
            disabled={!confirmed}
            className="w-full py-4 bg-white hover:bg-white/90 disabled:bg-white/10 disabled:cursor-not-allowed text-black disabled:text-[#9DA3AF] font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            Continue to CIVORAA
          </button>
        </div>
      </div>
    </div>
  );
}
