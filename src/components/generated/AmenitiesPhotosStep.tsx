import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Plus, Check, Star, Trophy, Flame, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Amenity {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  selected: boolean;
}
interface ToastMsg {
  id: string;
  message: string;
  type: 'default' | 'milestone';
}
interface UploadedPhoto {
  id: string;
  url: string;
  isMain: boolean;
}
interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  size: number;
  delay: number;
}
interface FloatingLabel {
  id: number;
  label: string;
  x: number;
  y: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_AMENITIES: Amenity[] = [{
  id: 'wifi',
  label: 'WiFi',
  emoji: '📶',
  color: '#3B82F6',
  bgColor: '#EFF6FF',
  selected: true
}, {
  id: 'kitchen',
  label: 'Kitchen',
  emoji: '🍳',
  color: '#F59E0B',
  bgColor: '#FFFBEB',
  selected: true
}, {
  id: 'mountain',
  label: 'Mountain View',
  emoji: '🏔️',
  color: '#6366F1',
  bgColor: '#EEF2FF',
  selected: true
}, {
  id: 'water',
  label: 'Hot Water',
  emoji: '🚿',
  color: '#06B6D4',
  bgColor: '#ECFEFF',
  selected: true
}, {
  id: 'parking',
  label: 'Parking',
  emoji: '🚗',
  color: '#64748B',
  bgColor: '#F1F5F9',
  selected: true
}, {
  id: 'heater',
  label: 'Heater',
  emoji: '🔥',
  color: '#EF4444',
  bgColor: '#FEF2F2',
  selected: true
}, {
  id: 'tv',
  label: 'TV',
  emoji: '📺',
  color: '#8B5CF6',
  bgColor: '#F5F3FF',
  selected: true
}, {
  id: 'balcony',
  label: 'Balcony',
  emoji: '🏡',
  color: '#10B981',
  bgColor: '#ECFDF5',
  selected: true
}, {
  id: 'pool',
  label: 'Pool',
  emoji: '🏊',
  color: '#0EA5E9',
  bgColor: '#F0F9FF',
  selected: false
}, {
  id: 'gym',
  label: 'Gym',
  emoji: '💪',
  color: '#F97316',
  bgColor: '#FFF7ED',
  selected: false
}, {
  id: 'pets',
  label: 'Pet Friendly',
  emoji: '🐾',
  color: '#EC4899',
  bgColor: '#FDF2F8',
  selected: false
}, {
  id: 'laundry',
  label: 'Laundry',
  emoji: '👕',
  color: '#14B8A6',
  bgColor: '#F0FDFA',
  selected: false
}];
const PHOTO_SLOTS = [{
  id: 'slot-1',
  isMain: false
}, {
  id: 'slot-2',
  isMain: false
}, {
  id: 'slot-3',
  isMain: false
}];
const PLACEHOLDER_URLS = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&q=80', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80'];
const CONFETTI_COLORS = ['#FF385C', '#FFD700', '#00C851', '#3B82F6', '#A855F7', '#F97316', '#06B6D4'];
const GLOBAL_STYLES = `
@keyframes dash-march {
  to { stroke-dashoffset: -20; }
}
@keyframes color-sweep {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0% 0 0); }
}
@keyframes gold-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes camera-flash {
  0% { opacity: 0; }
  20% { opacity: 0.85; }
  100% { opacity: 0; }
}
@keyframes confetti-fall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes mascot-hop {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-5deg); }
  75% { transform: translateY(-4px) rotate(3deg); }
}
@keyframes mascot-excited {
  0%, 100% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.3) rotate(-10deg); }
  40% { transform: scale(1.3) rotate(10deg); }
  60% { transform: scale(1.15) rotate(-5deg); }
  80% { transform: scale(1.15) rotate(5deg); }
}
@keyframes mascot-chefjump {
  0%, 100% { transform: translateY(0px) scale(1); }
  30% { transform: translateY(-14px) scale(1.2); }
  60% { transform: translateY(-6px) scale(1.1); }
}
@keyframes mascot-idle {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
}
@keyframes float-up-fade {
  0% { transform: translateY(0px); opacity: 1; }
  100% { transform: translateY(-60px); opacity: 0; }
}
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes bounce-in {
  0% { transform: scale(0) rotate(-10deg); }
  60% { transform: scale(1.25) rotate(5deg); }
  80% { transform: scale(0.92) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes trophy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-12px) scale(1.15); }
  60% { transform: translateY(-5px) scale(1.07); }
}
@keyframes shimmer-sweep {
  0% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 0.6; }
  100% { opacity: 0; transform: translateX(100%); }
}
@keyframes photo-flip-in {
  0% { transform: perspective(600px) rotateY(-90deg); opacity: 0; }
  60% { transform: perspective(600px) rotateY(10deg); opacity: 1; }
  100% { transform: perspective(600px) rotateY(0deg); opacity: 1; }
}
@keyframes marching-dashes {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -40; }
}
@keyframes liquid-fill {
  0% { transform: scaleX(0); transform-origin: left; }
  100% { transform: scaleX(1); transform-origin: left; }
}
`;

