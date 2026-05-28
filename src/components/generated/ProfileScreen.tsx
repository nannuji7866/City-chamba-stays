import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, LogOut, Settings, CreditCard, ShieldCheck, History, Moon, UserCog, MessageCircle, BadgeCheck, Lock, Star, Zap, Trophy, Heart, MapPin, Globe, Shield, Award, Gem } from 'lucide-react';
const FONT = "'Roboto', -apple-system, sans-serif";
const XP_CURRENT = 3400;
const XP_NEXT_LEVEL = 5000;
const XP_PROGRESS = XP_CURRENT / XP_NEXT_LEVEL * 100;
const STREAK_DAYS = 18;
const STATS_DATA = [{
  id: 'trips',
  numericValue: 3,
  label: 'Trips',
  color: '#3B82F6',
  bg: 'rgba(59,130,246,0.10)'
}, {
  id: 'reviews',
  numericValue: 12,
  label: 'Reviews',
  color: '#F59E0B',
  bg: 'rgba(245,158,11,0.10)'
}, {
  id: 'saves',
  numericValue: 28,
  label: 'Saves',
  color: '#EF4444',
  bg: 'rgba(239,68,68,0.10)'
}];
const SETTINGS_LIST = [{
  id: 'account',
  icon: UserCog,
  label: 'Personal Information',
  iconBg: '#EEF2FF',
  iconColor: '#6366F1'
}, {
  id: 'payments',
  icon: CreditCard,
  label: 'Payments and Payouts',
  iconBg: '#F0FDF4',
  iconColor: '#22C55E'
}, {
  id: 'security',
  icon: ShieldCheck,
  label: 'Login & Security',
  iconBg: '#FFF7ED',
  iconColor: '#F97316'
}, {
  id: 'notifications',
  icon: Bell,
  label: 'Notifications',
  iconBg: '#FFF1F2',
  iconColor: '#EF4444'
}, {
  id: 'support',
  icon: MessageCircle,
  label: 'Get Support',
  iconBg: '#F0F9FF',
  iconColor: '#0EA5E9'
}];
const BADGES_DATA = [{
  id: 'trusted',
  label: 'Trusted Traveler',
  color: '#F59E0B',
  bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)',
  border: '#FCD34D',
  unlocked: true,
  tooltip: 'Verified by 5+ hosts'
}, {
  id: 'explorer',
  label: 'Explorer',
  color: '#3B82F6',
  bg: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)',
  border: '#93C5FD',
  unlocked: true,
  tooltip: 'Visited 3+ destinations'
}, {
  id: 'superhost',
  label: 'Top Reviewer',
  color: '#7C3AED',
  bg: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)',
  border: '#C4B5FD',
  unlocked: true,
  tooltip: 'Left 10+ helpful reviews'
}, {
  id: 'globetrotter',
  label: 'Globetrotter',
  color: '#0EA5E9',
  bg: 'linear-gradient(135deg,#E0F2FE,#BAE6FD)',
  border: '#7DD3FC',
  unlocked: false,
  tooltip: 'Visit 5 countries to unlock'
}, {
  id: 'centurion',
  label: 'Centurion',
  color: '#8B5CF6',
  bg: 'linear-gradient(135deg,#F3E8FF,#E9D5FF)',
  border: '#D8B4FE',
  unlocked: false,
  tooltip: 'Complete 100 nights to unlock'
}];
const GREETINGS = ['Ready for your next adventure? 🌍', 'Where to next? The world awaits! 🗺️', 'Your wanderlust is showing! ✨'];

// ─── Ripple Hook ──────────────────────────────────────────────────────────────
interface RippleState {
  id: number;
  x: number;
  y: number;
}
function useRipple() {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const trigger = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, {
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  }, []);
  return {
    ripples,
    trigger
  };
}

