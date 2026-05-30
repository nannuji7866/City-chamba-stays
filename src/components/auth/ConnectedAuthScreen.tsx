/**
 * ConnectedAuthScreen
 *
 * This file is the ONLY place Supabase auth calls are made for the auth flow.
 * It wraps the existing TravelAuthScreen UI without modifying a single pixel
 * of its design — it only injects real onClick handlers and manages an
 * email-entry + OTP-verification sub-flow using the existing
 * EmailVerificationScreen component.
 *
 * Layout:
 *   - Default view  → TravelAuthScreen (Google / Phone / Email buttons)
 *   - After "Continue with Email" → inline email input (no new UI file)
 *   - After email submitted → EmailVerificationScreen (OTP entry)
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TravelAuthScreen } from '@/components/generated/TravelAuthScreen';
import { EmailVerificationScreen } from '@/components/generated/EmailVerificationScreen';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Small helper — primary accent matches TravelAuthScreen
// ---------------------------------------------------------------------------
const ACCENT = '#FF385C';
const FONT = "'Inter', -apple-system, sans-serif";

// ---------------------------------------------------------------------------
// Inline email input view
// Matches the visual language of TravelAuthScreen exactly (same font, same
// rounding, same shadow) — no new design tokens introduced.
// ---------------------------------------------------------------------------
const EmailEntryView: React.FC<{
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
  error: string | null;
}> = ({ onSubmit, onBack, error }) => {
  const [email, setEmail] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    await onSubmit(email.trim());
    setBusy(false);
  };

  return (
    <main
      className="flex flex-col w-full min-h-screen bg-white text-black overflow-x-hidden"
      style={{ fontFamily: FONT }}
    >
      {/* Top bar — same height as TravelAuthScreen hero */}
      <section className="relative w-full h-[45%] flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FFB7B7] via-[#FFD1A9] to-[#FFF1D0]"
          initial={{ scale: 1 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center space-y-3"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Mail className="w-7 h-7" style={{ color: ACCENT }} />
          </div>
          <p className="text-black/70 text-[16px] font-medium text-center">
            Enter your email to continue
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="flex-1 px-8 pt-10 pb-12 flex flex-col">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-[14px] font-medium text-black/60 hover:text-black transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h2 className="text-[22px] font-bold mb-8 text-[#1a1a1a]">Your email</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            className={cn(
              'w-full h-[56px] rounded-2xl px-5 text-[16px] outline-none transition-all',
              'border bg-white',
              error
                ? 'border-red-400 focus:border-red-400'
                : 'border-gray-200 focus:border-black',
              'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
            )}
            style={{ fontFamily: FONT }}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[13px] text-red-500 px-1"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={busy || !email.trim()}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'w-full h-[56px] rounded-2xl text-[16px] font-semibold transition-all',
              'flex items-center justify-center gap-2',
              'bg-[#1a1a1a] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {busy ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Send OTP'
            )}
          </motion.button>
        </form>

        <footer className="mt-auto pt-12 text-center">
          <p className="text-[11px] leading-relaxed text-gray-400 max-w-[280px] mx-auto">
            We'll send a one-time code to this email. No password needed.
          </p>
        </footer>
      </section>
    </main>
  );
};

// ---------------------------------------------------------------------------
// OTP verify wrapper — re-uses EmailVerificationScreen but intercepts the
// completion callback to call Supabase verifyOtp.
// ---------------------------------------------------------------------------

// EmailVerificationScreen doesn't accept props in the original file.
// We create a thin wrapper that overlays an invisible interceptor layer.
// Rather than modifying the component, we replicate ONLY the functional OTP
// entry using the same visual shell but wired to Supabase.