// ─── Confetti ─────────────────────────────────────────────────────────────────

const ConfettiExplosion = ({
  active
}: {
  active: boolean;
}) => {
  const pieces = useRef<ConfettiPiece[]>([]);
  if (pieces.current.length === 0) {
    pieces.current = Array.from({
      length: 32
    }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.5
    }));
  }
  if (!active) return null;
  return <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden'
  }}>
      {pieces.current.map(p => <div key={p.id} style={{
      position: 'absolute',
      left: `${p.x}%`,
      top: '-20px',
      width: `${p.size}px`,
      height: `${p.size}px`,
      backgroundColor: p.color,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      transform: `rotate(${p.rotation}deg)`,
      animation: `confetti-fall ${1.2 + Math.random() * 0.8}s ease-in ${p.delay}s forwards`
    }} />)}
    </div>;
};

// ─── Gold Shimmer Overlay ──────────────────────────────────────────────────────

const GoldShimmerOverlay = ({
  active
}: {
  active: boolean;
}) => {
  if (!active) return null;
  return <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9998,
    overflow: 'hidden'
  }}>
      <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '150%',
      height: '100%',
      background: 'linear-gradient(105deg, transparent 20%, rgba(255,215,0,0.35) 50%, transparent 80%)',
      animation: 'shimmer-sweep 1.2s ease-in-out forwards'
    }} />
    </div>;
};

// ─── Camera Flash ──────────────────────────────────────────────────────────────

const CameraFlash = ({
  active
}: {
  active: boolean;
}) => {
  if (!active) return null;
  return <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    pointerEvents: 'none',
    zIndex: 9997,
    animation: 'camera-flash 0.25s ease-out forwards'
  }} />;
};

// ─── Milestone Banner ─────────────────────────────────────────────────────────

interface MilestoneBannerProps {
  milestone: number | null;
  onDone: () => void;
}
const MilestoneBanner = ({
  milestone,
  onDone
}: MilestoneBannerProps) => {
  useEffect(() => {
    if (milestone !== null) {
      const t = setTimeout(onDone, 3800);
      return () => clearTimeout(t);
    }
  }, [milestone, onDone]);
  const config = milestone === 3 ? {
    emoji: '🎉',
    title: '3 amenities!',
    sub: 'Guests love this!',
    bg: 'linear-gradient(135deg,#FF385C,#FF6B35)',
    mascotAnim: 'mascot-hop 0.6s ease-in-out 3'
  } : milestone === 5 ? {
    emoji: '🔥',
    title: 'Top Host material!',
    sub: 'You\'re crushing it!',
    bg: 'linear-gradient(135deg,#F97316,#EF4444)',
    mascotAnim: 'mascot-chefjump 0.5s ease-in-out 4'
  } : {
    emoji: '🏆',
    title: 'Superhost level unlocked!',
    sub: 'You\'re legendary ✨',
    bg: 'linear-gradient(135deg,#F59E0B,#D97706)',
    mascotAnim: 'trophy-bounce 0.6s ease-in-out 4'
  };
  return <AnimatePresence>
      {milestone !== null && <motion.div initial={{
      y: -120,
      opacity: 0,
      scale: 0.85
    }} animate={{
      y: 0,
      opacity: 1,
      scale: 1
    }} exit={{
      y: -100,
      opacity: 0,
      scale: 0.9
    }} transition={{
      type: 'spring',
      stiffness: 420,
      damping: 24
    }} style={{
      position: 'fixed',
      top: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 22px',
      borderRadius: '22px',
      background: config.bg,
      boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
      minWidth: '240px',
      maxWidth: '340px'
    }}>
          <span style={{
        fontSize: '32px',
        lineHeight: 1,
        animation: config.mascotAnim,
        display: 'inline-block'
      }}>
            {config.emoji}
          </span>
          <div>
            <p style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: '15px',
          fontWeight: 700,
          color: '#fff',
          margin: 0
        }}>
              {config.title}
            </p>
            <p style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          margin: '2px 0 0'
        }}>
              {config.sub}
            </p>
          </div>
        </motion.div>}
    </AnimatePresence>;
};

