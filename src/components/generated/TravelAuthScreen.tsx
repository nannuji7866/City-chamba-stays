import * as React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import contextImage2 from "@/assets/magicpath/context/02-context-image-2-a9d1eb600255.png";

// --- Components ---

interface AuthButtonProps {
  icon: React.ReactNode;
  label: string;
  variant?: "white" | "dark" | "outline";
  onClick?: () => void;
  index: number;
}
const AuthButton: React.FC<AuthButtonProps> = ({
  icon,
  label,
  variant = "white",
  onClick,
  index
}) => {
  const baseClasses = "flex items-center justify-center w-full h-[56px] rounded-2xl text-[16px] font-semibold transition-all duration-200 relative overflow-hidden active:scale-[0.97]";
  const variants = {
    white: "bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
    dark: "bg-[#1a1a1a] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
    outline: "bg-white text-black border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
  };
  return <motion.button initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.1 + index * 0.08,
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1]
  }} whileTap={{
    scale: 0.97
  }} onClick={onClick} className={cn(baseClasses, variants[variant])}>
      <div className="absolute left-6 flex items-center justify-center w-6 h-6">
        {icon}
      </div>
      <span className="flex-1 text-center pr-6 pl-12">{label}</span>
    </motion.button>;
};
export const TravelAuthScreen: React.FC = () => {
  // Constants
  const TAGLINE = "Your next adventure starts here";
  const PRIMARY_ACCENT = "#FF385C";
  return <main className="flex flex-col w-full h-full min-h-screen bg-white text-black font-['Inter',_sans-serif] overflow-x-hidden selection:bg-[#FF385C]/20">
      {/* Hero Section */}
      <section className="relative w-full h-[45%] flex flex-col items-center justify-center overflow-hidden">
        {/* Ken Burns Background Gradient */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-[#FFB7B7] via-[#FFD1A9] to-[#FFF1D0]" initial={{
        scale: 1
      }} animate={{
        scale: 1.04
      }} transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }} />
        
        {/* Subtle Overlay Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`
      }} />

        {/* Logo & Tagline */}
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-32 h-auto">
            <img src={contextImage2} alt="Lukas Logo" className="w-full h-auto object-contain drop-shadow-sm" />
          </div>
          <p className="text-black/70 text-[18px] font-medium tracking-tight px-8 text-center max-w-[280px]">
            {TAGLINE}
          </p>
        </motion.div>
      </section>

      {/* Auth Content Section */}
      <section className="flex-1 px-8 pt-10 pb-12 flex flex-col">
        <motion.h2 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }} className="text-[22px] font-bold mb-8 text-[#1a1a1a]">
          Continue with
        </motion.h2>

        <div className="flex flex-col space-y-4">
          {/* Google Button */}
          <AuthButton index={0} variant="white" label="Continue with Google" icon={<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>} />

          {/* Phone Button */}
          <AuthButton index={1} variant="dark" label="Continue with Phone" icon={<Phone className="w-5 h-5 text-white" />} />

          {/* Email Button */}
          <AuthButton index={2} variant="outline" label="Continue with Email" icon={<Mail className="w-5 h-5 text-gray-700" />} />
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-[1px] bg-gray-200" />
          <span className="px-4 text-[13px] font-medium text-gray-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        {/* Links */}
        <div className="flex flex-col items-center space-y-4 mb-auto">
          <button className="text-[15px] font-semibold text-[#1a1a1a] hover:underline transition-all">
            New here? <span style={{
            color: PRIMARY_ACCENT
          }}>Sign up</span>
          </button>
          <button className="text-[15px] font-semibold text-[#1a1a1a] hover:underline transition-all">
            Already have an account? <span style={{
            color: PRIMARY_ACCENT
          }}>Log in</span>
          </button>
        </div>

        {/* Footer Terms */}
        <footer className="mt-12 text-center">
          <p className="text-[11px] leading-relaxed text-gray-400 max-w-[280px] mx-auto">
            By continuing, you agree to our{" "}
            <a href="#" className="underline decoration-gray-300 hover:text-gray-600 transition-colors">Terms of Service</a> and{" "}
            <a href="#" className="underline decoration-gray-300 hover:text-gray-600 transition-colors">Privacy Policy</a>.
          </p>
        </footer>
      </section>

      {/* Decorative Floating Element (Premium Touch) */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1,
      duration: 1
    }} className="fixed top-8 right-8">
        <button className="p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/20 shadow-sm active:scale-95 transition-all">
           <ChevronRight className="w-5 h-5 text-black/60" />
        </button>
      </motion.div>
    </main>;
};