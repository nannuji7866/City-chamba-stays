import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, RefreshCw, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * EmailVerificationScreen
 * A high-end, elegant mobile email verification screen for a travel rental app.
 * Features:
 * - Satisfying OTP input animations
 * - Mail icon with a gentle float loop
 * - Countdown timer for resending
 * - Subtle haptic feedback animations (visual)
 */

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  status: 'idle' | 'success' | 'error';
}
const OTPInput = ({
  length = 6,
  onComplete,
  status
}: OTPInputProps) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (newCode.every(char => char !== '')) {
      onComplete(newCode.join(''));
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0
    },
    show: {
      scale: 1,
      opacity: 1
    }
  };
  const shakeVariants = {
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.4
      }
    }
  };
  return <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex justify-between gap-2 w-full max-w-sm px-4">
      {code.map((char, index) => <motion.div key={index} variants={itemVariants} animate={status === 'error' ? 'error' : ''} custom={index} className="relative">
          <motion.input ref={el => {
        inputsRef.current[index] = el;
      }} type="text" inputMode="numeric" maxLength={1} value={char} onChange={e => handleChange(e.target.value, index)} onKeyDown={e => handleKeyDown(e, index)} className={cn("w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none", char ? "border-[#FF385C] bg-white shadow-sm" : "border-gray-200 bg-gray-50", status === 'success' && "border-green-500 bg-green-50/30", status === 'error' && "border-red-500 bg-red-50/30")} animate={char ? {
        scale: [1, 1.05, 1]
      } : {}} transition={{
        type: "spring",
        stiffness: 300,
        damping: 15
      }} />
          {status === 'success' && <motion.div initial={{
        scaleX: 0
      }} animate={{
        scaleX: 1
      }} className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-xl" />}
        </motion.div>)}
    </motion.div>;
};
export const EmailVerificationScreen = () => {
  const [countdown, setCountdown] = useState(30);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);
  const handleComplete = (code: string) => {
    // Simulate verification
    if (code === '123456') {
      setStatus('success');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };
  const handleVerify = () => {
    setIsVerifying(true);
    // Mimic API call
    setTimeout(() => {
      setIsVerifying(false);
      handleComplete('123456'); // For demo, assume it's correct
    }, 1500);
  };
  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(30);
      setStatus('idle');
    }
  };
  return <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 font-sans max-w-[402px] mx-auto overflow-hidden">
      {/* Header */}
      <header className="w-full px-6 pt-12 pb-6 flex items-center">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
      </header>

      <main className="flex-1 w-full px-6 flex flex-col items-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="text-gray-500 text-base">
            <span>We sent a verification code to </span>
            <span className="font-semibold text-gray-900">user@email.com</span>
          </p>
        </motion.div>

        {/* Mail Icon with Float Animation */}
        <div className="mb-12 relative">
          <motion.div animate={{
          y: [0, -6, 0]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="w-24 h-24 bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl flex items-center justify-center shadow-lg shadow-pink-100/50 relative z-10">
            <Mail size={48} className="text-[#FF385C]" strokeWidth={1.5} />
          </motion.div>
          <div className="absolute inset-0 bg-[#FF385C]/5 blur-3xl rounded-full scale-150" />
        </div>

        {/* OTP Inputs */}
        <div className="w-full mb-8 flex justify-center">
          <OTPInput onComplete={handleComplete} status={status} />
        </div>

        {/* Countdown */}
        <div className="mb-12">
          {countdown > 0 ? <p className="text-gray-400 text-sm font-medium">
              <span>Resend email in </span>
              <span className="text-gray-700">{countdown}s</span>
            </p> : <button onClick={handleResend} className="text-[#FF385C] text-sm font-bold flex items-center gap-2 hover:underline">
              <RefreshCw size={14} />
              <span>Resend verification email</span>
            </button>}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 mt-auto pb-12">
          <motion.button whileTap={{
          scale: 0.98
        }} className="w-full py-4 px-6 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors relative overflow-hidden group">
            <Mail size={20} />
            <span>Open Email App</span>
            <div className="absolute inset-0 bg-gray-900/5 opacity-0 group-active:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button onClick={handleVerify} disabled={isVerifying || status === 'success'} animate={status === 'success' ? {
          scale: [1, 1.02, 1]
        } : {}} whileTap={{
          scale: 0.98
        }} className={cn("w-full py-4 px-6 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-pink-100 transition-all duration-300", status === 'success' ? "bg-green-500 shadow-green-100" : "bg-[#FF385C]")}>
            {isVerifying ? <RefreshCw className="animate-spin" size={20} /> : status === 'success' ? <span>Verified!</span> : <span>Verify Email</span>}
          </motion.button>

          <div className="flex flex-col items-center gap-4 pt-4">
            <button className="text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-2">
              <Smartphone size={16} />
              <span>Use phone number instead</span>
            </button>
            <p className="text-gray-400 text-xs text-center max-w-[240px]">
              Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>
        </div>
      </main>

      {/* Decorative background blurs */}
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-pink-50 rounded-full blur-[100px] -z-10 opacity-60" />
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-[100px] -z-10 opacity-60" />
    </div>;
};