// ─── Toast ─────────────────────────────────────────────────────────────────────

const ToastNotification = ({
  msg,
  onDone
}: {
  msg: ToastMsg;
  onDone: (id: string) => void;
}) => {
  useEffect(() => {
    const t = setTimeout(() => onDone(msg.id), 3200);
    return () => clearTimeout(t);
  }, [msg.id, onDone]);
  return <motion.div layout initial={{
    opacity: 0,
    y: 60,
    scale: 0.85
  }} animate={{
    opacity: 1,
    y: 0,
    scale: 1
  }} exit={{
    opacity: 0,
    y: 20,
    scale: 0.9
  }} transition={{
    type: 'spring',
    stiffness: 420,
    damping: 28
  }} style={{
    backgroundColor: '#1C1C1E',
    borderRadius: '16px',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
    maxWidth: '320px'
  }}>
      <span style={{
      fontSize: '20px',
      lineHeight: 1
    }}>{msg.message.slice(0, 2)}</span>
      <span style={{
      fontFamily: 'Inter,sans-serif',
      fontSize: '13px',
      fontWeight: 500,
      color: '#FFFFFF',
      lineHeight: 1.4
    }}>
        {msg.message.slice(2).trim()}
      </span>
    </motion.div>;
};

// ─── Header with Mascot Progress Bar ─────────────────────────────────────────

const Header = ({
  selectedCount,
  photoCount
}: {
  selectedCount: number;
  photoCount: number;
}) => {
  const progress = Math.min(50 + Math.round(selectedCount / 12 * 15) + Math.round(photoCount / 4 * 10), 75);
  const mascotLeft = `calc(${progress}% - 14px)`;
  return <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <button className="p-1 -ml-2 text-[#1C1C1E] active:scale-95 transition-transform" aria-label="Go back">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 style={{
        fontFamily: 'Inter,sans-serif',
        fontSize: '17px',
        fontWeight: 500,
        letterSpacing: '-0.1px',
        color: '#1C1C1E'
      }}>
          Amenities &amp; Photos
        </h1>
        <div className="w-8" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: '11px',
          fontWeight: 400,
          color: '#8E8E93'
        }}>
            Step 3 of 5
          </span>
          <motion.span key={progress} initial={{
          opacity: 0,
          y: -4
        }} animate={{
          opacity: 1,
          y: 0
        }} style={{
          fontFamily: 'Inter,sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          color: '#FF385C'
        }}>
            {progress}% complete
          </motion.span>
        </div>

        {/* Progress bar with mascot */}
        <div style={{
        position: 'relative',
        height: '28px',
        display: 'flex',
        alignItems: 'center'
      }}>
          <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '8px',
          transform: 'translateY(-50%)',
          backgroundColor: '#F2F2F7',
          borderRadius: '99px',
          overflow: 'hidden'
        }}>
            <motion.div animate={{
            width: `${progress}%`
          }} transition={{
            type: 'spring',
            stiffness: 60,
            damping: 16
          }} style={{
            height: '100%',
            borderRadius: '99px',
            background: 'linear-gradient(90deg, #FF385C 0%, #FF8C00 100%)',
            boxShadow: '0 0 8px rgba(255,56,92,0.5)'
          }} />
          </div>
          {/* Mascot on progress bar */}
          <motion.div animate={{
          left: mascotLeft
        }} transition={{
          type: 'spring',
          stiffness: 60,
          damping: 14
        }} style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '22px',
          lineHeight: 1,
          animation: 'mascot-idle 2s ease-in-out infinite',
          zIndex: 2,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
        }}>
            🦉
          </motion.div>
        </div>
      </div>
    </header>;
};

// ─── Amenity Tile ─────────────────────────────────────────────────────────────

