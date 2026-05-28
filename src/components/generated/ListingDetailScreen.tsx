import * as React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Share2, Heart, Star, MapPin, MessageCircle, Clock, Trophy, Check, Loader2 } from 'lucide-react';
const SF_FONT = "'Roboto', -apple-system, sans-serif";
const HOST_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100';
const EXPERIENCE_CAPSULES = [{
  id: 'cap-1',
  label: 'Foggy Morning Views'
}, {
  id: 'cap-2',
  label: 'Pine Forest Silence'
}, {
  id: 'cap-3',
  label: 'Bonfire Nights'
}, {
  id: 'cap-4',
  label: 'Sunrise Deck'
}, {
  id: 'cap-5',
  label: 'Wooden Interiors'
}, {
  id: 'cap-6',
  label: 'Valley Views'
}];
const GALLERY_IMAGES = [{
  id: 'gal-1',
  src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
  alt: 'Alpine exterior with mountain backdrop',
  width: 200
}, {
  id: 'gal-2',
  src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
  alt: 'Warm wooden interior ceiling',
  width: 140
}, {
  id: 'gal-3',
  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  alt: 'Deck with valley views',
  width: 200
}];
const AMENITIES = [{
  id: 'am-1',
  emoji: '📶',
  label: 'WiFi'
}, {
  id: 'am-2',
  emoji: '🏔️',
  label: 'Mountain View'
}, {
  id: 'am-3',
  emoji: '🍳',
  label: 'Full Kitchen'
}, {
  id: 'am-4',
  emoji: '🚗',
  label: 'Private Parking'
}, {
  id: 'am-5',
  emoji: '🔥',
  label: 'Bonfire Area'
}, {
  id: 'am-6',
  emoji: '🌅',
  label: 'Sunrise Deck'
}];
const REVIEWS = [{
  id: 'rev-1',
  name: 'Aisha M.',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80',
  text: 'Absolute magic. The silence in the mornings is unreal. Woke up to mist and birdsong every day.',
  rating: 5,
  date: 'March 2024'
}, {
  id: 'rev-2',
  name: 'Rahul K.',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80',
  text: 'Priya is an incredible host. The cabin feels like home — every detail is thoughtful and warm.',
  rating: 5,
  date: 'February 2024'
}, {
  id: 'rev-3',
  name: 'Sneha P.',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80',
  text: 'Valley views from the deck are jaw-dropping. Bonfire nights were unforgettable.',
  rating: 5,
  date: 'January 2024'
}];
const PARTICLES = [{
  id: 'p-1',
  emoji: '❤️',
  angle: 0,
  dist: 80
}, {
  id: 'p-2',
  emoji: '✨',
  angle: 36,
  dist: 90
}, {
  id: 'p-3',
  emoji: '🌟',
  angle: 72,
  dist: 75
}, {
  id: 'p-4',
  emoji: '💕',
  angle: 108,
  dist: 85
}, {
  id: 'p-5',
  emoji: '❤️',
  angle: 144,
  dist: 70
}, {
  id: 'p-6',
  emoji: '✨',
  angle: 180,
  dist: 95
}, {
  id: 'p-7',
  emoji: '💖',
  angle: 216,
  dist: 80
}, {
  id: 'p-8',
  emoji: '🌟',
  angle: 252,
  dist: 88
}, {
  id: 'p-9',
  emoji: '💕',
  angle: 288,
  dist: 72
}, {
  id: 'p-10',
  emoji: '❤️',
  angle: 324,
  dist: 82
}, {
  id: 'p-11',
  emoji: '✨',
  angle: 18,
  dist: 100
}, {
  id: 'p-12',
  emoji: '💖',
  angle: 54,
  dist: 68
}, {
  id: 'p-13',
  emoji: '🌟',
  angle: 90,
  dist: 92
}, {
  id: 'p-14',
  emoji: '❤️',
  angle: 126,
  dist: 78
}, {
  id: 'p-15',
  emoji: '💕',
  angle: 162,
  dist: 86
}, {
  id: 'p-16',
  emoji: '✨',
  angle: 198,
  dist: 74
}, {
  id: 'p-17',
  emoji: '💖',
  angle: 234,
  dist: 96
}, {
  id: 'p-18',
  emoji: '❤️',
  angle: 270,
  dist: 80
}, {
  id: 'p-19',
  emoji: '🌟',
  angle: 306,
  dist: 88
}, {
  id: 'p-20',
  emoji: '💕',
  angle: 342,
  dist: 76
}];
const STAR_COUNT = 5;

// ── useScrollReveal hook ─────────────────────────────────────
function useScrollReveal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, {
      threshold: 0.15
    });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);
  return {
    ref,
    visible
  };
}

