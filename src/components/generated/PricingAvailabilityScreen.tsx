import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ChevronLeft, Plus, Minus, Zap, TrendingUp, Target, Award, Check, Sparkles, Star, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PricingTier {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}
interface ConfettiParticle {
  id: string;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  shape: 'circle' | 'rect' | 'star';
  drift: number;
}
interface CalendarDay {
  date: number;
  dayName: string;
  isSelected: boolean;
  isBlocked: boolean;
  isRangeMiddle: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SWEET_SPOT_MIN = 3200;
const SWEET_SPOT_MAX = 5500;
const PRICING_TIERS: PricingTier[] = [{
  id: 'competitive',
  title: 'Competitive',
  subtitle: 'Optimized for more bookings',
  icon: <TrendingUp className="w-5 h-5" />
}, {
  id: 'market',
  title: 'Market Rate',
  subtitle: 'Matches local average',
  icon: <Target className="w-5 h-5" />
}, {
  id: 'premium',
  title: 'Premium',
  subtitle: 'Positioned as luxury stay',
  icon: <Award className="w-5 h-5" />
}];
const MINIMUM_STAY_OPTIONS = [{
  label: '1 Night',
  value: 1
}, {
  label: '2 Nights',
  value: 2
}, {
  label: '3 Nights',
  value: 3
}];
const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98', '#F0E68C', '#FF69B4', '#00CED1', '#FF4500'];
const CALENDAR_DAYS: CalendarDay[] = [{
  date: 1,
  dayName: 'Mo',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 2,
  dayName: 'Tu',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 3,
  dayName: 'We',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 4,
  dayName: 'Th',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 5,
  dayName: 'Fr',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 6,
  dayName: 'Sa',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 7,
  dayName: 'Su',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 8,
  dayName: 'Mo',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 9,
  dayName: 'Tu',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 10,
  dayName: 'We',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 11,
  dayName: 'Th',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 12,
  dayName: 'Fr',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 13,
  dayName: 'Sa',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}, {
  date: 14,
  dayName: 'Su',
  isSelected: false,
  isBlocked: false,
  isRangeMiddle: false
}];
const BAR_CHART_DATA = [{
  label: 'M',
  maxHeight: 40,
  color: '#34D399'
}, {
  label: 'T',
  maxHeight: 55,
  color: '#34D399'
}, {
  label: 'W',
  maxHeight: 35,
  color: '#34D399'
}, {
  label: 'T',
  maxHeight: 70,
  color: '#F59E0B'
}, {
  label: 'F',
  maxHeight: 85,
  color: '#F59E0B'
}, {
  label: 'S',
  maxHeight: 90,
  color: '#10B981'
}, {
  label: 'S',
  maxHeight: 75,
  color: '#10B981'
}];
const CELEBRATION_WORDS = ['YOU\'RE', 'A', 'HOST', 'NOW!', '🎉'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateParticles(count: number): ConfettiParticle[] {
  const shapes: Array<'circle' | 'rect' | 'star'> = ['circle', 'rect', 'star'];
  return Array.from({
    length: count
  }, (_, i) => ({
    id: `p-${i}`,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 10 + 6,
    delay: Math.random() * 1.2,
    duration: Math.random() * 2 + 2,
    rotation: Math.random() * 720 - 360,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    drift: (Math.random() - 0.5) * 200
  }));
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useSlotCounter(target: number) {
  const [display, setDisplay] = useState(target);
  const startRef = useRef(target);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const start = startRef.current;
    const end = target;
    if (start === end) return;
    const startTime = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = end;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);
  return display;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const IOSSlider = ({
  enabled,
  onToggle
}: {
  enabled: boolean;
  onToggle: () => void;
}) => <motion.button onClick={onToggle} whileTap={{
  scale: 0.92
}} className={cn('relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none', enabled ? 'bg-[#1C1C1E]' : 'bg-gray-200')} aria-pressed={enabled} aria-label="Toggle Instant Book">
    <motion.span layout transition={{
    type: 'spring',
    stiffness: 600,
    damping: 35
  }} className={cn('pointer-events-none inline-block h-[27px] w-[27px] rounded-full bg-white shadow-md', enabled ? 'translate-x-[22px]' : 'translate-x-[2px]')} />
  </motion.button>;
const ConfettiExplosion = ({
  active
}: {
  active: boolean;
}) => {
  const particles = useRef<ConfettiParticle[]>(generateParticles(80));
  if (!active) return null;
  return <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">
      {particles.current.map(p => <motion.div key={p.id} initial={{
      y: -30,
      x: `${p.x}vw`,
      opacity: 1,
      rotate: 0,
      scale: 1.2
    }} animate={{
      y: '115vh',
      x: `calc(${p.x}vw + ${p.drift}px)`,
      opacity: [1, 1, 0.9, 0.4, 0],
      rotate: p.rotation,
      scale: [1.2, 1, 0.7, 0.4]
    }} transition={{
      duration: p.duration,
      delay: p.delay,
      ease: [0.1, 0.25, 0.3, 1]
    }} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: p.size,
      height: p.shape === 'star' ? p.size : p.size,
      backgroundColor: p.shape !== 'star' ? p.color : 'transparent',
      borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : '0',
      fontSize: p.shape === 'star' ? p.size + 4 : undefined,
      lineHeight: p.shape === 'star' ? 1 : undefined,
      color: p.shape === 'star' ? p.color : undefined
    }}>
          {p.shape === 'star' ? '★' : null}
        </motion.div>)}
    </div>;
};
const FireworksCorner = ({
  active,
  side
}: {
  active: boolean;
  side: 'left' | 'right';
}) => {
  if (!active) return null;
  const bursts = [0, 1, 2];
  return <div className="fixed pointer-events-none z-[55] overflow-hidden" style={{
    top: 0,
    [side]: 0,
    width: 120,
    height: 200
  }} aria-hidden="true">
      {bursts.map(i => <motion.div key={`burst-${side}-${i}`} initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: [0, 1.5, 0],
      opacity: [0, 1, 0]
    }} transition={{
      delay: 0.3 + i * 0.4,
      duration: 0.8,
      ease: 'easeOut'
    }} style={{
      position: 'absolute',
      top: 20 + i * 40,
      [side]: 20 + i * 15,
      fontSize: 32 + i * 8
    }}>
          {'✨'}
        </motion.div>)}
    </div>;
};
const ProgressBar = ({
  complete
}: {
  complete: boolean;
}) => {
  const [exploded, setExploded] = useState(false);
  const [golden, setGolden] = useState(false);
  const [mascotRunning, setMascotRunning] = useState(false);
  useEffect(() => {
    if (complete) {
      setMascotRunning(true);
      const t1 = setTimeout(() => setExploded(true), 800);
      const t2 = setTimeout(() => {
        setExploded(false);
        setGolden(true);
      }, 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [complete]);
  return <div className="flex items-center gap-2">
      {/* Mascot runner */}
      <div className="relative w-24 h-3 bg-gray-100 rounded-full overflow-visible">
        {/* Bar fill */}
        <motion.div className="h-full rounded-full overflow-hidden" style={{
        background: golden ? 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)' : 'linear-gradient(90deg, #10B981, #34D399)',
        backgroundSize: '200% 100%'
      }} animate={{
        width: complete ? '100%' : '75%',
        backgroundPosition: golden ? ['0% 50%', '200% 50%'] : '0% 50%'
      }} transition={{
        width: {
          duration: 0.9,
          ease: [0.34, 1.56, 0.64, 1]
        },
        backgroundPosition: golden ? {
          duration: 1.2,
          repeat: Infinity,
          ease: 'linear'
        } : {}
      }} />

        {/* Explosion particles */}
        <AnimatePresence>
          {exploded && [0, 1, 2, 3, 4].map(i => <motion.div key={`xp-${i}`} initial={{
          scale: 0,
          x: '75%',
          y: '-50%',
          opacity: 1
        }} animate={{
          scale: [0, 1.5, 0],
          x: `${50 + (i - 2) * 30}%`,
          y: `${-100 - Math.random() * 60}%`,
          opacity: [1, 1, 0]
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.6,
          delay: i * 0.05
        }} style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        }} />)}
        </AnimatePresence>

        {/* Mascot emoji running */}
        <AnimatePresence>
          {mascotRunning && <motion.span initial={{
          x: '0%',
          opacity: 0
        }} animate={complete ? {
          x: ['0%', '250%', '600%'],
          opacity: [0, 1, 1, 1],
          y: golden ? [0, -8, 0, -12, 0] : [0, 0, 0]
        } : {
          x: '0%',
          opacity: 0
        }} transition={{
          x: {
            duration: 1.0,
            ease: [0.4, 0, 0.2, 1]
          },
          y: {
            duration: 0.6,
            delay: 1.0,
            repeat: golden ? 1 : 0,
            ease: 'easeInOut'
          },
          opacity: {
            duration: 0.3
          }
        }} style={{
          position: 'absolute',
          top: -8,
          left: 0,
          fontSize: 16,
          lineHeight: 1,
          whiteSpace: 'nowrap'
        }}>
              🏃
            </motion.span>}
        </AnimatePresence>
      </div>

      <motion.span animate={{
      color: complete ? '#F59E0B' : '#8E8E93'
    }} transition={{
      duration: 0.4
    }} className="text-[12px] font-bold">
        {complete ? '5/5 ✓' : '4/5'}
      </motion.span>
    </div>;
};
const SlotDigit = ({
  digit,
  prevDigit
}: {
  digit: string;
  prevDigit: string;
}) => {
  const changed = digit !== prevDigit;
  return <div className="relative overflow-hidden inline-block" style={{
    height: '1.2em'
  }}>
      <AnimatePresence mode="popLayout">
        <motion.span key={digit} initial={changed ? {
        y: digit > prevDigit ? '-100%' : '100%',
        opacity: 0
      } : {
        y: 0,
        opacity: 1
      }} animate={{
        y: 0,
        opacity: 1
      }} exit={changed ? {
        y: digit > prevDigit ? '100%' : '-100%',
        opacity: 0
      } : {
        y: 0,
        opacity: 0
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }} style={{
        display: 'block'
      }}>
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>;
};
const AnimatedPriceDisplay = ({
  price,
  isSweetSpot
}: {
  price: number;
  isSweetSpot: boolean;
}) => {
  const priceStr = price.toLocaleString();
  const prevPriceRef = useRef(price);
  const prevStr = prevPriceRef.current.toLocaleString();
  useEffect(() => {
    prevPriceRef.current = price;
  });
  return <motion.div className="flex items-baseline gap-1 justify-center" animate={isSweetSpot ? {
    filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)']
  } : {}} transition={{
    duration: 0.6,
    repeat: isSweetSpot ? 2 : 0
  }}>
      <motion.span className="text-[28px] font-light" animate={{
      color: isSweetSpot ? '#F59E0B' : '#8E8E93'
    }} transition={{
      duration: 0.3
    }}>
        ₹
      </motion.span>
      <div className="flex text-[48px] font-semibold tracking-[-1px]" style={{
      color: isSweetSpot ? '#F59E0B' : '#1C1C1E'
    }}>
        {priceStr.split('').map((char, idx) => <SlotDigit key={`d-${idx}`} digit={char} prevDigit={prevStr[idx] ?? char} />)}
      </div>
    </motion.div>;
};
const BarChart = ({
  price
}: {
  price: number;
}) => {
  const ratio = Math.min(Math.max((price - 500) / (8000 - 500), 0), 1);
  return <div className="flex items-end gap-1 h-14 px-2">
      {BAR_CHART_DATA.map((bar, i) => {
      const barHeight = Math.round(bar.maxHeight * ratio);
      return <div key={`bar-${bar.label}-${i}`} className="flex flex-col items-center gap-0.5 flex-1">
            <motion.div className="w-full rounded-t-sm" style={{
          backgroundColor: price >= SWEET_SPOT_MIN && price <= SWEET_SPOT_MAX ? '#F59E0B' : bar.color
        }} initial={{
          height: 0
        }} animate={{
          height: Math.max(barHeight, 3)
        }} transition={{
          duration: 0.4,
          delay: i * 0.05,
          ease: [0.34, 1.56, 0.64, 1]
        }} />
            <span className="text-[9px] text-gray-400">{bar.label}</span>
          </div>;
    })}
    </div>;
};
const CalendarSection = () => {
  const [selectedRange, setSelectedRange] = useState<number[]>([]);
  const [blockedDates, setBlockedDates] = useState<number[]>([]);
  const [bouncingDate, setBouncingDate] = useState<number | null>(null);
  const [weekStreakActive, setWeekStreakActive] = useState(false);
  const [weekStreakBounce, setWeekStreakBounce] = useState(false);
  const [sweepComplete, setSweepComplete] = useState(false);
  const handleDateTap = useCallback((date: number) => {
    setBouncingDate(date);
    setTimeout(() => setBouncingDate(null), 600);
    if (blockedDates.includes(date)) return;
    if (selectedRange.length === 0) {
      setSelectedRange([date]);
      setSweepComplete(false);
    } else if (selectedRange.length === 1) {
      const start = selectedRange[0];
      const end = date;
      if (start === end) {
        setSelectedRange([]);
        return;
      }
      const sorted = start < end ? [start, end] : [end, start];
      const range: number[] = [];
      for (let d = sorted[0]; d <= sorted[1]; d++) range.push(d);
      setSelectedRange(range);
      setSweepComplete(true);
      if (range.length >= 7) {
        setTimeout(() => {
          setWeekStreakActive(true);
          setWeekStreakBounce(true);
          setTimeout(() => setWeekStreakBounce(false), 2000);
        }, 600);
      }
    } else {
      setSelectedRange([]);
      setWeekStreakActive(false);
      setSweepComplete(false);
    }
  }, [selectedRange, blockedDates]);
  const handleBlock = useCallback((date: number) => {
    setBlockedDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]);
    setSelectedRange([]);
  }, []);
  return <section className="mt-8">
      <div className="px-5 mb-3 flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[0.3px] text-[#8E8E93] uppercase">
          Availability — June
        </span>
        <span className="text-[11px] text-[#8E8E93]">Tap to select • Hold to block</span>
      </div>

      <div className="px-5">
        <div className="bg-[#F2F2F7] rounded-[20px] p-4">
          {/* Days of week header */}
          <div className="grid grid-cols-7 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={`hdr-${d}-${i}`} className="text-center text-[11px] font-semibold text-[#8E8E93] py-1">
                {d}
              </div>)}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-1">
            {CALENDAR_DAYS.map(day => {
            const isInRange = selectedRange.includes(day.date);
            const isStart = selectedRange[0] === day.date && selectedRange.length > 1;
            const isEnd = selectedRange[selectedRange.length - 1] === day.date && selectedRange.length > 1;
            const isMiddle = isInRange && !isStart && !isEnd && selectedRange.length > 2;
            const isBlocked = blockedDates.includes(day.date);
            const isBouncing = bouncingDate === day.date;
            const isSingleSelected = selectedRange.length === 1 && selectedRange[0] === day.date;
            return <motion.button key={`day-${day.date}`} onClick={() => handleDateTap(day.date)} onContextMenu={e => {
              e.preventDefault();
              handleBlock(day.date);
            }} animate={isBouncing ? {
              scale: [1, 1.3, 0.9, 1.05, 1]
            } : {
              scale: 1
            }} transition={isBouncing ? {
              duration: 0.5,
              ease: 'easeOut'
            } : {}} whileTap={{
              scale: 0.85
            }} className={cn('relative h-9 w-full flex items-center justify-center text-[13px] font-medium rounded-xl transition-colors', isBlocked ? 'bg-red-100 text-red-500' : isStart || isEnd ? 'bg-[#1C1C1E] text-white rounded-xl' : isMiddle ? 'bg-[#1C1C1E]/15 text-[#1C1C1E] rounded-none' : isSingleSelected ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E]')}>
                  {/* Range sweep animation */}
                  {(isStart || isMiddle) && sweepComplete && <motion.div initial={{
                scaleX: 0
              }} animate={{
                scaleX: 1
              }} transition={{
                duration: 0.3,
                delay: (day.date - selectedRange[0]) * 0.04
              }} style={{
                originX: 0
              }} className="absolute inset-0 bg-[#1C1C1E]/10 rounded-none" />}
                  <span className="relative z-10">{day.date}</span>

                  {/* Blocked X */}
                  {isBlocked && <motion.svg viewBox="0 0 10 10" className="absolute inset-0 w-full h-full" style={{
                padding: '6px'
              }}>
                      <motion.line x1="1" y1="1" x2="9" y2="9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" initial={{
                  pathLength: 0
                }} animate={{
                  pathLength: 1
                }} transition={{
                  duration: 0.25
                }} />
                      <motion.line x1="9" y1="1" x2="1" y2="9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" initial={{
                  pathLength: 0
                }} animate={{
                  pathLength: 1
                }} transition={{
                  duration: 0.25,
                  delay: 0.15
                }} />
                    </motion.svg>}
                </motion.button>;
          })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#1C1C1E]" />
              <span className="text-[10px] text-[#8E8E93]">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-300" />
              <span className="text-[10px] text-[#8E8E93]">Blocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week streak toast */}
      <AnimatePresence>
        {weekStreakActive && <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.8
      }} animate={weekStreakBounce ? {
        opacity: 1,
        y: [20, -8, 2, 0],
        scale: [0.8, 1.1, 0.95, 1]
      } : {
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 10,
        scale: 0.9
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 22
      }} className="mx-5 mt-3 flex items-center gap-2.5 bg-orange-500 rounded-2xl px-4 py-3">
            <motion.span animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0]
        }} transition={{
          duration: 0.5,
          repeat: 2
        }} className="text-xl" aria-hidden="true">
              🔥
            </motion.span>
            <div>
              <p className="text-[13px] font-bold text-white">7-day streak set!</p>
              <p className="text-[11px] text-orange-100">Hosts with weekly availability earn 40% more</p>
            </div>
          </motion.div>}
      </AnimatePresence>
    </section>;
};
const MegaCelebrationOverlay = ({
  visible,
  onClose
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (visible) {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 150);
      const t2 = setTimeout(() => setPhase(2), 400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [visible]);
  return <AnimatePresence>
      {visible && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.3
    }} className="fixed inset-0 z-[50] flex items-center justify-center" style={{
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)'
    }} onClick={onClose}>
          {/* White flash */}
          <AnimatePresence>
            {phase === 0 && <motion.div initial={{
          opacity: 1
        }} animate={{
          opacity: 0
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.12
        }} className="fixed inset-0 bg-white z-[51] pointer-events-none" />}
          </AnimatePresence>

          {/* Card */}
          <motion.div initial={{
        scale: 0.5,
        opacity: 0,
        y: 60
      }} animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }} exit={{
        scale: 0.9,
        opacity: 0,
        y: 30
      }} transition={{
        type: 'spring',
        stiffness: 380,
        damping: 26,
        delay: 0.15
      }} onClick={e => e.stopPropagation()} className="bg-white rounded-[36px] mx-5 p-7 text-center shadow-2xl w-full max-w-sm">
            {/* Trophy drops in */}
            <motion.div initial={{
          y: -120,
          opacity: 0,
          scale: 0.3
        }} animate={{
          y: 0,
          opacity: 1,
          scale: [0.3, 1.3, 0.9, 1.05, 1]
        }} transition={{
          type: 'spring',
          stiffness: 350,
          damping: 18,
          delay: 0.3
        }} className="text-6xl text-center mb-1" aria-hidden="true">
              🏆
            </motion.div>

            {/* Mascot victory dance */}
            <motion.div initial={{
          scale: 0,
          rotate: -20
        }} animate={{
          scale: [0, 1.4, 1],
          rotate: [0, -15, 15, -10, 10, 0],
          y: [0, -18, 0, -12, 0, -6, 0]
        }} transition={{
          delay: 0.5,
          duration: 1.4,
          ease: 'easeInOut'
        }} className="text-4xl text-center mb-3" aria-hidden="true">
              🧑‍🎤
            </motion.div>

            {/* Animated green checkmark */}
            <motion.div initial={{
          scale: 0
        }} animate={{
          scale: [0, 1.3, 1]
        }} transition={{
          delay: 0.7,
          duration: 0.5
        }} className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" strokeWidth={3.5} />
            </motion.div>

            {/* Word-by-word text */}
            <div className="flex flex-wrap gap-x-2 justify-center mb-2">
              {CELEBRATION_WORDS.map((word, i) => <motion.span key={`word-${word}-${i}`} initial={{
            opacity: 0,
            y: 16,
            scale: 0.8
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} transition={{
            delay: 1.0 + i * 0.12,
            type: 'spring',
            stiffness: 500,
            damping: 22
          }} className="text-[26px] font-extrabold tracking-tight text-[#1C1C1E]">
                  {word}
                </motion.span>)}
            </div>

            {/* XP reward floating up */}
            <motion.div initial={{
          opacity: 0,
          y: 30,
          scale: 0.6
        }} animate={{
          opacity: [0, 1, 1, 0],
          y: [30, 0, -10, -40],
          scale: [0.6, 1.3, 1.1, 0.8]
        }} transition={{
          delay: 1.8,
          duration: 1.6,
          ease: 'easeOut'
        }} className="text-[36px] font-extrabold text-[#F59E0B] mb-1">
              +500 XP ⭐
            </motion.div>

            <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 2.4
        }} className="text-[14px] text-[#8E8E93] mb-5 leading-relaxed">
              Your listing is live. Guests are already browsing! 🏡✨
            </motion.p>

            {/* Emoji row */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 2.0
        }} className="flex gap-2 justify-center text-2xl mb-5" aria-hidden="true">
              {['🚀', '⭐', '💰', '🏡', '✨'].map((emoji, i) => <motion.span key={`cel-emoji-${emoji}-${i}`} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 2.1 + i * 0.09
          }}>
                  {emoji}
                </motion.span>)}
            </motion.div>

            <motion.button initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 2.5,
          type: 'spring',
          stiffness: 400,
          damping: 22
        }} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.95
        }} onClick={onClose} className="w-full bg-[#1C1C1E] text-white font-bold py-4 px-6 rounded-2xl text-[16px] tracking-tight">
              Let's go! 🚀
            </motion.button>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const PricingAvailabilityScreen: React.FC = () => {
  const [price, setPrice] = useState(3500);
  const prevPriceRef = useRef(3500);
  const [selectedTier, setSelectedTier] = useState('competitive');
  const [minStay, setMinStay] = useState(2);
  const [instantBook, setInstantBook] = useState(true);
  const [priceFocused, setPriceFocused] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [earningsVisible, setEarningsVisible] = useState(false);
  const [isSweetSpot, setIsSweetSpot] = useState(false);
  const [sweetSpotBounce, setSweetSpotBounce] = useState(false);
  const [tierChanged, setTierChanged] = useState<string | null>(null);
  const [publishPressed, setPublishPressed] = useState(false);
  const monthlyTarget = Math.round(price * 14 / 1000) * 1000;
  const displayedEarnings = useSlotCounter(monthlyTarget);
  const handlePriceChange = useCallback((delta: number) => {
    setPrice(prev => {
      const next = prev + delta;
      if (next < 500) return prev;
      prevPriceRef.current = prev;
      const wasSweet = prev >= SWEET_SPOT_MIN && prev <= SWEET_SPOT_MAX;
      const nowSweet = next >= SWEET_SPOT_MIN && next <= SWEET_SPOT_MAX;
      if (!wasSweet && nowSweet) {
        setIsSweetSpot(true);
        setSweetSpotBounce(true);
        setTimeout(() => setSweetSpotBounce(false), 2200);
      } else if (wasSweet && !nowSweet) {
        setIsSweetSpot(false);
      }
      return next;
    });
    setEarningsVisible(true);
    setPriceFocused(true);
    setTimeout(() => setPriceFocused(false), 900);
  }, []);
  const handleSelectTier = useCallback((id: string) => {
    setSelectedTier(id);
    setTierChanged(id);
    setTimeout(() => setTierChanged(null), 700);
  }, []);
  const handlePublish = useCallback(() => {
    if (publishPressed) return;
    setPublishPressed(true);
    setProgressComplete(true);
    setTimeout(() => {
      setConfettiActive(true);
      setFireworksActive(true);
      setShowCelebration(true);
    }, 500);
    setTimeout(() => {
      setConfettiActive(false);
      setFireworksActive(false);
    }, 5500);
  }, [publishPressed]);
  const handleCloseCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);
  return <div className="flex flex-col min-h-screen bg-white text-[#1C1C1E] antialiased" style={{
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  }}>
      {/* Global effects */}
      <ConfettiExplosion active={confettiActive} />
      <FireworksCorner active={fireworksActive} side="left" />
      <FireworksCorner active={fireworksActive} side="right" />
      <MegaCelebrationOverlay visible={showCelebration} onClose={handleCloseCelebration} />

      {/* ─── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="p-1 -ml-1 text-[#1C1C1E]" aria-label="Go back">
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>
            <h1 className="text-[17px] font-semibold tracking-tight">Pricing & Availability</h1>
          </div>
          <ProgressBar complete={progressComplete} />
        </div>
      </header>

      <main className="flex-1 pb-36">

        {/* ─── Hero ───────────────────────────────────────── */}
        <section className="px-5 pt-6 pb-2">
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4
        }}>
            <h2 className="text-[24px] font-bold tracking-[-0.4px] mb-1.5">
              <span>Almost there! </span>
              <span aria-hidden="true">🏡</span>
            </h2>
            <p className="text-[14px] text-[#8E8E93]">
              <span>Set your price and </span>
              <strong className="text-[#1C1C1E]">go live</strong>
              <span> — this is the final step </span>
              <span aria-hidden="true">🚀</span>
            </p>
          </motion.div>
        </section>

        {/* ─── Smart Pricing tip ─────────────────────────── */}
        <motion.div initial={{
        opacity: 0,
        x: -12
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }} className="mx-5 mt-3 flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <span className="text-xl shrink-0" aria-hidden="true">💡</span>
          <p className="text-[13px] text-amber-800 font-medium leading-snug">
            Smart pricing auto-adjusts for weekends & holidays. You earn more, effortlessly.
          </p>
        </motion.div>

        {/* ─── Price Input ────────────────────────────────── */}
        <motion.div className={cn('mx-5 mt-5 rounded-[22px] overflow-hidden transition-shadow duration-300', priceFocused ? 'shadow-[0_0_0_3px_rgba(16,185,129,0.3),0_6px_24px_rgba(16,185,129,0.18)]' : isSweetSpot ? 'shadow-[0_0_0_3px_rgba(245,158,11,0.4),0_6px_24px_rgba(245,158,11,0.2)]' : 'shadow-[0_2px_16px_rgba(0,0,0,0.07)]')} animate={priceFocused ? {
        scale: [1, 1.012, 1]
      } : {}} transition={{
        duration: 0.35
      }}>
          <div className="p-6" style={{
          background: isSweetSpot ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' : '#F2F2F7'
        }}>
            <div className="flex items-center justify-between">
              <motion.button onClick={() => handlePriceChange(-100)} whileTap={{
              scale: 0.82
            }} whileHover={{
              scale: 1.1
            }} className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_2px_6px_rgba(28,28,30,0.1)]" aria-label="Decrease price by 100">
                <Minus className="w-5 h-5 text-[#1C1C1E]" strokeWidth={2.5} />
              </motion.button>

              <div className="flex flex-col items-center">
                <AnimatedPriceDisplay price={price} isSweetSpot={isSweetSpot} />
                <motion.span animate={{
                color: isSweetSpot ? '#B45309' : '#8E8E93'
              }} className="text-[15px] -mt-1">
                  /night
                </motion.span>
              </div>

              <motion.button onClick={() => handlePriceChange(100)} whileTap={{
              scale: 0.82
            }} whileHover={{
              scale: 1.1
            }} className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_2px_6px_rgba(28,28,30,0.1)]" aria-label="Increase price by 100">
                <Plus className="w-5 h-5 text-[#1C1C1E]" strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Bar chart */}
            <div className="mt-4">
              <BarChart price={price} />
            </div>

            <p className="text-[11px] text-[#8E8E93] text-center mt-1">
              Demand forecast for your area
            </p>
          </div>

          {/* Sweet spot banner */}
          <AnimatePresence>
            {isSweetSpot && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} transition={{
            duration: 0.35,
            ease: 'easeOut'
          }} className="overflow-hidden">
                <motion.div animate={sweetSpotBounce ? {
              y: [0, -6, 2, -3, 0],
              scale: [1, 1.03, 1]
            } : {}} transition={{
              duration: 0.7
            }} className="px-5 py-3 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400">
                  <motion.span animate={{
                rotate: [0, -15, 15, -10, 0],
                scale: [1, 1.3, 1]
              }} transition={{
                duration: 0.8,
                repeat: sweetSpotBounce ? 1 : 0
              }} className="text-lg" aria-hidden="true">
                    💥
                  </motion.span>
                  <p className="text-[13px] font-bold text-amber-900">
                    Perfect price! You'll get more bookings!
                  </p>
                </motion.div>
              </motion.div>}
          </AnimatePresence>
        </motion.div>

        {/* Earnings insight with slot-counter */}
        <AnimatePresence>
          {earningsVisible && <motion.div initial={{
          opacity: 0,
          y: -10,
          height: 0,
          marginTop: 0
        }} animate={{
          opacity: 1,
          y: 0,
          height: 'auto',
          marginTop: 12
        }} exit={{
          opacity: 0,
          y: -10,
          height: 0,
          marginTop: 0
        }} transition={{
          duration: 0.4,
          ease: 'easeOut'
        }} className="mx-5 overflow-hidden">
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-[16px] px-4 py-3">
                <span className="text-xl shrink-0" aria-hidden="true">💰</span>
                <div>
                  <p className="text-[13px] font-semibold text-emerald-800 leading-snug">
                    <span>Potential monthly earnings: </span>
                    <motion.span key={displayedEarnings} className="tabular-nums font-extrabold text-emerald-700">
                      ₹{displayedEarnings.toLocaleString()}
                    </motion.span>
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">Based on typical occupancy in your area</p>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>

        {/* ─── Pricing Strategy ──────────────────────────── */}
        <section className="mt-8">
          <div className="px-5 mb-3">
            <span className="text-[12px] font-semibold tracking-[0.3px] text-[#8E8E93] uppercase">
              Pricing Strategy
            </span>
          </div>
          <div className="px-5 space-y-2.5">
            {PRICING_TIERS.map(tier => {
            const isSelected = selectedTier === tier.id;
            const isJustChanged = tierChanged === tier.id;
            return <motion.button key={tier.id} onClick={() => handleSelectTier(tier.id)} whileTap={{
              scale: 0.97
            }} animate={isJustChanged ? {
              scale: [1, 1.03, 1]
            } : {
              scale: 1
            }} transition={{
              duration: 0.35
            }} className={cn('w-full flex items-center justify-between p-4 rounded-[14px] transition-colors duration-200', isSelected ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-[#1C1C1E]')}>
                  <div className="flex items-center gap-4">
                    <motion.div animate={isSelected ? {
                  scale: [1, 1.2, 1]
                } : {
                  scale: 1
                }} transition={{
                  duration: 0.35
                }} className={cn('w-10 h-10 rounded-full flex items-center justify-center', isSelected ? 'bg-white/15' : 'bg-white shadow-sm')}>
                      {tier.icon}
                    </motion.div>
                    <div className="text-left">
                      <p className="text-[14px] font-semibold leading-none mb-1">{tier.title}</p>
                      <p className={cn('text-[12px]', isSelected ? 'text-gray-400' : 'text-[#8E8E93]')}>
                        {tier.subtitle}
                      </p>
                    </div>
                  </div>
                  <motion.div animate={isSelected ? {
                scale: [0.6, 1.2, 1],
                backgroundColor: '#10B981',
                borderColor: '#10B981'
              } : {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: '#D1D5DB'
              }} transition={{
                duration: 0.3
              }} className="w-5 h-5 rounded-full border flex items-center justify-center">
                    <AnimatePresence>
                      {isSelected && <motion.div initial={{
                    scale: 0,
                    opacity: 0
                  }} animate={{
                    scale: 1,
                    opacity: 1
                  }} exit={{
                    scale: 0,
                    opacity: 0
                  }} transition={{
                    duration: 0.2
                  }}>
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </motion.div>}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>;
          })}
          </div>
        </section>

        {/* ─── Calendar ──────────────────────────────────── */}
        <CalendarSection />

        {/* ─── Minimum Stay ──────────────────────────────── */}
        <section className="mt-8">
          <div className="px-5 mb-3">
            <span className="text-[12px] font-semibold tracking-[0.3px] text-[#8E8E93] uppercase">
              Minimum Stay
            </span>
          </div>
          <div className="px-5 flex gap-2">
            {MINIMUM_STAY_OPTIONS.map(option => <motion.button key={option.value} onClick={() => setMinStay(option.value)} whileTap={{
            scale: 0.88
          }} animate={minStay === option.value ? {
            scale: [1, 1.1, 1]
          } : {
            scale: 1
          }} transition={{
            duration: 0.28
          }} className={cn('px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 border', minStay === option.value ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]' : 'bg-white text-[#1C1C1E] border-gray-200')}>
                {option.label}
              </motion.button>)}
          </div>
        </section>

        {/* ─── Instant Book ──────────────────────────────── */}
        <section className="mt-8 px-5">
          <div className="mb-3">
            <span className="text-[12px] font-semibold tracking-[0.3px] text-[#8E8E93] uppercase">
              Booking Preferences
            </span>
          </div>
          <motion.div animate={{
          backgroundColor: instantBook ? '#F2F2F7' : '#F9FAFB'
        }} className="flex items-center justify-between p-4 rounded-[14px]">
            <div className="flex items-center gap-4">
              <motion.div animate={instantBook ? {
              rotate: [0, -14, 14, -8, 0],
              scale: [1, 1.2, 1]
            } : {}} transition={{
              duration: 0.5
            }} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#1C1C1E]" fill="currentColor" />
              </motion.div>
              <div>
                <p className="text-[14px] font-semibold mb-0.5">Instant Book</p>
                <p className="text-[12px] text-[#8E8E93]">Guests can book without approval</p>
              </div>
            </div>
            <IOSSlider enabled={instantBook} onToggle={() => setInstantBook(v => !v)} />
          </motion.div>
        </section>

        {/* ─── Encouragement ─────────────────────────────── */}
        <motion.div initial={{
        opacity: 0,
        y: 14
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7,
        duration: 0.5
      }} className="mx-5 mt-8 flex items-center gap-3">
          <motion.span animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }} transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 3
        }} className="text-2xl" aria-hidden="true">
            ⭐
          </motion.span>
          <p className="text-[13px] text-[#8E8E93] leading-snug">
            <strong className="text-[#1C1C1E]">One more tap</strong> and your listing goes live — you've crushed it!
          </p>
        </motion.div>
      </main>

      {/* ─── Fixed Publish Bar ─────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button className="text-[16px] font-medium text-[#1C1C1E] px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
            Back
          </button>

          {/* Publish CTA */}
          <motion.button onClick={handlePublish} disabled={publishPressed} whileTap={{
          scale: 0.93,
          y: 2
        }} whileHover={{
          scale: 1.03
        }} animate={{
          boxShadow: publishPressed ? ['0 0 0px rgba(245,158,11,0)', '0 0 40px rgba(245,158,11,0.8)', '0 0 0px rgba(245,158,11,0)'] : ['0 4px 20px rgba(16,185,129,0.35)', '0 4px 36px rgba(16,185,129,0.65)', '0 4px 20px rgba(16,185,129,0.35)'],
          scale: publishPressed ? [1, 0.94, 1.06, 1] : [1, 1.016, 1]
        }} transition={publishPressed ? {
          duration: 0.4,
          ease: 'easeOut'
        } : {
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut'
        }} className={cn('w-[65%] text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-[16px] overflow-hidden', publishPressed ? 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]' : 'bg-gradient-to-r from-[#10B981] to-[#059669]')} style={{
          position: 'relative'
        }}>
            {/* Shimmer sweep */}
            <motion.div animate={{
            x: ['-120%', '220%']
          }} transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.4,
            ease: 'linear'
          }} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            pointerEvents: 'none'
          }} />
            <motion.div animate={publishPressed ? {
            rotate: [0, 360],
            scale: [1, 1.4, 1]
          } : {}} transition={{
            duration: 0.6
          }}>
              <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
            </motion.div>
            <span>{publishPressed ? 'Going Live! 🎉' : 'Publish Listing 🚀'}</span>
          </motion.button>
        </div>
      </div>
    </div>;
};