interface AmenityTileProps {
  amenity: Amenity;
  index: number;
  onToggle: (id: string, event: React.MouseEvent) => void;
}
const AmenityTile = ({
  amenity,
  index,
  onToggle
}: AmenityTileProps) => {
  const [collecting, setCollecting] = useState(false);
  const [floatingLabels, setFloatingLabels] = useState<FloatingLabel[]>([]);
  const nextLabelId = useRef(0);
  const tileRef = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent) => {
    if (!amenity.selected) {
      setCollecting(true);
      // Spawn floating "⭐ Collected!" label
      const rect = tileRef.current?.getBoundingClientRect();
      const id = nextLabelId.current++;
      setFloatingLabels(prev => [...prev, {
        id,
        label: '⭐ Collected!',
        x: 50,
        y: 10
      }]);
      setTimeout(() => setFloatingLabels(prev => prev.filter(l => l.id !== id)), 900);
      setTimeout(() => setCollecting(false), 700);
    }
    onToggle(amenity.id, e);
  };
  const selectVariants = {
    idle: {
      scale: 1,
      rotate: 0
    },
    collect: {
      scale: [1, 0, 1.25, 1.05, 1],
      rotate: [0, 0, -12, 10, -5, 0],
      transition: {
        duration: 0.55,
        times: [0, 0.15, 0.45, 0.7, 0.85, 1]
      }
    },
    deselect: {
      scale: [1, 1.1, 0.85, 1],
      transition: {
        duration: 0.3
      }
    }
  };
  return <motion.button ref={tileRef} initial={{
    opacity: 0,
    scale: 0.6,
    y: 16
  }} animate={{
    opacity: 1,
    scale: 1,
    y: 0
  }} transition={{
    type: 'spring',
    stiffness: 350,
    damping: 22,
    delay: index * 0.04
  }} onClick={handleClick} className="flex flex-col items-center justify-center py-4 px-2 rounded-[16px] outline-none" style={{
    position: 'relative',
    overflow: 'visible',
    backgroundColor: amenity.selected ? amenity.color : amenity.bgColor,
    border: `2px solid ${amenity.selected ? amenity.color : 'transparent'}`,
    boxShadow: amenity.selected ? `0 6px 18px ${amenity.color}50` : '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'background-color 0.25s, box-shadow 0.25s, border-color 0.25s'
  }}>
      {/* Color sweep overlay on select */}
      {collecting && <div style={{
      position: 'absolute',
      inset: 0,
      borderRadius: '14px',
      backgroundColor: amenity.color,
      animation: 'color-sweep 0.35s ease-out forwards',
      pointerEvents: 'none',
      zIndex: 1
    }} />}

      {/* Pulse ring on select */}
      {collecting && <div style={{
      position: 'absolute',
      inset: '-4px',
      borderRadius: '18px',
      border: `3px solid ${amenity.color}`,
      animation: 'pulse-ring 0.5s ease-out forwards',
      pointerEvents: 'none',
      zIndex: 0
    }} />}

      {/* Floating labels */}
      {floatingLabels.map(fl => <div key={fl.id} style={{
      position: 'absolute',
      bottom: '110%',
      left: '50%',
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      fontFamily: 'Inter,sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      color: amenity.color,
      backgroundColor: 'white',
      borderRadius: '99px',
      padding: '3px 8px',
      boxShadow: `0 2px 12px ${amenity.color}40`,
      animation: 'float-up-fade 0.85s ease-out forwards',
      pointerEvents: 'none',
      zIndex: 10
    }}>
          {fl.label}
        </div>)}

      {/* Icon + emoji area */}
      <motion.div animate={collecting ? 'collect' : amenity.selected ? 'idle' : 'idle'} variants={selectVariants} style={{
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px'
    }}>
        <AnimatePresence mode="wait">
          {amenity.selected && !collecting ? <motion.span key="check" initial={{
          scale: 0,
          rotate: -30
        }} animate={{
          scale: 1,
          rotate: 0,
          transition: {
            type: 'spring',
            stiffness: 600,
            damping: 20
          }
        }} exit={{
          scale: 0
        }} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
              <Check size={22} strokeWidth={3} color="#FFFFFF" />
            </motion.span> : <motion.span key="emoji" initial={{
          scale: 0.6
        }} animate={{
          scale: 1,
          rotate: collecting ? [-15, 15, -10, 10, 0] : 0,
          transition: collecting ? {
            duration: 0.45
          } : {
            duration: 0.2
          }
        }} style={{
          fontSize: '24px',
          lineHeight: 1
        }}>
              {amenity.emoji}
            </motion.span>}
        </AnimatePresence>
      </motion.div>

      <span style={{
      position: 'relative',
      zIndex: 2,
      marginTop: '6px',
      fontFamily: 'Inter,sans-serif',
      fontSize: '10.5px',
      fontWeight: amenity.selected ? 700 : 400,
      color: amenity.selected ? '#FFFFFF' : '#3A3A3C',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '100%',
      display: 'block'
    }}>
        {amenity.label}
      </span>
    </motion.button>;
};