// ── CSS Keyframes injected once ──────────────────────────────
const KEYFRAMES_STYLE = `
@keyframes liquidFill {
  0% { width: 0%; }
  100% { width: 100%; }
}
@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.35); opacity: 0; }
}
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.035); }
}
@keyframes checkDraw {
  0% { stroke-dashoffset: 30; }
  100% { stroke-dashoffset: 0; }
}
@keyframes bannerSlide {
  0% { transform: translateY(-100%); opacity: 0; }
  15% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
}
@keyframes pinkFlash {
  0% { opacity: 0; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}
`;

// ── Liquid Star Fill ─────────────────────────────────────────
const LiquidStar: React.FC<{
  delay: number;
  size?: number;
  active: boolean;
}> = ({
  delay,
  size = 16,
  active
}) => {
  const uid = React.useId().replace(/:/g, '');
  return <span style={{
    position: 'relative',
    display: 'inline-block',
    width: size,
    height: size,
    flexShrink: 0
  }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{
      display: 'block'
    }}>
        <defs>
          <clipPath id={`liq-${uid}`}>
            <rect x="0" y="0" height="24" style={{
            width: active ? '24px' : '0px',
            animation: active ? `liquidFill 0.6s ease-out ${delay}s forwards` : 'none'
          }} />
          </clipPath>
        </defs>
        {/* Empty star */}
        <Star size={size} fill="#E5E7EB" color="#E5E7EB" strokeWidth={0} />
        {/* Filled star clipped */}
        <g clipPath={`url(#liq-${uid})`}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F59E0B" />
        </g>
      </svg>
    </span>;
};

// ── Animated Stars header (liquid pour) ─────────────────────
const LiquidStarRow: React.FC<{
  size?: number;
  triggered: boolean;
}> = ({
  size = 16,
  triggered
}) => <span style={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px'
}}>
    {Array.from({
    length: STAR_COUNT
  }).map((_, i) => <LiquidStar key={`ls-${i}`} delay={i * 0.12} size={size} active={triggered} />)}
  </span>;

// ── Share Ripple ─────────────────────────────────────────────
const ShareRipple: React.FC<{
  trigger: number;
}> = ({
  trigger
}) => <AnimatePresence>
    {trigger > 0 && <motion.div key={trigger} initial={{
    scale: 0.5,
    opacity: 0.7
  }} animate={{
    scale: 2.6,
    opacity: 0
  }} exit={{}} transition={{
    duration: 0.55,
    ease: 'easeOut'
  }} style={{
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.55)',
    pointerEvents: 'none'
  }} />}
  </AnimatePresence>;

// ── Wishlist Banner ──────────────────────────────────────────
const WishlistBanner: React.FC<{
  visible: boolean;
}> = ({
  visible
}) => <AnimatePresence>
    {visible && <motion.div key="banner" initial={{
    y: -80,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} exit={{
    y: -80,
    opacity: 0
  }} transition={{
    type: 'spring',
    stiffness: 480,
    damping: 30
  }} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 300,
    background: 'linear-gradient(135deg, #2D6A4F, #40916C)',
    padding: '18px 24px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 24px rgba(45,106,79,0.35)'
  }}>
        <div style={{
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <motion.path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{
          pathLength: 0
        }} animate={{
          pathLength: 1
        }} transition={{
          duration: 0.45,
          delay: 0.1,
          ease: 'easeOut'
        }} />
          </svg>
        </div>
        <span style={{
      fontFamily: SF_FONT,
      fontSize: '15px',
      fontWeight: 600,
      color: '#fff',
      lineHeight: 1.3
    }}>
          <span>Added to Wishlist!</span>
          <span style={{
        marginLeft: '6px'
      }}>❤️</span>
        </span>
      </motion.div>}
  </AnimatePresence>;

// ── Pink Flash Overlay ────────────────────────────────────────
const PinkFlash: React.FC<{
  trigger: number;
}> = ({
  trigger
}) => <AnimatePresence>
    {trigger > 0 && <motion.div key={trigger} initial={{
    opacity: 0
  }} animate={{
    opacity: [0, 0.4, 0]
  }} exit={{
    opacity: 0
  }} transition={{
    duration: 0.25,
    times: [0, 0.2, 1]
  }} style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 56, 130, 0.18)',
    pointerEvents: 'none',
    zIndex: 150
  }} />}
  </AnimatePresence>;