// ─── Count Up Hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = duration / 16;
    const inc = target / steps;
    const id = setInterval(() => {
      start += inc;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else {
        setVal(start);
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return Math.round(val).toString();
}

// ─── XP Ring ──────────────────────────────────────────────────────────────────
interface XpRingProps {
  size: number;
  stroke: number;
  progress: number;
  isDark: boolean;
}
const XpRing: React.FC<XpRingProps> = ({
  size,
  stroke,
  progress,
  isDark
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ * (1 - progress / 100)), 500);
    return () => clearTimeout(t);
  }, [progress, circ]);
  const id = 'xpGrad';
  return <svg width={size} height={size} style={{
    position: 'absolute',
    top: -(stroke / 2 + 4),
    left: -(stroke / 2 + 4),
    transform: 'rotate(-90deg)',
    pointerEvents: 'none'
  }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF385C" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FFB800" />
        </linearGradient>
        <filter id="xpGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} filter="url(#xpGlow)" style={{
      transition: 'stroke-dashoffset 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }} />
    </svg>;
};

// ─── Flame Icon ───────────────────────────────────────────────────────────────
const FlameIcon: React.FC<{
  size?: number;
}> = ({
  size = 32
}) => <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{
  animation: 'flameFlicker 0.9s ease-in-out infinite alternate',
  display: 'block'
}}>
    <defs>
      <radialGradient id="flameGrad" cx="50%" cy="80%" r="70%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="40%" stopColor="#FF7A00" />
        <stop offset="100%" stopColor="#FF385C" />
      </radialGradient>
      <radialGradient id="flameInner" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#FFFDE7" />
        <stop offset="100%" stopColor="#FFD600" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d="M16 2C16 2 11 10 11 16C11 18.8 12.2 20 14 20.5C13.5 19 14 16 16 14C16 18 19 20 19 22.5C21 21.5 22 19.5 22 17C22 12 18 6 16 2Z" fill="url(#flameGrad)" />
    <path d="M16 14C16 14 13 17.5 13 20C13 22.2 14.3 24 16 24C17.7 24 19 22.2 19 20C19 17.5 16 14 16 14Z" fill="#FFD600" />
    <path d="M16 17C16 17 14.5 19 14.5 20.5C14.5 21.9 15.2 23 16 23C16.8 23 17.5 21.9 17.5 20.5C17.5 19 16 17 16 17Z" fill="url(#flameInner)" />
  </svg>;