// ─── Marching Dashes Border SVG ───────────────────────────────────────────────

const MarchingDashesBorder = ({
  width,
  height,
  radius,
  active
}: {
  width: number;
  height: number;
  radius: number;
  active: boolean;
}) => {
  const perimeter = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;
  return <svg width={width} height={height} style={{
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 1
  }}>
      <rect x="2" y="2" width={width - 4} height={height - 4} rx={radius} ry={radius} fill="none" stroke={active ? '#FF385C' : '#C7C7CC'} strokeWidth="2" strokeDasharray="8 6" strokeDashoffset="0" style={active ? {
      animation: 'marching-dashes 0.5s linear infinite'
    } : {}} />
    </svg>;
};

// ─── Photo Slot ───────────────────────────────────────────────────────────────

interface PhotoSlotProps {
  isMain: boolean;
  uploaded: UploadedPhoto | null;
  onUpload: () => void;
  floatLabel: string | null;
}
const PhotoSlot = ({
  isMain,
  uploaded,
  onUpload,
  floatLabel
}: PhotoSlotProps) => {
  const [hovered, setHovered] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const [dims, setDims] = useState({
    w: 0,
    h: 0
  });
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDims({
        w: rect.width,
        h: rect.height
      });
    }
  }, []);
  const handleClick = () => {
    if (!uploaded) {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 300);
    }
    onUpload();
  };
  if (uploaded) {
    return <div style={{
      position: 'relative'
    }}>
        <motion.div initial={{
        rotateY: -90,
        opacity: 0
      }} animate={{
        rotateY: 0,
        opacity: 1
      }} transition={{
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
      }} style={{
        perspective: '600px'
      }} className={cn('rounded-[14px] overflow-hidden', isMain ? 'w-full h-[160px]' : 'w-full h-[90px]')}>
          <img src={uploaded.url} alt="Uploaded property photo" className="w-full h-full object-cover" />
          {/* Shine overlay */}
          <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
          borderRadius: '14px',
          pointerEvents: 'none'
        }} />
        </motion.div>
        {/* Floating Beautiful label */}
        <AnimatePresence>
          {floatLabel && <motion.div initial={{
          y: 0,
          opacity: 1
        }} animate={{
          y: -55,
          opacity: 0
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.9,
          ease: 'easeOut'
        }} style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter,sans-serif',
          fontSize: '12px',
          fontWeight: 700,
          color: '#1C1C1E',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '99px',
          padding: '4px 12px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
          zIndex: 5
        }}>
              {floatLabel}
            </motion.div>}
        </AnimatePresence>
      </div>;
  }
  return <button ref={containerRef} onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={cn('flex flex-col items-center justify-center cursor-pointer', isMain ? 'w-full h-[160px] rounded-[16px]' : 'w-full h-[90px] rounded-[12px]')} style={{
    position: 'relative',
    backgroundColor: hovered ? '#FFF0F3' : '#F9F9FB',
    overflow: 'hidden',
    transition: 'background-color 0.2s',
    boxShadow: hovered ? '0 0 0 3px rgba(255,56,92,0.15)' : 'none'
  }}>
      {/* Camera flash overlay */}
      {flashing && <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'white',
      borderRadius: isMain ? '16px' : '12px',
      animation: 'camera-flash 0.25s ease-out forwards',
      pointerEvents: 'none',
      zIndex: 3
    }} />}

      {/* Marching dashes border via SVG – rendered after dims are known */}
      {dims.w > 0 && <MarchingDashesBorder width={dims.w} height={dims.h} radius={isMain ? 16 : 12} active={hovered} />}

      {isMain ? <React.Fragment>
          <motion.span animate={hovered ? {
        rotate: [-8, 8, -6, 4, 0],
        scale: [1, 1.15, 1.1, 1.05, 1]
      } : {
        rotate: 0,
        scale: 1
      }} transition={{
        duration: 0.5
      }} style={{
        fontSize: '32px',
        lineHeight: 1,
        position: 'relative',
        zIndex: 2
      }}>
            📷
          </motion.span>
          <span style={{
        marginTop: '10px',
        fontFamily: 'Inter,sans-serif',
        fontSize: '15px',
        fontWeight: 700,
        color: '#1C1C1E',
        position: 'relative',
        zIndex: 2
      }}>
            Show off your space!
          </span>
          <span style={{
        marginTop: '4px',
        fontFamily: 'Inter,sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        color: hovered ? '#FF385C' : '#8E8E93',
        position: 'relative',
        zIndex: 2,
        transition: 'color 0.2s'
      }}>
            {hovered ? 'Tap to add your cover photo ✨' : '1200×800px recommended'}
          </span>
        </React.Fragment> : <motion.span animate={{
      scale: hovered ? 1.25 : 1,
      rotate: hovered ? 18 : 0
    }} transition={{
      type: 'spring',
      stiffness: 400,
      damping: 18
    }} style={{
      position: 'relative',
      zIndex: 2
    }}>
          <Plus size={22} color={hovered ? '#FF385C' : '#8E8E93'} />
        </motion.span>}
    </button>;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AmenitiesPhotosStep: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>(INITIAL_AMENITIES);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [goldShimmer, setGoldShimmer] = useState(false);
  const [photoFloatLabels, setPhotoFloatLabels] = useState<Record<string, string | null>>({});
  const [mascotState, setMascotState] = useState<'idle' | 'excited' | 'chefjump'>('idle');
  const prevCountRef = useRef(INITIAL_AMENITIES.filter(a => a.selected).length);
  const celebratedRef = useRef<Set<number>>(new Set([3, 5])); // pre-selected 8 so skip early milestones
  const styleInjected = useRef(false);
  useEffect(() => {
    if (!styleInjected.current) {
      const el = document.createElement('style');
      el.textContent = GLOBAL_STYLES;
      document.head.appendChild(el);
      styleInjected.current = true;
    }
  }, []);
  const addToast = useCallback((message: string, type: ToastMsg['type'] = 'default') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, {
      id,
      message,
      type
    }]);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  const clearMilestone = useCallback(() => {
    setMilestone(null);
    setConfettiActive(false);
    setGoldShimmer(false);
  }, []);
  const triggerMilestone = useCallback((count: number) => {
    if (celebratedRef.current.has(count)) return;
    celebratedRef.current.add(count);
    if (count === 3) {
      setMilestone(3);
      setConfettiActive(true);
      setMascotState('excited');
      setTimeout(() => setMascotState('idle'), 2000);
    } else if (count === 5) {
      setMilestone(5);
      setConfettiActive(true);
      setMascotState('chefjump');
      setTimeout(() => setMascotState('idle'), 2000);
    } else if (count === 10) {
      setMilestone(10);
      setGoldShimmer(true);
      setMascotState('excited');
      setTimeout(() => setMascotState('idle'), 2200);
    }
    setTimeout(() => setConfettiActive(false), 2200);
    setTimeout(() => setGoldShimmer(false), 1500);
  }, []);
  const toggleAmenity = (id: string, _e: React.MouseEvent) => {
    setAmenities(prev => {
      const next = prev.map(item => item.id === id ? {
        ...item,
        selected: !item.selected
      } : item);
      const newCount = next.filter(a => a.selected).length;
      const oldCount = prevCountRef.current;
      prevCountRef.current = newCount;
      if (newCount > oldCount) {
        // Mascot excited jump
        setMascotState('excited');
        setTimeout(() => setMascotState('idle'), 800);

        // Check milestones
        setTimeout(() => {
          if (newCount === 3) triggerMilestone(3);else if (newCount === 5) triggerMilestone(5);else if (newCount === 10) triggerMilestone(10);else if (newCount % 3 === 0 && newCount >= 6) {
            addToast('😍 Great amenities = happy guests!');
          }
        }, 200);
      }
      return next;
    });
  };
  const handlePhotoUpload = (slotId: string, isMain: boolean) => {
    const alreadyUploaded = uploadedPhotos.find(p => p.id === slotId);
    if (alreadyUploaded) return;
    const urlIndex = uploadedPhotos.length % PLACEHOLDER_URLS.length;
    setUploadedPhotos(prev => {
      const next = [...prev, {
        id: slotId,
        url: PLACEHOLDER_URLS[urlIndex],
        isMain
      }];

      // Float label
      setTimeout(() => {
        const labels = ['📸 Beautiful!', '✨ Stunning!', '🌟 Perfect!', '🎯 Great shot!'];
        const label = labels[(next.length - 1) % labels.length];
        setPhotoFloatLabels(fl => ({
          ...fl,
          [slotId]: label
        }));
        setTimeout(() => setPhotoFloatLabels(fl => ({
          ...fl,
          [slotId]: null
        })), 1200);
      }, 100);
      setTimeout(() => {
        if (next.length === 1) addToast('📸 Beautiful! Add more to stand out ✨');else if (next.length === 3) {
          addToast('⭐⭐⭐ Great gallery! You\'re all set!');
          setConfettiActive(true);
          setTimeout(() => setConfettiActive(false), 2000);
        }
      }, 300);
      return next;
    });
  };
  const selectedCount = amenities.filter(a => a.selected).length;
  const mascotAnimation = mascotState === 'excited' ? 'mascot-excited 0.6s ease-in-out' : mascotState === 'chefjump' ? 'mascot-chefjump 0.5s ease-in-out 2' : 'mascot-idle 2.2s ease-in-out infinite';
  return <div className="flex flex-col min-h-screen bg-white pb-32">
      {/* Global effects */}
      <ConfettiExplosion active={confettiActive} />
      <GoldShimmerOverlay active={goldShimmer} />
      <MilestoneBanner milestone={milestone} onDone={clearMilestone} />

      <Header selectedCount={selectedCount} photoCount={uploadedPhotos.length} />

      <main className="flex-1 overflow-y-auto">
        {/* ── Amenities Section ── */}
        <section>
          <div className="px-5 pt-5 pb-2">
            <div className="flex items-center gap-3 mb-1">
              {/* Mascot */}
              <span style={{
              fontSize: '34px',
              lineHeight: 1,
              display: 'inline-block',
              animation: mascotAnimation,
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))'
            }}>
                🦉
              </span>
              <div>
                <h2 style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '21px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: '#1C1C1E',
                margin: 0
              }}>
                  What do you offer?
                </h2>
                <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#8E8E93',
                margin: '2px 0 0',
                lineHeight: 1.4
              }}>
                  <span>Tap to collect amenities — guests love options!</span>
                </p>
              </div>
            </div>

            {/* Selected count badge */}
            <AnimatePresence>
              {selectedCount > 0 && <motion.div initial={{
              opacity: 0,
              scale: 0.8,
              y: 6
            }} animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }} exit={{
              opacity: 0,
              scale: 0.8
            }} transition={{
              type: 'spring',
              stiffness: 380,
              damping: 24
            }} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
              backgroundColor: '#FFF0F3',
              border: '1.5px solid #FFD6DE'
            }}>
                  <motion.span key={selectedCount} initial={{
                scale: 1.6
              }} animate={{
                scale: 1
              }} transition={{
                type: 'spring',
                stiffness: 600,
                damping: 18
              }} style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                color: '#FF385C'
              }}>
                    {selectedCount} collected
                  </motion.span>
                  {selectedCount >= 5 && <span style={{
                fontSize: '14px'
              }}>✨</span>}
                  {selectedCount >= 10 && <span style={{
                fontSize: '14px'
              }}>🏆</span>}
                </motion.div>}
            </AnimatePresence>
          </div>

          <div className="px-5 grid grid-cols-3 gap-[10px] mt-3">
            {amenities.map((amenity, index) => <AmenityTile key={amenity.id} amenity={amenity} index={index} onToggle={toggleAmenity} />)}
          </div>

          {/* Milestone hint strip */}
          <div className="px-5 mt-4 flex items-center gap-2">
            {[3, 5, 10].map(ms => <div key={ms} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{
            backgroundColor: selectedCount >= ms ? ms === 10 ? '#FEF3C7' : ms === 5 ? '#FFF7ED' : '#F0FDF4' : '#F9F9FB',
            border: `1px solid ${selectedCount >= ms ? ms === 10 ? '#F59E0B' : ms === 5 ? '#F97316' : '#22C55E' : '#E5E5EA'}`,
            transition: 'all 0.3s'
          }}>
                <span style={{
              fontSize: '12px'
            }}>{ms === 10 ? '🏆' : ms === 5 ? '🔥' : '🎉'}</span>
                <span style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: '10px',
              fontWeight: selectedCount >= ms ? 700 : 400,
              color: selectedCount >= ms ? '#1C1C1E' : '#8E8E93'
            }}>
                  {ms}+
                </span>
              </div>)}
            <span style={{
            fontFamily: 'Inter,sans-serif',
            fontSize: '10px',
            color: '#8E8E93'
          }}>milestones</span>
          </div>
        </section>

        {/* ── Photos Section ── */}
        <section className="mt-8">
          <div className="px-5 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <motion.span animate={{
              rotate: [-3, 3, -3],
              y: [0, -5, 0]
            }} transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }} style={{
              fontSize: '32px',
              lineHeight: 1,
              display: 'inline-block',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))'
            }}>
                📷
              </motion.span>
              <div>
                <h2 style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '21px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: '#1C1C1E',
                margin: 0
              }}>
                  Add your best photos
                </h2>
                <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#8E8E93',
                margin: '2px 0 0',
                lineHeight: 1.4
              }}>
                  <span>Each photo is a game item — collect all 4!</span>
                </p>
              </div>
            </div>

            {/* Photo progress dots */}
            <div className="flex items-center gap-2 mt-3">
              {[...Array(4)].map((_, i) => <motion.div key={i} animate={{
              scale: i < uploadedPhotos.length ? 1 : 0.85,
              backgroundColor: i < uploadedPhotos.length ? '#FF385C' : '#E5E5EA'
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20
            }} style={{
              width: i === 0 ? '28px' : '10px',
              height: '10px',
              borderRadius: '99px'
            }} />)}
              <span style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: '11px',
              color: '#8E8E93',
              marginLeft: '4px'
            }}>
                {uploadedPhotos.length}/4 photos
              </span>
            </div>
          </div>

          <div className="px-5 space-y-3">
            <PhotoSlot isMain={true} uploaded={uploadedPhotos.find(p => p.id === 'main') ?? null} onUpload={() => handlePhotoUpload('main', true)} floatLabel={photoFloatLabels['main'] ?? null} />
            <div className="grid grid-cols-3 gap-[10px]">
              {PHOTO_SLOTS.map(slot => <PhotoSlot key={slot.id} isMain={false} uploaded={uploadedPhotos.find(p => p.id === slot.id) ?? null} onUpload={() => handlePhotoUpload(slot.id, false)} floatLabel={photoFloatLabels[slot.id] ?? null} />)}
            </div>

            {/* Pro tip */}
            <div className="rounded-[14px] p-4 flex gap-3 items-start" style={{
            background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF0F3 100%)',
            border: '1px solid #FFE4CC'
          }}>
              <span style={{
              fontSize: '20px',
              lineHeight: 1,
              flexShrink: 0
            }}>💡</span>
              <div>
                <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#D97706',
                margin: 0
              }}>Pro tip</p>
                <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#3A3A3C',
                lineHeight: 1.5,
                margin: '3px 0 0'
              }}>
                  <span>Natural lighting + wide-angle shots make spaces look 3× more inviting. Listings with great photos get 3× more bookings.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-4 pb-8 flex items-center justify-between z-50">
        <button style={{
        fontFamily: 'Inter,sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        color: '#8E8E93'
      }} className="active:opacity-60 transition-opacity">
          Back
        </button>
        <motion.button whileTap={{
        scale: 0.96
      }} className="h-[54px] rounded-[16px] text-white" style={{
        width: '60%',
        background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        boxShadow: '0 6px 20px rgba(34,197,94,0.35)',
        fontFamily: 'Inter,sans-serif',
        fontSize: '15px',
        fontWeight: 700
      }}>
          Next: Pricing →
        </motion.button>
      </footer>

      {/* ── Toast layer ── */}
      <div className="fixed bottom-28 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none px-5" style={{
      zIndex: 10001,
      paddingBottom: '4px'
    }}>
        <AnimatePresence>
          {toasts.map(t => <ToastNotification key={t.id} msg={t} onDone={removeToast} />)}
        </AnimatePresence>
      </div>
    </div>;
};