// ── Particle Burst ────────────────────────────────────────────
const ParticleBurst: React.FC<{
  trigger: number;
  originX: number;
  originY: number;
}> = ({
  trigger,
  originX,
  originY
}) => <AnimatePresence>
    {trigger > 0 && <div key={trigger} style={{
    position: 'fixed',
    left: originX,
    top: originY,
    zIndex: 400,
    pointerEvents: 'none'
  }}>
        {PARTICLES.map(p => {
      const rad = p.angle * Math.PI / 180;
      const tx = Math.cos(rad) * p.dist;
      const ty = Math.sin(rad) * p.dist;
      return <motion.span key={p.id} initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 1
      }} animate={{
        x: tx,
        y: ty,
        scale: [0, 1.4, 0.9, 0],
        opacity: [1, 1, 0.6, 0]
      }} transition={{
        duration: 0.75,
        ease: 'easeOut',
        times: [0, 0.3, 0.65, 1]
      }} style={{
        position: 'absolute',
        fontSize: '14px',
        lineHeight: 1,
        display: 'block'
      }}>
              {p.emoji}
            </motion.span>;
    })}
      </div>}
  </AnimatePresence>;

// ── Gallery Image ─────────────────────────────────────────────
const GalleryImage: React.FC<{
  src: string;
  alt: string;
  width: number;
  delay: number;
}> = ({
  src,
  alt,
  width,
  delay
}) => {
  const [tapped, setTapped] = React.useState(false);
  return <motion.div initial={{
    opacity: 0,
    y: 24,
    scale: 0.92
  }} animate={{
    opacity: 1,
    y: 0,
    scale: 1
  }} transition={{
    type: 'spring',
    stiffness: 380,
    damping: 26,
    delay
  }} onTap={() => {
    setTapped(true);
    setTimeout(() => setTapped(false), 320);
  }} animate-extra={tapped ? {
    scale: 0.93
  } : {
    scale: 1
  }} style={{
    width: `${width}px`,
    height: '140px',
    borderRadius: '16px',
    flexShrink: 0,
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 6px 24px rgba(45,106,79,0.12), 0 2px 8px rgba(0,0,0,0.08)'
  }}>
      <img src={src} alt={alt} style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }} />
      <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%)',
      borderRadius: '16px'
    }} />
    </motion.div>;
};

// ── Review Card (3D flip-in) ──────────────────────────────────
const ReviewCard: React.FC<{
  review: typeof REVIEWS[0];
  delay: number;
  visible: boolean;
}> = ({
  review,
  delay,
  visible
}) => {
  const [starsFilling, setStarsFilling] = React.useState(false);
  React.useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setStarsFilling(true), delay * 1000 + 300);
      return () => clearTimeout(t);
    }
  }, [visible, delay]);
  return <motion.div initial={{
    rotateY: 90,
    opacity: 0,
    scale: 0.9
  }} animate={visible ? {
    rotateY: 0,
    opacity: 1,
    scale: 1
  } : {
    rotateY: 90,
    opacity: 0,
    scale: 0.9
  }} transition={{
    type: 'spring',
    stiffness: 260,
    damping: 22,
    delay
  }} style={{
    background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,250,244,0.90))',
    border: '1px solid rgba(82,183,136,0.14)',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 4px 20px rgba(45,106,79,0.10)',
    transformStyle: 'preserve-3d',
    flexShrink: 0,
    width: '280px'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    }}>
        <div style={{
        position: 'relative',
        flexShrink: 0
      }}>
          <img src={review.avatar} alt={review.name} style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block'
        }} />
          {/* Pulse ring */}
          <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: '2px solid rgba(82,183,136,0.5)',
          animation: 'ringPulse 2s ease-in-out infinite'
        }} />
        </div>
        <div>
          <p style={{
          fontFamily: SF_FONT,
          fontSize: '14px',
          fontWeight: 600,
          color: '#1C1C1E',
          margin: 0,
          lineHeight: 1.3
        }}>
            {review.name}
          </p>
          <p style={{
          fontFamily: SF_FONT,
          fontSize: '11px',
          color: '#8E8E93',
          margin: 0,
          marginTop: '1px'
        }}>
            {review.date}
          </p>
        </div>
      </div>
      <div style={{
      marginBottom: '10px'
    }}>
        <LiquidStarRow size={14} triggered={starsFilling} />
      </div>
      <p style={{
      fontFamily: SF_FONT,
      fontSize: '13px',
      color: '#3A3A3C',
      lineHeight: 1.65,
      margin: 0
    }}>
        {review.text}
      </p>
    </motion.div>;
};