// ─── Streak Counter ───────────────────────────────────────────────────────────
interface StreakCounterProps {
  isDark: boolean;
}
const StreakCounter: React.FC<StreakCounterProps> = ({
  isDark
}) => {
  const streakVal = useCountUp(STREAK_DAYS, 1000);
  return <motion.div initial={{
    opacity: 0,
    scale: 0.7,
    y: 12
  }} animate={{
    opacity: 1,
    scale: 1,
    y: 0
  }} transition={{
    delay: 0.55,
    type: 'spring',
    stiffness: 300,
    damping: 18
  }} style={{
    background: isDark ? '#1C1C1E' : 'linear-gradient(135deg,#FFF7ED,#FFF3E0)',
    border: '1.5px solid rgba(255,122,0,0.25)',
    borderRadius: '20px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(255,122,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)'
  }}>
      <motion.div animate={{
      scale: [1, 1.12, 0.96, 1.05, 1]
    }} transition={{
      duration: 2.4,
      repeat: Infinity,
      ease: 'easeInOut'
    }}>
        <FlameIcon size={44} />
      </motion.div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1px'
    }}>
        <span style={{
        fontFamily: FONT,
        fontWeight: 800,
        color: '#FF7A00',
        fontVariantNumeric: 'tabular-nums',
        textShadow: '0 2px 12px rgba(255,122,0,0.25)',
        height: '35px',
        fontSize: '34px',
        lineHeight: '1.12',
        letterSpacing: '-0.11em'
      }}>
          {streakVal}
        </span>
        <span style={{
        fontFamily: FONT,
        fontSize: '13px',
        fontWeight: 500,
        color: '#D97706',
        letterSpacing: '0.05px'
      }}>
          Day streak 🔥
        </span>
      </div>
      <div style={{
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '3px'
    }}>
        <span style={{
        fontFamily: FONT,
        fontSize: '11px',
        fontWeight: 500,
        color: isDark ? '#636366' : '#9CA3AF'
      }}>Best: 24 days</span>
        <div style={{
        display: 'flex',
        gap: '3px'
      }}>
          {(['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const).map((d, i) => <div key={`day-${i}-${d}`} style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: i < 5 ? 'linear-gradient(135deg,#FF7A00,#FFD600)' : 'rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
              {i < 5 && <span style={{
            fontSize: '8px',
            color: '#FFFFFF',
            fontWeight: 700
          }}>✓</span>}
            </div>)}
        </div>
      </div>
    </motion.div>;
};

// ─── XP Progress Bar ──────────────────────────────────────────────────────────
interface XpBarProps {
  isDark: boolean;
}
const XpBar: React.FC<XpBarProps> = ({
  isDark
}) => {
  const [fillWidth, setFillWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFillWidth(XP_PROGRESS), 700);
    return () => clearTimeout(t);
  }, []);
  const xpVal = useCountUp(XP_CURRENT, 1400);
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.72,
    duration: 0.45
  }} style={{
    background: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
    borderRadius: '18px',
    padding: '14px 16px',
    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 14px rgba(0,0,0,0.06)'
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
          <Zap size={14} strokeWidth={2} style={{
          color: '#FF7A00'
        }} />
          <span style={{
          fontFamily: FONT,
          fontSize: '12px',
          fontWeight: 600,
          color: isDark ? '#FFFFFF' : '#1C1C1E',
          letterSpacing: '-0.1px'
        }}>
            Explorer Lv.5
          </span>
        </div>
        <span style={{
        fontFamily: FONT,
        fontSize: '11px',
        fontWeight: 500,
        color: '#8E8E93',
        fontVariantNumeric: 'tabular-nums'
      }}>
          {xpVal} / {XP_NEXT_LEVEL.toLocaleString()} XP
        </span>
      </div>
      <div style={{
      height: '10px',
      borderRadius: '10px',
      background: isDark ? 'rgba(255,255,255,0.08)' : '#F2F2F7',
      overflow: 'hidden',
      position: 'relative'
    }}>
        <div style={{
        height: '100%',
        width: `${fillWidth}%`,
        borderRadius: '10px',
        background: 'linear-gradient(90deg,#FF385C,#FF7A00,#FFD600)',
        transition: 'width 1.8s cubic-bezier(0.34,1.2,0.64,1)',
        position: 'relative'
      }}>
          <div style={{
          position: 'absolute',
          right: '-3px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: '#FFD600',
          boxShadow: '0 0 8px #FFD60088, 0 0 3px #FF7A00',
          animation: fillWidth > 0 ? 'xpTip 1.5s ease-in-out infinite alternate' : 'none'
        }} />
        </div>
      </div>
      <p style={{
      fontFamily: FONT,
      fontSize: '10px',
      color: isDark ? '#636366' : '#AAAAAA',
      marginTop: '6px',
      letterSpacing: '0.1px'
    }}>
        <span style={{
        color: '#FF7A00',
        fontWeight: 600
      }}>{(XP_NEXT_LEVEL - XP_CURRENT).toLocaleString()} XP</span> to reach Voyager Lv.6 🗺️
      </p>
    </motion.div>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  stat: typeof STATS_DATA[0];
  index: number;
  isDark: boolean;
}
const StatCard: React.FC<StatCardProps> = ({
  stat,
  index,
  isDark
}) => {
  const val = useCountUp(stat.numericValue, 900 + index * 180);
  const [bounce, setBounce] = useState(false);
  const handleTap = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 600);
  };
  const StatIcon = stat.id === 'trips' ? MapPin : stat.id === 'reviews' ? Star : Heart;
  return <motion.button initial={{
    opacity: 0,
    y: 20,
    scale: 0.85
  }} animate={{
    opacity: 1,
    y: 0,
    scale: 1
  }} transition={{
    delay: 0.35 + index * 0.1,
    type: 'spring',
    stiffness: 280,
    damping: 18
  }} whileTap={{
    scale: 0.93
  }} onClick={handleTap} style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '16px 8px',
    background: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
    borderRadius: '18px',
    cursor: 'pointer',
    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.25)' : '0 2px 12px rgba(0,0,0,0.06)'
  }}>
      <motion.div animate={bounce ? {
      scale: [1, 0.85, 1.2, 1.0]
    } : {
      scale: 1
    }} transition={bounce ? {
      duration: 0.45,
      ease: [0.34, 1.56, 0.64, 1]
    } : {}} style={{
      width: '44px',
      height: '44px',
      borderRadius: '14px',
      background: stat.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <StatIcon size={24} strokeWidth={1.8} style={{
        color: stat.color
      }} />
      </motion.div>
      <span style={{
      fontFamily: FONT,
      fontSize: '22px',
      fontWeight: 800,
      color: stat.color,
      letterSpacing: '-1px',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }}>
        {val}
      </span>
      <span style={{
      fontFamily: FONT,
      fontSize: '11px',
      fontWeight: 500,
      color: '#8E8E93',
      letterSpacing: '0.05px'
    }}>
        {stat.label}
      </span>
    </motion.button>;
};

// ─── Achievement Badge ────────────────────────────────────────────────────────
interface BadgeCardProps {
  badge: typeof BADGES_DATA[0];
  delay: number;
}
const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  delay
}) => {
  const [hovered, setHovered] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    if (hovered) {
      setShowTip(true);
    } else {
      const t = setTimeout(() => setShowTip(false), 200);
      return () => clearTimeout(t);
    }
  }, [hovered]);
  const handleTap = () => {
    if (!badge.unlocked) return;
    setBounce(true);
    setTimeout(() => setBounce(false), 600);
  };
  const BadgeIcon = badge.id === 'trusted' ? Shield : badge.id === 'explorer' ? MapPin : badge.id === 'superhost' ? Trophy : badge.id === 'globetrotter' ? Globe : Gem;
  return <div style={{
    position: 'relative',
    flexShrink: 0
  }}>
      <motion.button initial={{
      opacity: 0,
      scale: 0.5,
      y: 12
    }} animate={{
      opacity: 1,
      scale: 1,
      y: 0
    }} transition={{
      delay,
      type: 'spring',
      stiffness: 320,
      damping: 16
    }} whileHover={badge.unlocked ? {
      y: -8,
      scale: 1.08
    } : {
      scale: 0.97
    }} onHoverStart={() => badge.unlocked && setHovered(true)} onHoverEnd={() => setHovered(false)} onClick={handleTap} style={{
      width: '76px',
      height: '86px',
      borderRadius: '20px',
      background: badge.unlocked ? badge.bg : 'linear-gradient(135deg,#F2F2F7,#E5E5EA)',
      border: `1.5px solid ${badge.unlocked ? badge.border : '#CCCCCC'}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      cursor: 'pointer',
      filter: badge.unlocked ? 'none' : 'grayscale(0.8) opacity(0.55)',
      boxShadow: badge.unlocked && hovered ? `0 8px 24px ${badge.color}44, 0 0 0 2px ${badge.color}33` : badge.unlocked ? `0 2px 10px ${badge.color}22` : 'none',
      transition: 'box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
        {badge.unlocked && <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '20px',
        background: 'linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.55) 50%,transparent 70%)',
        backgroundSize: '200% 100%',
        animation: 'shimmerBadge 3s ease-in-out infinite',
        pointerEvents: 'none'
      }} />}
        <motion.div animate={bounce ? {
        scale: [1, 0.85, 1.2, 1.0]
      } : {
        scale: 1
      }} transition={bounce ? {
        duration: 0.45,
        ease: [0.34, 1.56, 0.64, 1]
      } : {}} style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: badge.unlocked ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          {badge.unlocked ? <BadgeIcon size={20} strokeWidth={1.8} style={{
          color: badge.color
        }} /> : <Lock size={16} strokeWidth={1.8} style={{
          color: '#9CA3AF'
        }} />}
        </motion.div>
        <span style={{
        fontFamily: FONT,
        fontSize: '9px',
        fontWeight: 600,
        color: badge.unlocked ? badge.color : '#9CA3AF',
        textAlign: 'center',
        lineHeight: 1.3,
        letterSpacing: '0.05px',
        paddingInline: '4px'
      }}>
          {badge.label}
        </span>
      </motion.button>
      <AnimatePresence>
        {showTip && badge.unlocked && <motion.div initial={{
        opacity: 0,
        scale: 0.7,
        y: 6
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.7,
        y: 6
      }} transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20
      }} style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1C1C1E',
        color: '#FFFFFF',
        fontFamily: FONT,
        fontSize: '11px',
        fontWeight: 500,
        padding: '6px 10px',
        borderRadius: '10px',
        whiteSpace: 'nowrap',
        zIndex: 100,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        pointerEvents: 'none'
      }}>
            {badge.tooltip}
            <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '8px',
          height: '8px',
          background: '#1C1C1E',
          borderRadius: '1px',
          rotate: '45deg'
        }} />
          </motion.div>}
      </AnimatePresence>
    </div>;
};

// ─── Setting Item ─────────────────────────────────────────────────────────────
interface SettingItemProps {
  item: typeof SETTINGS_LIST[0];
  isDark: boolean;
  delay: number;
}
const SettingItem: React.FC<SettingItemProps> = ({
  item,
  isDark,
  delay
}) => {
  const [pressed, setPressed] = useState(false);
  const {
    ripples,
    trigger
  } = useRipple();
  const Icon = item.icon;
  return <motion.div initial={{
    opacity: 0,
    x: -14
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    delay,
    duration: 0.38,
    ease: 'easeOut'
  }}>
      <button onClick={e => trigger(e)} onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)} style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      background: isDark ? '#1C1C1E' : '#FFFFFF',
      border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
      borderRadius: '16px',
      marginBottom: '8px',
      boxShadow: isDark ? '0 1px 8px rgba(0,0,0,0.24)' : '0 1px 8px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      textAlign: 'left',
      overflow: 'hidden',
      position: 'relative',
      transform: pressed ? 'scale(0.97)' : 'scale(1)',
      transition: 'transform 0.12s ease, background 0.15s ease'
    }}>
        {ripples.map(r => <span key={r.id} style={{
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.06)',
        width: '120px',
        height: '120px',
        top: r.y - 60,
        left: r.x - 60,
        transform: 'scale(0)',
        animation: 'rippleOut 0.6s ease-out forwards',
        pointerEvents: 'none'
      }} />)}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
          <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: isDark ? '#2C2C2E' : item.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
            <Icon size={18} strokeWidth={1.8} style={{
            color: isDark ? '#FFFFFF' : item.iconColor
          }} />
          </div>
          <span style={{
          fontFamily: FONT,
          fontSize: '15px',
          fontWeight: 400,
          color: isDark ? '#FFFFFF' : '#1C1C1E',
          letterSpacing: '-0.1px'
        }}>
            {item.label}
          </span>
        </div>
        <ChevronRight size={16} strokeWidth={1.5} style={{
        color: '#C7C7CC',
        flexShrink: 0
      }} />
      </button>
    </motion.div>;
};

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}
const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDark,
  onToggle
}) => {
  const [pressed, setPressed] = useState(false);
  return <motion.div initial={{
    opacity: 0,
    x: -14
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    delay: 0.04,
    duration: 0.38,
    ease: 'easeOut'
  }} style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
    borderRadius: '16px',
    marginBottom: '8px',
    boxShadow: isDark ? '0 1px 8px rgba(0,0,0,0.24)' : '0 1px 8px rgba(0,0,0,0.05)'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    }}>
        <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        background: isDark ? '#3A3A3C' : '#1C1C1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
          <Moon size={18} strokeWidth={1.8} style={{
          color: '#FFFFFF'
        }} />
        </div>
        <span style={{
        fontFamily: FONT,
        fontSize: '15px',
        fontWeight: 400,
        color: isDark ? '#FFFFFF' : '#1C1C1E'
      }}>
          Dark Mode
        </span>
      </div>
      <button role="switch" aria-checked={isDark} aria-label="Toggle dark mode" onPointerDown={() => setPressed(true)} onPointerUp={() => {
      setPressed(false);
      onToggle();
    }} onPointerLeave={() => setPressed(false)} style={{
      width: '51px',
      height: '31px',
      borderRadius: '16px',
      background: isDark ? '#34C759' : '#E5E5EA',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      flexShrink: 0,
      outline: 'none',
      position: 'relative',
      transform: pressed ? 'scale(0.88)' : 'scale(1)',
      transition: 'background 0.28s cubic-bezier(0.34,1.56,0.64,1), transform 0.14s ease'
    }}>
        <span style={{
        width: '23px',
        height: '23px',
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 2px 7px rgba(0,0,0,0.22)',
        position: 'absolute',
        top: '4px',
        left: isDark ? 'calc(100% - 27px)' : '4px',
        transition: 'left 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'block'
      }} />
      </button>
    </motion.div>;
};

// ─── Level Badge ──────────────────────────────────────────────────────────────
const LevelBadge: React.FC<{
  isDark: boolean;
}> = ({
  isDark
}) => <motion.div initial={{
  opacity: 0,
  scale: 0.4,
  y: 8
}} animate={{
  opacity: 1,
  scale: 1,
  y: 0
}} transition={{
  delay: 1.5,
  type: 'spring',
  stiffness: 340,
  damping: 12
}} style={{
  position: 'absolute',
  bottom: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg,#FF385C,#FF7A00)',
  color: '#FFFFFF',
  fontFamily: FONT,
  fontSize: '9px',
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: '12px',
  whiteSpace: 'nowrap',
  letterSpacing: '0.2px',
  boxShadow: '0 3px 10px rgba(255,56,92,0.4)',
  border: `2px solid ${isDark ? '#1C1C1E' : '#FFFFFF'}`
}}>
    Explorer Lv.5 🏡
  </motion.div>;

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [editRipples, setEditRipples] = useState<RippleState[]>([]);
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  const screenBg = isDark ? '#0A0A0A' : '#F6F6F8';
  const primaryText = isDark ? '#FFFFFF' : '#1C1C1E';
  const secondaryText = isDark ? '#636366' : '#8E8E93';
  const headerBg = isDark ? '#111111' : '#FFFFFF';
  const navBg = isDark ? 'rgba(17,17,17,0.92)' : 'rgba(255,255,255,0.95)';
  const navBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const versionColor = isDark ? '#48484A' : '#C7C7CC';
  const sectionBg = isDark ? 'rgba(28,28,30,0.6)' : 'rgba(242,242,247,0.5)';
  const sectionBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const triggerEditRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setEditRipples(prev => [...prev, {
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }]);
    setTimeout(() => setEditRipples(prev => prev.filter(r => r.id !== id)), 700);
  }, []);
  return <div style={{
    minHeight: '100vh',
    background: screenBg,
    paddingBottom: '112px',
    transition: 'background 0.3s ease',
    fontFamily: FONT
  }}>
      <style>{`
        @keyframes rippleOut {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(5); opacity: 0; }
        }
        @keyframes flameFlicker {
          0% { transform: scaleX(1) scaleY(1) rotate(-2deg); }
          30% { transform: scaleX(0.96) scaleY(1.06) rotate(1.5deg); }
          60% { transform: scaleX(1.04) scaleY(0.97) rotate(-1deg); }
          100% { transform: scaleX(0.98) scaleY(1.04) rotate(2deg); }
        }
        @keyframes shimmerBadge {
          0% { background-position: -200% 0; }
          60% { background-position: 200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes xpTip {
          0% { box-shadow: 0 0 6px #FFD60066, 0 0 2px #FF7A00; }
          100% { box-shadow: 0 0 14px #FFD600cc, 0 0 6px #FF7A00; }
        }
        @keyframes avatarBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.028); }
        }
        .avatar-breathe {
          animation: avatarBreathe 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
      background: headerBg,
      padding: '60px 24px 28px',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#EBEBEB'}`,
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>

          {/* LEFT: Name + greeting */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
            <motion.div initial={{
            opacity: 0,
            y: -4
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.16
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
              <h1 style={{
              fontFamily: FONT,
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.8px',
              lineHeight: 1.05,
              color: primaryText,
              transition: 'color 0.3s ease'
            }}>
                Lukas
              </h1>
              <BadgeCheck size={18} strokeWidth={2} style={{
              color: '#FF385C',
              flexShrink: 0,
              marginTop: '2px'
            }} />
            </motion.div>
            <motion.p initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.24
          }} style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 400,
            color: secondaryText,
            marginTop: '2px',
            transition: 'color 0.3s ease'
          }}>
              {greeting}
            </motion.p>
          </div>

          {/* RIGHT: Avatar with XP ring */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.55,
          delay: 0.18,
          type: 'spring',
          stiffness: 220,
          damping: 16
        }} style={{
          position: 'relative',
          flexShrink: 0,
          marginLeft: '16px',
          marginTop: '18px'
        }}>
            <XpRing size={96} stroke={4} progress={XP_PROGRESS} isDark={isDark} />
            <div className="avatar-breathe" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '4px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
          }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160" alt="Profile photo of Lukas" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} />
            </div>
            <LevelBadge isDark={isDark} />

            {/* Edit button */}
            <motion.button whileTap={{
            scale: 0.82
          }} onClick={triggerEditRipple} aria-label="Edit profile" style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            background: isDark ? '#FFFFFF' : '#1C1C1E',
            color: isDark ? '#000000' : '#FFFFFF',
            padding: '6px',
            borderRadius: '50%',
            border: `2px solid ${isDark ? '#111111' : '#FFFFFF'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'background 0.3s ease'
          }}>
              {editRipples.map(r => <span key={r.id} style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.45)',
              width: '60px',
              height: '60px',
              top: r.y - 30,
              left: r.x - 30,
              transform: 'scale(0)',
              animation: 'rippleOut 0.6s ease-out forwards',
              pointerEvents: 'none'
            }} />)}
              <Settings size={13} strokeWidth={1.8} />
            </motion.button>
          </motion.div>
        </div>

        {/* XP Bar */}
        <div style={{
        marginTop: '32px'
      }}>
          <XpBar isDark={isDark} />
        </div>

        {/* Streak */}
        <div style={{
        marginTop: '14px'
      }}>
          <StreakCounter isDark={isDark} />
        </div>

        {/* Stats Row */}
        <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.42,
        duration: 0.45
      }} style={{
        marginTop: '14px',
        display: 'flex',
        gap: '10px'
      }}>
          {STATS_DATA.map((stat, i) => <StatCard key={stat.id} stat={stat} index={i} isDark={isDark} />)}
        </motion.div>
      </header>

      <main style={{
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>

        {/* ── ACHIEVEMENT BADGES ── */}
        <section>
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
            <h2 style={{
            fontFamily: FONT,
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: primaryText
          }}>
              Achievements 🏅
            </h2>
            <span style={{
            fontFamily: FONT,
            fontSize: '12px',
            fontWeight: 500,
            color: '#FF385C'
          }}>
              3/5 earned
            </span>
          </motion.div>
          <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          paddingTop: '4px'
        }} className="hide-scrollbar">
            {BADGES_DATA.map((badge, i) => <BadgeCard key={badge.id} badge={badge} delay={0.52 + i * 0.1} />)}
          </div>
        </section>

        {/* ── YOUR TRIPS ── */}
        <section>
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
            <h2 style={{
            fontFamily: FONT,
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: primaryText
          }}>
              Your Trips ✈️
            </h2>
            <button style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 500,
            color: '#FF385C',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>
              View all
            </button>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.56,
          duration: 0.45
        }} style={{
          background: sectionBg,
          padding: '14px',
          borderRadius: '22px',
          border: `1px solid ${sectionBorder}`
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            fontFamily: FONT,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: secondaryText
          }}>
              <History size={13} strokeWidth={1.5} />
              <span>Past Trip</span>
            </div>

            <motion.div whileTap={{
            scale: 0.98
          }} style={{
            background: isDark ? '#1C1C1E' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
            borderRadius: '16px',
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.22)' : '0 4px 16px rgba(0,0,0,0.07)',
            padding: '10px',
            display: 'flex',
            gap: '13px',
            alignItems: 'center'
          }}>
              <div style={{
              width: '88px',
              height: '78px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0
            }}>
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300" alt="Charming Houseboat on Dal Lake" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} />
              </div>
              <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: 0
            }}>
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                  <p style={{
                  fontFamily: FONT,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isDark ? '#FFFFFF' : '#1C1C1E',
                  letterSpacing: '-0.1px',
                  lineHeight: 1.3,
                  flex: 1,
                  marginRight: '8px'
                }}>
                    Srinagar, Kashmir
                  </p>
                  <span style={{
                  background: 'rgba(52,199,89,0.12)',
                  color: '#16A34A',
                  fontFamily: FONT,
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  padding: '3px 8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                    Completed
                  </span>
                </div>
                <p style={{
                fontFamily: FONT,
                fontSize: '12px',
                color: '#8E8E93',
                lineHeight: 1.4,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}>
                  Charming Houseboat on Dal Lake
                </p>
                <p style={{
                fontFamily: FONT,
                fontSize: '11px',
                color: '#AAAAAA',
                lineHeight: 1.4
              }}>
                  Jan 12 – 15, 2024
                </p>
                <p style={{
                marginTop: '2px'
              }}>
                  <span style={{
                  fontFamily: FONT,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isDark ? '#FFFFFF' : '#1C1C1E'
                }}>₹8,500</span>
                  <span style={{
                  fontFamily: FONT,
                  fontSize: '12px',
                  color: '#8E8E93'
                }}>{' / night'}</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── SETTINGS ── */}
        <section>
          <motion.h2 initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2
        }} style={{
          fontFamily: FONT,
          fontSize: '17px',
          fontWeight: 700,
          letterSpacing: '-0.3px',
          color: primaryText,
          marginBottom: '16px'
        }}>
            Settings ⚙️
          </motion.h2>
          <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
            <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(p => !p)} />
            {SETTINGS_LIST.map((item, i) => <SettingItem key={item.id} item={item} isDark={isDark} delay={0.06 + i * 0.07} />)}
          </div>
        </section>

        {/* ── LOGOUT ── */}
        <section style={{
        paddingTop: '8px'
      }}>
          <motion.button whileTap={{
          scale: 0.975
        }} onClick={() => console.log('Logout')} style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: '16px',
          background: isDark ? '#1C1C1E' : '#FFF1F2',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(239,68,68,0.14)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: FONT,
          fontSize: '15px',
          fontWeight: 600,
          color: '#EF4444'
        }}>
            <LogOut size={18} strokeWidth={2} style={{
            color: '#EF4444'
          }} />
            <span>Log out</span>
          </motion.button>
          <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: '12px',
          color: versionColor
        }}>
            SwissChamba Version 2.4.0
          </p>
        </section>
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: navBg,
      borderTop: `1px solid ${navBorder}`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '8px 24px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 50,
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
        {([{
        id: 'explore',
        label: 'Explore'
      }, {
        id: 'search',
        label: 'Search'
      }, {
        id: 'trips',
        label: 'Trips'
      }, {
        id: 'profile',
        label: 'Profile'
      }] as const).map(({
        id,
        label
      }) => {
        const isActive = id === 'profile';
        const iconColor = isActive ? isDark ? '#FFFFFF' : '#1C1C1E' : isDark ? '#636366' : '#8E8E93';
        return <motion.button key={id} whileTap={{
          scale: 0.84
        }} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: iconColor,
          transition: 'color 0.3s ease',
          paddingBottom: '2px'
        }}>
              {id === 'explore' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>}
              {id === 'search' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>}
              {id === 'trips' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>}
              {id === 'profile' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>}
              <span style={{
            fontFamily: FONT,
            fontSize: '10px',
            fontWeight: isActive ? 600 : 400,
            letterSpacing: '0.1px',
            color: iconColor
          }}>
                {label}
              </span>
              {isActive && <span style={{
            display: 'block',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#FF385C',
            marginTop: '1px'
          }} />}
            </motion.button>;
      })}
      </nav>
    </div>;
};