const OtpVerifyView: React.FC<{
  email: string;
  onVerified: () => void;
  onBack: () => void;
}> = ({ email, onVerified, onBack }) => {
  const { verifyEmailOtp } = useAuth();
  const [otp, setOtp] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(60);
  const { sendEmailOtp } = useAuth();
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const OTP_LENGTH = 6;

  // Countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const chars = otp.split('');
    chars[idx] = val.slice(-1);
    const next = chars.join('').padEnd(OTP_LENGTH, '').slice(0, OTP_LENGTH);
    setOtp(next);
    setError(null);
    if (val && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
    // Auto-submit when complete
    if (next.replace(/\s/g, '').length === OTP_LENGTH && val) {
      handleVerify(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (code = otp) => {
    const trimmed = code.replace(/\s/g, '');
    if (trimmed.length < OTP_LENGTH) return;
    setBusy(true);
    setError(null);
    const { error: err } = await verifyEmailOtp(email, trimmed);
    if (err) {
      setError(err);
      setBusy(false);
    } else {
      onVerified();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await sendEmailOtp(email);
    setResendCooldown(60);
    setOtp('');
  };

  return (
    <main
      className="flex flex-col w-full min-h-screen bg-white text-black overflow-x-hidden"
      style={{ fontFamily: FONT }}
    >
      {/* Hero — mirrors TravelAuthScreen proportions */}
      <section className="relative w-full h-[45%] flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FFB7B7] via-[#FFD1A9] to-[#FFF1D0]"
          initial={{ scale: 1 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center space-y-3"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Mail className="w-7 h-7" style={{ color: ACCENT }} />
          </motion.div>
          <p className="text-black/70 text-[16px] font-medium text-center px-8">
            Check your inbox
          </p>
          <p className="text-black/50 text-[13px] text-center">
            {email}
          </p>
        </motion.div>
      </section>

      {/* OTP inputs */}
      <section className="flex-1 px-8 pt-10 pb-12 flex flex-col">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-[14px] font-medium text-black/60 hover:text-black transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h2 className="text-[22px] font-bold mb-2 text-[#1a1a1a]">Enter your code</h2>
        <p className="text-[14px] text-gray-400 mb-8">6-digit code sent to your email</p>

        {/* OTP boxes */}
        <div className="flex gap-3 justify-center mb-6">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i] ?? ''}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className={cn(
                'w-[46px] h-[56px] rounded-xl text-center text-[22px] font-bold outline-none',
                'border transition-all',
                error
                  ? 'border-red-400 bg-red-50'
                  : otp[i]
                    ? 'border-black bg-white'
                    : 'border-gray-200 bg-white focus:border-black',
                'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
              )}
              style={{ fontFamily: FONT }}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[13px] text-red-500 text-center mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => handleVerify()}
          disabled={busy || otp.replace(/\s/g, '').length < OTP_LENGTH}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'w-full h-[56px] rounded-2xl text-[16px] font-semibold transition-all',
            'flex items-center justify-center gap-2',
            'bg-[#1a1a1a] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
        </motion.button>

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="mt-6 text-[14px] font-medium text-center transition-colors disabled:text-gray-300"
          style={{ color: resendCooldown > 0 ? undefined : ACCENT }}
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : 'Resend code'}
        </button>
      </section>
    </main>
  );
};

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

type AuthView = 'main' | 'email-entry' | 'otp-verify';

interface ConnectedAuthScreenProps {
  /** Called after successful authentication so App.tsx can redirect */
  onAuthenticated: () => void;
}

export const ConnectedAuthScreen: React.FC<ConnectedAuthScreenProps> = ({
  onAuthenticated,
}) => {
  const { signInWithGoogle, sendEmailOtp } = useAuth();
  const [view, setView] = React.useState<AuthView>('main');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | null>(null);

  // ── Google handler ────────────────────────────────────────────────────────
  const handleGoogle = React.useCallback(async () => {
    await signInWithGoogle();
    // Page redirects away; nothing to do.
  }, [signInWithGoogle]);

  // ── Email flow — step 1 ───────────────────────────────────────────────────
  const handleEmailSubmit = React.useCallback(async (addr: string) => {
    setEmailError(null);
    const { error } = await sendEmailOtp(addr);
    if (error) {
      setEmailError(error);
    } else {
      setEmail(addr);
      setView('otp-verify');
    }
  }, [sendEmailOtp]);

  // ── OTP verified ──────────────────────────────────────────────────────────
  const handleVerified = React.useCallback(() => {
    onAuthenticated();
  }, [onAuthenticated]);

  // ── Inject onClick handlers into TravelAuthScreen via click-capture ───────
  // We place an invisible overlay that intercepts clicks on the three auth
  // buttons by matching their text content — this avoids any JSX modifications
  // to TravelAuthScreen.tsx itself.
  const handleAuthScreenClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button');
      if (!btn) return;
      const text = btn.textContent?.toLowerCase() ?? '';
      if (text.includes('google')) {
        e.stopPropagation();
        handleGoogle();
      } else if (text.includes('email')) {
        e.stopPropagation();
        setView('email-entry');
      } else if (text.includes('phone')) {
        // Phone / SMS OTP is not implemented in this iteration.
        // Supabase supports it — needs a Twilio/MessageBird integration key.
        e.stopPropagation();
        alert('Phone sign-in coming soon. Please use Email or Google for now.');
      }
    },
    [handleGoogle],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  if (view === 'email-entry') {
    return (
      <EmailEntryView
        onSubmit={handleEmailSubmit}
        onBack={() => { setEmailError(null); setView('main'); }}
        error={emailError}
      />
    );
  }

  if (view === 'otp-verify') {
    return (
      <OtpVerifyView
        email={email}
        onVerified={handleVerified}
        onBack={() => setView('email-entry')}
      />
    );
  }

  // Default: wrap TravelAuthScreen with click interceptor
  return (
    <div onClickCapture={handleAuthScreenClick}>
      <TravelAuthScreen />
    </div>
  );
};

