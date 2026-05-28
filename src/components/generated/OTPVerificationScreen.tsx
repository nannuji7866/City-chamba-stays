import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isError?: boolean;
}

// --- Sub-components ---

/**
 * BackButton component for navigation
 */
const BackButton = ({
  onClick
}: {
  onClick?: () => void;
}) => <motion.button whileHover={{
  x: -4
}} whileTap={{
  scale: 0.95
}} onClick={onClick} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Go back">
    <ArrowLeft className="w-6 h-6 text-gray-900" />
  </motion.button>;

/**
 * OTPInput component handles the 6-digit entry with focus management and animations
 */
const OTPInput = ({
  length = 6,
  onComplete,
  isError
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    // Take the last char if multiple are entered (e.g. paste or autocomplete)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(data)) return;
    const newOtp = [...otp];
    data.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus last or next empty
    const nextIndex = data.length < length ? data.length : length - 1;
    inputRefs.current[nextIndex]?.focus();
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };
  return <div className="flex justify-between gap-2 mt-8">
      {otp.map((digit, index) => <motion.div key={index} initial={{
      scale: 0.8,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1,
      x: isError ? [0, -5, 5, -5, 5, 0] : 0
    }} transition={{
      delay: index * 0.05,
      duration: isError ? 0.4 : 0.3,
      type: 'spring',
      stiffness: 300
    }} className="relative">
          <input ref={el => {
        inputRefs.current[index] = el;
      }} type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={1} value={digit} onChange={e => handleChange(e, index)} onKeyDown={e => handleKeyDown(e, index)} onPaste={handlePaste} className={cn("w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none", digit ? "border-[#FF385C] scale-[1.05]" : "border-gray-200 focus:border-[#FF385C]", isError ? "border-red-500 text-red-500" : "text-gray-900")} />
          {/* Soft Glow ring for focused input */}
          <AnimatePresence>
            {digit === '' && index === otp.findIndex(d => d === '') && <motion.div layoutId="otp-glow" initial={{
          opacity: 0
        }} animate={{
          opacity: 0.15
        }} exit={{
          opacity: 0
        }} className="absolute inset-0 bg-[#FF385C] rounded-xl blur-md -z-10" />}
          </AnimatePresence>
        </motion.div>)}
    </div>;
};

/**
 * CountdownTimer logic
 */
const CountdownTimer = ({
  initialSeconds = 30,
  onResend
}: {
  initialSeconds?: number;
  onResend: () => void;
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);
  return <div className="flex flex-col items-center mt-6 h-10 justify-center">
      <AnimatePresence mode="wait">
        {seconds > 0 ? <motion.p key="countdown" initial={{
        opacity: 0,
        y: 5
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -5
      }} className="text-sm text-gray-500 font-medium">
            Resend code in <span className="text-gray-900 w-6 inline-block text-center">{seconds}s</span>
          </motion.p> : <motion.button key="resend" initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} whileTap={{
        scale: 0.95
      }} onClick={() => {
        setSeconds(initialSeconds);
        onResend();
      }} className="flex items-center gap-2 text-sm font-semibold text-[#FF385C] hover:underline">
            <RotateCcw className="w-4 h-4" />
            Resend OTP
          </motion.button>}
      </AnimatePresence>
    </div>;
};

// --- Main Screen ---

export const OTPVerificationScreen: React.FC = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const handleOTPComplete = (otp: string) => {
    // Basic verification simulation
    if (otp === '123456') {
      setIsComplete(true);
      setIsError(false);
    } else if (otp.length === 6) {
      setIsError(true);
      setTimeout(() => setIsError(false), 1500);
    }
  };
  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      // For demo purposes, we trigger complete if it was not an error
      if (!isError) setIsComplete(true);
    }, 1500);
  };
  return <div className="flex flex-col min-h-screen bg-white max-w-[402px] mx-auto shadow-2xl relative overflow-hidden font-['Inter',_sans-serif]">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <BackButton />
        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
           {/* Potential logo or avatar placeholder */}
           <span className="text-xs font-bold text-gray-400">LU</span>
        </div>
      </div>

      <div className="flex-1 px-8 pt-6 pb-12">
        {/* Header Section */}
        <div className="space-y-2 mb-10">
          <motion.h1 initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} className="text-3xl font-extrabold tracking-tight text-gray-900">
            Verify your number
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.1
        }} className="text-gray-500 text-base leading-relaxed">
            We sent a 6-digit code to <span className="text-gray-900 font-semibold">+91 98765 43210</span>
          </motion.p>
        </div>

        {/* Device Icon Visual */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <motion.div animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.2, 0.1]
          }} transition={{
            repeat: Infinity,
            duration: 3
          }} className="absolute inset-0 bg-[#FF385C] rounded-full blur-2xl -z-10" />
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-[#FF385C]" strokeWidth={1.5} />
            </div>
            {isComplete && <motion.div initial={{
            scale: 0,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>}
          </div>
        </div>

        {/* OTP Input Section */}
        <OTPInput onComplete={handleOTPComplete} isError={isError} />

        {/* Countdown */}
        <CountdownTimer onResend={() => console.log('Resending...')} />

        {/* CTA Button */}
        <div className="mt-auto pt-12 space-y-4">
          <motion.button whileTap={{
          scale: 0.98
        }} animate={isComplete ? {
          scale: [1, 1.03, 1]
        } : {}} disabled={!isComplete || isVerifying} onClick={handleVerify} className={cn("w-full py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-md active:shadow-sm", isComplete ? "bg-[#FF385C] hover:bg-[#E31C5F]" : "bg-gray-200 cursor-not-allowed", isVerifying && "opacity-80")}>
            {isVerifying ? <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </div> : "Verify"}
          </motion.button>
          
          <div className="flex justify-center">
            <button className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors">
              Try a different method
            </button>
          </div>
        </div>
      </div>

      {/* Decorative success sweep effect */}
      <AnimatePresence>
        {isComplete && <motion.div initial={{
        x: '-100%'
      }} animate={{
        x: '100%'
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.8,
        ease: "easeInOut"
      }} className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-green-400/20 to-transparent pointer-events-none -skew-x-12 z-20" />}
      </AnimatePresence>

      {/* Background visual flair */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#FF385C]/5 rounded-full blur-3xl pointer-events-none" />
    </div>;
};