// ── Amenity Item (bounce + wiggle) ────────────────────────────
const AmenityItem: React.FC<{
  amenity: typeof AMENITIES[0];
  delay: number;
  visible: boolean;
}> = ({
  amenity,
  delay,
  visible
}) => {
  const [wiggling, setWiggling] = React.useState(false);
  return <motion.div initial={{
    opacity: 0,
    y: 20,
    scale: 0.7
  }} animate={visible ? {
    opacity: 1,
    y: 0,
    scale: 1
  } : {
    opacity: 0,
    y: 20,
    scale: 0.7
  }} transition={{
    type: 'spring',
    stiffness: 480,
    damping: 18,
    delay
  }} onClick={() => {
    setWiggling(true);
    setTimeout(() => setWiggling(false), 500);
  }} style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  }}>
      <motion.span animate={wiggling ? {
      rotate: [0, -15, 15, -10, 10, -5, 5, 0]
    } : {
      rotate: 0
    }} transition={{
      duration: 0.5,
      ease: 'easeInOut'
    }} style={{
      fontSize: '18px',
      lineHeight: 1,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'rgba(82,183,136,0.10)'
    }}>
        {amenity.emoji}
      </motion.span>
      <span style={{
      fontFamily: SF_FONT,
      fontSize: '14px',
      fontWeight: 400,
      color: '#3A3A3C',
      lineHeight: 1.4
    }}>
        {amenity.label}
      </span>
    </motion.div>;
};

// ── Reserve Button States ─────────────────────────────────────
type BookingState = 'idle' | 'loading' | 'done';
const ReserveButton: React.FC = () => {
  const [state, setState] = React.useState<BookingState>('idle');
  const [rippleKey, setRippleKey] = React.useState(0);
  const handlePress = () => {
    if (state !== 'idle') return;
    setRippleKey(k => k + 1);
    setState('loading');
    setTimeout(() => setState('done'), 1800);
    setTimeout(() => setState('idle'), 4200);
  };
  return <motion.button onClick={handlePress} animate={state === 'idle' ? {
    scale: [1, 1.035, 1],
    boxShadow: ['0 4px 20px rgba(64,145,108,0.45)', '0 6px 32px rgba(64,145,108,0.80)', '0 4px 20px rgba(64,145,108,0.45)']
  } : {
    scale: state === 'done' ? 1.04 : 1,
    boxShadow: state === 'done' ? '0 6px 32px rgba(64,145,108,0.80)' : '0 4px 20px rgba(64,145,108,0.45)'
  }} transition={state === 'idle' ? {
    duration: 2.2,
    repeat: Infinity,
    ease: 'easeInOut'
  } : {
    type: 'spring',
    stiffness: 400,
    damping: 20
  }} whileTap={state === 'idle' ? {
    scale: 0.88,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 18
    }
  } : {}} style={{
    position: 'relative',
    overflow: 'hidden',
    background: state === 'done' ? 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' : 'linear-gradient(135deg, #2D6A4F 0%, #40916C 40%, #52B788 100%)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: '14px',
    padding: '13px 26px',
    fontFamily: SF_FONT,
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    cursor: state === 'idle' ? 'pointer' : 'default',
    whiteSpace: 'nowrap',
    minWidth: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    transition: 'background 0.3s ease'
  }}>
      {/* Ripple */}
      <AnimatePresence>
        {rippleKey > 0 && <motion.div key={rippleKey} initial={{
        scale: 0,
        opacity: 0.6
      }} animate={{
        scale: 4,
        opacity: 0
      }} exit={{}} transition={{
        duration: 0.55,
        ease: 'easeOut'
      }} style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.35)',
        pointerEvents: 'none',
        top: '50%',
        left: '50%',
        marginTop: '-20px',
        marginLeft: '-20px'
      }} />}
      </AnimatePresence>
      {/* Shine */}
      <div style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.00) 100%)',
      pointerEvents: 'none'
    }} />

      <AnimatePresence mode="wait">
        {state === 'idle' && <motion.span key="label" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0,
        scale: 0.8
      }} transition={{
        duration: 0.18
      }}>
            Book Now
          </motion.span>}
        {state === 'loading' && <motion.span key="loading" initial={{
        opacity: 0,
        scale: 0.6
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.6
      }} transition={{
        type: 'spring',
        stiffness: 460,
        damping: 20
      }}>
            <Loader2 size={18} style={{
          animation: 'spin 0.8s linear infinite',
          display: 'block'
        }} />
          </motion.span>}
        {state === 'done' && <motion.span key="done" initial={{
        opacity: 0,
        scale: 0.4
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0
      }} transition={{
        type: 'spring',
        stiffness: 520,
        damping: 18
      }} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
            <Check size={16} strokeWidth={2.5} />
            <span>Reserved!</span>
          </motion.span>}
      </AnimatePresence>
    </motion.button>;
};

// ── Main Screen ──────────────────────────────────────────────
export const ListingDetailScreen: React.FC = () => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeFlashKey, setLikeFlashKey] = React.useState(0);
  const [particleTrigger, setParticleTrigger] = React.useState(0);
  const [showBanner, setShowBanner] = React.useState(false);
  const [shareRipple, setShareRipple] = React.useState(0);
  const [heroReady, setHeroReady] = React.useState(false);
  const [starsTriggered, setStarsTriggered] = React.useState(false);
  const heartRef = React.useRef<HTMLButtonElement>(null);
  const [particleOrigin, setParticleOrigin] = React.useState({
    x: 0,
    y: 0
  });
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const {
    scrollY
  } = useScroll({
    container: scrollContainerRef
  });
  const heroY = useTransform(scrollY, [0, 420], [0, 90]);

  // Scroll reveal sections
  const galleryReveal = useScrollReveal();
  const storyReveal = useScrollReveal();
  const capsulesReveal = useScrollReveal();
  const hostReveal = useScrollReveal();
  const amenitiesReveal = useScrollReveal();
  const reviewsReveal = useScrollReveal();

  // Stars trigger after hero is ready
  React.useEffect(() => {
    const t1 = setTimeout(() => setHeroReady(true), 120);
    const t2 = setTimeout(() => setStarsTriggered(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const handleLike = () => {
    if (!heartRef.current) return;
    const rect = heartRef.current.getBoundingClientRect();
    setParticleOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    if (!isLiked) {
      setLikeFlashKey(k => k + 1);
      setParticleTrigger(k => k + 1);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 2800);
    }
    setIsLiked(prev => !prev);
  };
  const handleShare = () => setShareRipple(prev => prev + 1);
  return <div ref={scrollContainerRef} style={{
    fontFamily: SF_FONT,
    overscrollBehavior: 'none',
    position: 'relative',
    background: '#ffffff',
    minHeight: '100vh',
    paddingBottom: '112px',
    overflowY: 'auto'
  }}>
      {/* CSS Keyframes */}
      <style>{KEYFRAMES_STYLE}</style>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ── Pink Flash ── */}
      <PinkFlash trigger={likeFlashKey} />

      {/* ── Particle Burst ── */}
      <ParticleBurst trigger={particleTrigger} originX={particleOrigin.x} originY={particleOrigin.y} />

      {/* ── Wishlist Banner ── */}
      <WishlistBanner visible={showBanner} />

      {/* ── 1. HERO ── */}
      <section style={{
      position: 'relative',
      width: '100%',
      height: '420px',
      overflow: 'hidden'
    }}>
        <motion.img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900" alt="Alpine Woodhouse Chamba – mountain cabin hero" initial={{
        scale: 0.95,
        opacity: 0
      }} animate={heroReady ? {
        scale: 1,
        opacity: 1
      } : {
        scale: 0.95,
        opacity: 0
      }} transition={{
        type: 'spring',
        stiffness: 180,
        damping: 18,
        delay: 0
      }} style={{
        display: 'block',
        width: '100%',
        height: '130%',
        objectFit: 'cover',
        objectPosition: '50% 50%',
        y: heroY,
        willChange: 'transform'
      } as React.CSSProperties} />

        {/* Overlays */}
        <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 38%)',
        pointerEvents: 'none'
      }} />
        <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, transparent 52%)',
        pointerEvents: 'none'
      }} />

        {/* Back */}
        <motion.button initial={{
        opacity: 0,
        x: -12
      }} animate={heroReady ? {
        opacity: 1,
        x: 0
      } : {
        opacity: 0,
        x: -12
      }} transition={{
        delay: 0.2,
        type: 'spring',
        stiffness: 380,
        damping: 24
      }} whileTap={{
        scale: 0.88
      }} style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.28)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} aria-label="Go back">
          <ChevronLeft size={18} color="#FFFFFF" strokeWidth={1.5} />
        </motion.button>

        {/* Top right: Share + Large Wishlist Heart */}
        <motion.div initial={{
        opacity: 0,
        x: 12
      }} animate={heroReady ? {
        opacity: 1,
        x: 0
      } : {
        opacity: 0,
        x: 12
      }} transition={{
        delay: 0.25,
        type: 'spring',
        stiffness: 380,
        damping: 24
      }} style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
          {/* Share */}
          <button onClick={handleShare} style={{
          position: 'relative',
          overflow: 'hidden',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} aria-label="Share listing">
            <ShareRipple trigger={shareRipple} />
            <Share2 size={15} color="#FFFFFF" strokeWidth={1.5} />
          </button>

          {/* Large Heart Button */}
          <motion.button ref={heartRef} onClick={handleLike} animate={isLiked ? {
          scale: [1, 0, 1.6, 1.1, 1.25, 1],
          rotate: [0, 0, -20, 20, -8, 0]
        } : {
          scale: 1,
          rotate: 0
        }} transition={{
          duration: 0.55,
          times: [0, 0.18, 0.42, 0.62, 0.82, 1]
        }} style={{
          position: 'relative',
          overflow: 'visible',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: isLiked ? 'rgba(255,56,92,0.25)' : 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: isLiked ? '1.5px solid rgba(255,56,92,0.5)' : '1.5px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }} aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}>
            {/* Pulse ring when liked */}
            {isLiked && <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px solid rgba(255,56,92,0.45)',
            animation: 'ringPulse 1.4s ease-in-out infinite',
            pointerEvents: 'none'
          }} />}
            <Heart size={20} strokeWidth={1.8} color={isLiked ? '#FF385C' : '#FFFFFF'} fill={isLiked ? '#FF385C' : 'none'} />
          </motion.button>
        </motion.div>

        {/* Photo count */}
        <div style={{
        position: 'absolute',
        bottom: '56px',
        right: '20px',
        background: 'rgba(0,0,0,0.48)',
        backdropFilter: 'blur(6px)',
        borderRadius: '20px',
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: SF_FONT,
          fontSize: '12px',
          fontWeight: 500,
          color: '#FFFFFF',
          lineHeight: 1
        }}>
            1 / 8
          </span>
        </div>
      </section>

      {/* ── 2. PROPERTY META ── */}
      <section style={{
      padding: '28px 24px 0'
    }}>
        <motion.p initial={{
        opacity: 0,
        y: 10
      }} animate={heroReady ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 10
      }} transition={{
        delay: 0.3,
        duration: 0.4
      }} className="uppercase" style={{
        fontFamily: SF_FONT,
        fontSize: '11px',
        fontWeight: 400,
        color: '#8E8E93',
        letterSpacing: '0.4px',
        lineHeight: 1.4,
        marginBottom: '6px'
      }}>
          Wooden Cabin
        </motion.p>
        <motion.h1 initial={{
        opacity: 0,
        y: 22
      }} animate={heroReady ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 22
      }} transition={{
        delay: 0.38,
        type: 'spring',
        stiffness: 320,
        damping: 24
      }} style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#1C1C1E',
        letterSpacing: '-0.5px',
        lineHeight: 1.12,
        margin: 0,
        fontFamily: 'Inter'
      }}>
          Alpine Woodhouse Chamba
        </motion.h1>

        <motion.div initial={{
        opacity: 0,
        y: 14
      }} animate={heroReady ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 14
      }} transition={{
        delay: 0.48,
        type: 'spring',
        stiffness: 320,
        damping: 24
      }} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '7px'
      }}>
          <MapPin size={13} color="#8E8E93" strokeWidth={1.5} />
          <span style={{
          fontFamily: SF_FONT,
          fontSize: '13px',
          fontWeight: 400,
          color: '#8E8E93',
          lineHeight: 1.4
        }}>
            Khajjiar Road, Chamba, HP
          </span>
        </motion.div>

        {/* Liquid star rating */}
        <motion.div initial={{
        opacity: 0,
        y: 12
      }} animate={heroReady ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 12
      }} transition={{
        delay: 0.56,
        type: 'spring',
        stiffness: 320,
        damping: 24
      }} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px'
      }}>
          <LiquidStarRow size={16} triggered={starsTriggered} />
          <span style={{
          fontFamily: SF_FONT,
          fontSize: '14px',
          fontWeight: 600,
          color: '#1C1C1E',
          lineHeight: 1.4
        }}>4.98</span>
          <span style={{
          fontFamily: SF_FONT,
          fontSize: '13px',
          fontWeight: 400,
          color: '#8E8E93',
          lineHeight: 1.4
        }}>· 124 reviews</span>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={heroReady ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 8
      }} transition={{
        delay: 0.72,
        duration: 0.4
      }} style={{
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
          <span style={{
          fontSize: '15px'
        }}>😍</span>
          <span style={{
          fontFamily: SF_FONT,
          fontSize: '12px',
          fontWeight: 500,
          color: '#52B788',
          lineHeight: 1.4
        }}>
            Guests absolutely love this place!
          </span>
        </motion.div>
      </section>

      {/* ── 3. GALLERY STRIP ── */}
      <section>
        <div ref={galleryReveal.ref}>
          <motion.h2 initial={{
          opacity: 0,
          y: 16
        }} animate={galleryReveal.visible ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 16
        }} transition={{
          type: 'spring',
          stiffness: 300,
          damping: 24
        }} style={{
          fontFamily: SF_FONT,
          fontSize: '17px',
          fontWeight: 600,
          color: '#1C1C1E',
          letterSpacing: '-0.1px',
          padding: '28px 24px 14px',
          margin: 0
        }}>
            The Space
          </motion.h2>
          <div style={{
          display: 'flex',
          overflowX: 'auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          gap: '12px',
          scrollbarWidth: 'none'
        }} className="hide-scrollbar">
            {GALLERY_IMAGES.map((gimg, i) => <GalleryImage key={gimg.id} src={gimg.src} alt={gimg.alt} width={gimg.width} delay={galleryReveal.visible ? i * 0.1 : 0} />)}
          </div>
        </div>
      </section>

      {/* ── 4. STORY PARAGRAPH ── */}
      <section ref={storyReveal.ref} style={{
      padding: '22px 24px 0'
    }}>
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={storyReveal.visible ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 20
      }} transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22
      }} style={{
        color: '#3A3A3C',
        lineHeight: 1.75,
        fontWeight: 400,
        fontFamily: 'Inter',
        fontSize: '14px',
        margin: 0
      }}>
          A quiet alpine retreat surrounded by pine forests and morning fog, designed for slow mornings and peaceful evenings. Where the Ravi valley stretches below and the silence is something you can actually hear.
        </motion.p>
      </section>

      {/* ── 5. EXPERIENCE CAPSULES ── */}
      <div ref={capsulesReveal.ref} style={{
      marginTop: '24px'
    }}>
        <div style={{
        display: 'flex',
        overflowX: 'auto',
        paddingLeft: '24px',
        paddingRight: '24px',
        gap: '10px',
        scrollbarWidth: 'none'
      }} className="hide-scrollbar">
          {EXPERIENCE_CAPSULES.map((cap, i) => <motion.div key={cap.id} initial={{
          opacity: 0,
          x: 30,
          scale: 0.85
        }} animate={capsulesReveal.visible ? {
          opacity: 1,
          x: 0,
          scale: 1
        } : {
          opacity: 0,
          x: 30,
          scale: 0.85
        }} transition={{
          type: 'spring',
          stiffness: 380,
          damping: 26,
          delay: i * 0.07
        }} style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(235,248,241,0.82))',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(82,183,136,0.16)',
          boxShadow: '0 2px 10px rgba(45,106,79,0.09), inset 0 1px 0 rgba(255,255,255,0.75)',
          borderRadius: '20px',
          padding: '9px 18px',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
              <span style={{
            fontFamily: SF_FONT,
            fontSize: '13px',
            fontWeight: 400,
            color: '#1C1C1E',
            lineHeight: 1.4
          }}>
                {cap.label}
              </span>
            </motion.div>)}
        </div>
      </div>

      {/* ── 6. HOST STORY BLOCK ── */}
      <section ref={hostReveal.ref}>
        <motion.h2 initial={{
        opacity: 0,
        y: 18
      }} animate={hostReveal.visible ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 18
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24
      }} style={{
        fontFamily: SF_FONT,
        fontSize: '17px',
        fontWeight: 600,
        color: '#1C1C1E',
        letterSpacing: '-0.1px',
        padding: '28px 24px 14px',
        margin: 0
      }}>
          Your Host
        </motion.h2>
        <motion.div initial={{
        opacity: 0,
        y: 24,
        scale: 0.97
      }} animate={hostReveal.visible ? {
        opacity: 1,
        y: 0,
        scale: 1
      } : {
        opacity: 0,
        y: 24,
        scale: 0.97
      }} transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        delay: 0.1
      }} style={{
        margin: '0 24px',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(240,250,244,0.88))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(82,183,136,0.14)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(45,106,79,0.10), inset 0 1px 0 rgba(255,255,255,0.80)'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
            <div style={{
            position: 'relative',
            flexShrink: 0
          }}>
              <img src={HOST_AVATAR} alt="Host Priya Sharma" style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #F2F2F7',
              boxShadow: '0 0 0 3px rgba(82,183,136,0.28), 0 2px 10px rgba(0,0,0,0.10)'
            }} />
              <div style={{
              position: 'absolute',
              inset: '-5px',
              borderRadius: '50%',
              border: '2px solid rgba(82,183,136,0.4)',
              animation: 'ringPulse 2.2s ease-in-out infinite',
              pointerEvents: 'none'
            }} />
              <motion.div initial={{
              scale: 0,
              opacity: 0
            }} animate={hostReveal.visible ? {
              scale: 1,
              opacity: 1
            } : {
              scale: 0,
              opacity: 0
            }} transition={{
              type: 'spring',
              stiffness: 480,
              damping: 20,
              delay: 0.3
            }} style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-6px',
              background: 'linear-gradient(135deg, #F59E0B, #EF9B0F)',
              borderRadius: '10px',
              padding: '2px 5px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              boxShadow: '0 2px 8px rgba(245,158,11,0.45), 0 0 0 1.5px #fff'
            }}>
                <Trophy size={8} color="#fff" strokeWidth={2.5} fill="#fff" />
                <span style={{
                fontFamily: SF_FONT,
                fontSize: '8px',
                fontWeight: 600,
                color: '#fff',
                lineHeight: 1
              }}>
                  Superhost
                </span>
              </motion.div>
            </div>
            <div>
              <p style={{
              fontFamily: SF_FONT,
              fontSize: '15px',
              fontWeight: 600,
              color: '#1C1C1E',
              lineHeight: 1.3,
              margin: 0
            }}>Priya Sharma</p>
              <p style={{
              fontFamily: SF_FONT,
              fontSize: '12px',
              fontWeight: 400,
              color: '#8E8E93',
              lineHeight: 1.4,
              marginTop: '2px'
            }}>Chamba local · Hosting since 2019</p>
            </div>
          </div>
          <div style={{
          height: '1px',
          background: 'rgba(0,0,0,0.06)',
          margin: '14px 0'
        }} />
          <p style={{
          fontFamily: SF_FONT,
          fontSize: '14px',
          fontWeight: 400,
          color: '#3A3A3C',
          lineHeight: 1.65,
          margin: 0
        }}>
            I grew up watching guests fall in love with Chamba's silence. Every stay I host is my way of sharing what I've always known — this valley heals.
          </p>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '14px'
        }}>
            <MessageCircle size={12} color="#8E8E93" strokeWidth={1.5} />
            <span style={{
            fontFamily: SF_FONT,
            fontSize: '12px',
            fontWeight: 400,
            color: '#8E8E93',
            lineHeight: 1.4
          }}>Response rate: 98%</span>
            <span style={{
            color: '#C7C7CC',
            fontSize: '10px'
          }}>•</span>
            <Clock size={12} color="#8E8E93" strokeWidth={1.5} />
            <span style={{
            fontFamily: SF_FONT,
            fontSize: '12px',
            fontWeight: 400,
            color: '#8E8E93',
            lineHeight: 1.4
          }}>Responds within an hour</span>
          </div>
        </motion.div>
      </section>

      {/* ── 7. AMENITIES ── */}
      <section ref={amenitiesReveal.ref}>
        <motion.h2 initial={{
        opacity: 0,
        y: 18
      }} animate={amenitiesReveal.visible ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 18
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24
      }} style={{
        fontFamily: SF_FONT,
        fontSize: '17px',
        fontWeight: 600,
        color: '#1C1C1E',
        letterSpacing: '-0.1px',
        padding: '28px 24px 14px',
        margin: 0
      }}>
          What's included
        </motion.h2>
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px',
        padding: '0 24px',
        marginTop: '4px'
      }}>
          {AMENITIES.map((amenity, i) => <AmenityItem key={amenity.id} amenity={amenity} delay={i * 0.08} visible={amenitiesReveal.visible} />)}
        </div>
      </section>

      {/* ── 8. REVIEWS ── */}
      <section ref={reviewsReveal.ref}>
        <motion.h2 initial={{
        opacity: 0,
        y: 18
      }} animate={reviewsReveal.visible ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 18
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24
      }} style={{
        fontFamily: SF_FONT,
        fontSize: '17px',
        fontWeight: 600,
        color: '#1C1C1E',
        letterSpacing: '-0.1px',
        padding: '28px 24px 14px',
        margin: 0
      }}>
          Guest Reviews
        </motion.h2>
        <div style={{
        display: 'flex',
        overflowX: 'auto',
        paddingLeft: '24px',
        paddingRight: '24px',
        gap: '14px',
        scrollbarWidth: 'none'
      }} className="hide-scrollbar">
          {REVIEWS.map((review, i) => <ReviewCard key={review.id} review={review} delay={i * 0.15} visible={reviewsReveal.visible} />)}
        </div>
      </section>

      {/* Spacer */}
      <div style={{
      height: '40px'
    }} />

      {/* ── 9. BOTTOM BOOKING BAR ── */}
      <div className="safe-bottom" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '84px',
      background: 'rgba(240,250,244,0.96)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(82,183,136,0.16)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 50
    }}>
        <div>
          <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
            <span style={{
            fontFamily: SF_FONT,
            fontSize: '24px',
            fontWeight: 700,
            color: '#1C1C1E',
            letterSpacing: '-0.3px'
          }}>₹5,500</span>
            <span style={{
            fontFamily: SF_FONT,
            fontSize: '13px',
            fontWeight: 400,
            color: '#8E8E93'
          }}>/night</span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '2px'
        }}>
            <Star size={11} fill="#F59E0B" color="#F59E0B" strokeWidth={1.5} />
            <span style={{
            fontFamily: SF_FONT,
            fontSize: '11px',
            fontWeight: 400,
            color: '#8E8E93',
            lineHeight: 1.4
          }}>4.98 · 124 reviews</span>
          </div>
        </div>

        <ReserveButton />
      </div>
    </div>;
};