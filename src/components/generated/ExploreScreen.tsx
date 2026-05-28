import * as React from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { Home, Star, Waves, TreePine, Tent, Mountain, Heart, ChevronRight, Flame, Search, SlidersHorizontal, Bell } from 'lucide-react';
const ROBOTO = "'Roboto', -apple-system, sans-serif";

/* ─────────────────────────────────────────────────────────────
   CSS Keyframes injected once
───────────────────────────────────────────────────────────── */
const KEYFRAMES_CSS = `
@keyframes flamePulse {
  0%,100% { transform: scale(1); filter: brightness(1); }
  50%     { transform: scale(1.18) rotate(-5deg); filter: brightness(1.25); }
}
@keyframes shimmerSweep {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(250%) skewX(-12deg); }
}
@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  60%  { transform: translateY(-28px) scale(1.1); opacity: 1; }
  100% { transform: translateY(-52px) scale(0.85); opacity: 0; }
}
@keyframes heartThump {
  0%   { transform: scale(1) rotate(0deg); }
  20%  { transform: scale(1.5) rotate(-15deg); }
  40%  { transform: scale(1.3) rotate(12deg); }
  65%  { transform: scale(1.15) rotate(-6deg); }
  80%  { transform: scale(1.05) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes cardShimmer {
  0%   { opacity: 0; transform: translateX(-100%) skewX(-15deg); }
  40%  { opacity: 0.55; }
  100% { opacity: 0; transform: translateX(300%) skewX(-15deg); }
}
@keyframes particleBurst {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { opacity: 0; }
}
@keyframes typewriterCaret {
  0%,100% { opacity: 1; }
  50%     { opacity: 0; }
}
@keyframes rollUp {
  0%   { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes streakPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); }
  70%  { transform: scale(0.88); }
  100% { transform: scale(1); }
}
@keyframes gentleBounce {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-3px); }
}
`;
function useInjectedStyles() {
  React.useEffect(() => {
    const id = 'duolingo-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = KEYFRAMES_CSS;
      document.head.appendChild(style);
    }
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   Mascot state context
───────────────────────────────────────────────────────────── */
type MascotMood = 'idle' | 'excited' | 'happy' | 'wink';
interface MascotContextValue {
  mood: MascotMood;
  setMood: (m: MascotMood, durationMs?: number) => void;
  savedCount: number;
  incrementSaved: () => void;
}
const MascotContext = React.createContext<MascotContextValue>({
  mood: 'idle',
  setMood: () => {},
  savedCount: 0,
  incrementSaved: () => {}
});
function useMascot() {
  return React.useContext(MascotContext);
}

/* ─────────────────────────────────────────────────────────────
   Data constants
───────────────────────────────────────────────────────────── */
const CATEGORIES = [{
  id: 'cottages',
  label: 'Cottages',
  icon: Home
}, {
  id: 'luxury',
  label: 'Luxury',
  icon: Star
}, {
  id: 'riverfront',
  label: 'Riverfront',
  icon: Waves
}, {
  id: 'homestays',
  label: 'Homestays',
  icon: TreePine
}, {
  id: 'camping',
  label: 'Camping',
  icon: Tent
}, {
  id: 'mountain',
  label: 'Mountain View',
  icon: Mountain
}];
interface FeaturedProperty {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  tags: [string, string];
}
const FEATURED_PROPERTIES: FeaturedProperty[] = [{
  id: 'fp-1',
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
  title: 'Alpine Woodhouse',
  subtitle: 'Khajjiar Road',
  description: 'A handcrafted wooden retreat nestled in ancient deodar forests with panoramic Himalayan views.',
  price: '₹5,500/night',
  tags: ['Luxury Stay', '2 Day stay']
}, {
  id: 'fp-2',
  image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
  title: 'Ravi River Cottage',
  subtitle: 'Sahoo Village',
  description: "Stone-and-timber cottage steps from the Ravi, where the river's sound lulls you to sleep.",
  price: '₹3,800/night',
  tags: ['Riverfront', '3 Day stay']
}, {
  id: 'fp-3',
  image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop',
  title: 'Chamba Hilltop',
  subtitle: 'Chowari Heights',
  description: 'Perched 2,200m above sea level — sweeping valley vistas, warm fireplace, cloud-level silence.',
  price: '₹7,200/night',
  tags: ['Top Rated', '5 Day stay']
}, {
  id: 'fp-4',
  image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop',
  title: 'Deodar Forest Lodge',
  subtitle: 'Bharmaur Road',
  description: 'An intimate forest lodge surrounded by centuries-old cedar trees and wild pine resin.',
  price: '₹4,500/night',
  tags: ['Nature Stay', '4 Day stay']
}];
interface ListingProperty {
  id: string;
  images: string[];
  name: string;
  price: string;
  description: string;
  tags: [string, string];
}
const LISTING_PROPERTIES: ListingProperty[] = [{
  id: 'lp-1',
  images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&auto=format&fit=crop'],
  name: 'Alpine Woodhouse',
  price: '₹5,500',
  description: "A serene cedar retreat above the Ravi valley. The kind of stillness you've been searching for.",
  tags: ['Top Pick', 'Luxury Stay']
}, {
  id: 'lp-2',
  images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop'],
  name: 'Ravi River Cottage',
  price: '₹3,800',
  description: 'Wake up to the sound of the Ravi river. Rustic comfort meets Himalayan calm.',
  tags: ['Riverfront', '3 Nights min']
}, {
  id: 'lp-3',
  images: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop'],
  name: 'Chamba Hilltop Retreat',
  price: '₹7,200',
  description: 'Panoramic views of snow-capped peaks from your private deck. Pure Himachal.',
  tags: ['Top Rated', 'Mountain View']
}, {
  id: 'lp-4',
  images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop'],
  name: 'Deodar Forest Lodge',
  price: '₹4,500',
  description: 'Hidden in a deodar forest, this lodge offers silence, stars, and solitude.',
  tags: ['Nature Stay', 'Forest View']
}, {
  id: 'lp-5',
  images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop'],
  name: 'Bhuri Singh Palace View',
  price: '₹2,800',
  description: "Steps from Chamba's heritage core. History, culture, and comfort in one stay.",
  tags: ['Heritage', 'City Centre']
}, {
  id: 'lp-6',
  images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&auto=format&fit=crop'],
  name: 'Chamunda Devi Retreat',
  price: '₹3,200',
  description: 'A peaceful stay near the sacred Chamunda temple with valley views.',
  tags: ['Spiritual', 'Valley View']
}];

/* ─────────────────────────────────────────────────────────────
   Typewriter Hook
───────────────────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 55, startDelay = 400) {
  const [displayed, setDisplayed] = React.useState('');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);
  return {
    displayed,
    done
  };
}

/* ─────────────────────────────────────────────────────────────
   Streak Counter
───────────────────────────────────────────────────────────── */
const StreakCounter: React.FC<{
  count: number;
}> = ({
  count
}) => {
  const [prevCount, setPrevCount] = React.useState(count);
  const [popping, setPopping] = React.useState(false);
  React.useEffect(() => {
    if (count !== prevCount) {
      setPopping(true);
      setPrevCount(count);
      const t = setTimeout(() => setPopping(false), 600);
      return () => clearTimeout(t);
    }
  }, [count, prevCount]);
  return <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'linear-gradient(135deg, #FFF3CD 0%, #FFEAA0 100%)',
    border: '1.5px solid #FFD900',
    borderRadius: '20px',
    padding: '5px 10px',
    flexShrink: 0
  }}>
    <Flame size={16} style={{
      color: '#FF6B00',
      animation: 'flamePulse 1.2s ease-in-out infinite',
      flexShrink: 0
    }} />
    <div style={{
      overflow: 'hidden',
      height: '18px',
      position: 'relative'
    }}>
      <span key={count} style={{
        fontFamily: ROBOTO,
        fontSize: '13px',
        fontWeight: 700,
        color: '#CC6B00',
        lineHeight: '18px',
        display: 'block',
        animation: popping ? 'rollUp 0.35s cubic-bezier(0.34,1.56,0.64,1), streakPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' : 'none'
      }}>
        {count}
      </span>
    </div>
    <span style={{
      fontFamily: ROBOTO,
      fontSize: '11px',
      fontWeight: 500,
      color: '#CC6B00',
      whiteSpace: 'nowrap'
    }}>
      saved
    </span>
  </div>;
};

/* ─────────────────────────────────────────────────────────────
   Emoji Particle Burst
───────────────────────────────────────────────────────────── */
interface EmojiParticle {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  duration: number;
}
const BURST_EMOJIS = ['✨', '🌟', '💫', '❤️', '🎉', '🌈', '⭐', '💚', '🔥', '🎊'];
const EmojiBurst: React.FC<{
  visible: boolean;
}> = ({
  visible
}) => {
  const particles: EmojiParticle[] = React.useMemo(() => Array.from({
    length: 18
  }, (_, i) => ({
    id: i,
    emoji: BURST_EMOJIS[i % BURST_EMOJIS.length],
    angle: i / 18 * 360 + (Math.random() - 0.5) * 20,
    distance: 38 + Math.random() * 36,
    duration: 0.65 + Math.random() * 0.25
  })), []);
  return <AnimatePresence>
    {visible && <div aria-hidden="true" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 0,
      height: 0,
      pointerEvents: 'none',
      zIndex: 20
    }}>
      {particles.map(p => {
        const rad = p.angle * Math.PI / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return <motion.div key={p.id} initial={{
          x: 0,
          y: 0,
          scale: 0,
          opacity: 1
        }} animate={{
          x: tx,
          y: ty,
          scale: [0, 1.4, 1, 0],
          opacity: [1, 1, 0.7, 0]
        }} exit={{
          opacity: 0
        }} transition={{
          duration: p.duration,
          ease: 'easeOut'
        }} style={{
          position: 'absolute',
          fontSize: '16px',
          lineHeight: 1
        }}>
          {p.emoji}
        </motion.div>;
      })}
    </div>}
  </AnimatePresence>;
};

/* ─────────────────────────────────────────────────────────────
   XP Float Label
───────────────────────────────────────────────────────────── */
const XPFloat: React.FC<{
  visible: boolean;
}> = ({
  visible
}) => <AnimatePresence>
  {visible && <motion.div initial={{
    y: 0,
    opacity: 1,
    scale: 0.8
  }} animate={{
    y: -60,
    opacity: [1, 1, 0],
    scale: [0.8, 1.15, 0.9]
  }} exit={{
    opacity: 0
  }} transition={{
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1]
  }} aria-live="polite" style={{
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #58CC02, #46A801)',
    color: '#FFFFFF',
    fontFamily: ROBOTO,
    fontSize: '13px',
    fontWeight: 700,
    padding: '5px 12px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    zIndex: 30,
    pointerEvents: 'none',
    boxShadow: '0 4px 14px rgba(88,204,2,0.4)'
  }}>
    +1 Saved! 🎉
  </motion.div>}
</AnimatePresence>;

/* ─────────────────────────────────────────────────────────────
   Duolingo Heart Button
───────────────────────────────────────────────────────────── */
const HeartButton: React.FC<{
  size: number;
  isLight?: boolean;
}> = ({
  size,
  isLight = false
}) => {
  const {
    setMood,
    incrementSaved
  } = useMascot();
  const [liked, setLiked] = React.useState(false);
  const [thumping, setThumping] = React.useState(false);
  const [showBurst, setShowBurst] = React.useState(false);
  const [showXP, setShowXP] = React.useState(false);
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    if (next) {
      setThumping(true);
      setShowBurst(true);
      setShowXP(true);
      setMood('happy', 1800);
      incrementSaved();
      setTimeout(() => setThumping(false), 700);
      setTimeout(() => setShowBurst(false), 900);
      setTimeout(() => setShowXP(false), 1100);
    }
  };
  return <div style={{
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <motion.button aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'} onClick={handleToggle} whileTap={{
      scale: 0.8
    }} whileHover={{
      scale: 1.08
    }} transition={{
      type: 'spring',
      stiffness: 500,
      damping: 15
    }} style={{
      background: isLight ? liked ? 'rgba(255,56,92,0.18)' : 'rgba(0,0,0,0.28)' : liked ? 'rgba(255,56,92,0.12)' : 'rgba(0,0,0,0.28)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: isLight ? liked ? '1px solid rgba(255,56,92,0.30)' : '1px solid rgba(255,255,255,0.18)' : liked ? '1px solid rgba(255,56,92,0.20)' : '1px solid rgba(255,255,255,0.20)',
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      outline: 'none'
    }}>
      <Heart size={size === 36 ? 16 : 15} strokeWidth={liked ? 0 : 1.5} fill={liked ? '#FF385C' : 'none'} style={{
        color: liked ? '#FF385C' : '#FFFFFF',
        animation: thumping ? 'heartThump 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
        display: 'block'
      }} />
    </motion.button>
    <AnimatePresence>
      {liked && <motion.div key="pulse" initial={{
        scale: 0.8,
        opacity: 0.8
      }} animate={{
        scale: 2.4,
        opacity: 0
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.55,
        ease: 'easeOut'
      }} aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: '2px solid #FF385C',
        pointerEvents: 'none'
      }} />}
    </AnimatePresence>
    <EmojiBurst visible={showBurst} />
    <XPFloat visible={showXP} />
  </div>;
};

/* ─────────────────────────────────────────────────────────────
   Header
───────────────────────────────────────────────────────────── */
const DuolingoHeader: React.FC<{
  savedCount: number;
}> = ({
  savedCount
}) => {
  const hour = new Date().getHours();
  const greetingBase = hour < 12 ? 'Good morning, Explorer! 🌟' : hour < 17 ? 'Good afternoon, Explorer! ☀️' : 'Good evening, Explorer!';
  const {
    displayed,
    done
  } = useTypewriter(greetingBase, 50, 600);
  const [searchTapped, setSearchTapped] = React.useState(false);
  const handleSearch = () => {
    setSearchTapped(true);
    setTimeout(() => setSearchTapped(false), 1200);
  };
  return <div style={{
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '16px',
    paddingBottom: '14px',
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1.5px solid rgba(88,204,2,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  }}>
    {/* Top row: greeting + streak + bell */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '14px'
    }}>
      {/* Greeting */}
      <div style={{
        flex: 1,
        minWidth: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{
            fontFamily: ROBOTO,
            fontSize: '15px',
            fontWeight: 700,
            color: '#1C1C1E',
            letterSpacing: '-0.2px',
            lineHeight: 1.3
          }}>
            {displayed}
          </span>
          {!done && <span style={{
            display: 'inline-block',
            width: '2px',
            height: '15px',
            background: '#58CC02',
            marginLeft: '1px',
            animation: 'typewriterCaret 0.6s step-end infinite',
            verticalAlign: 'middle',
            borderRadius: '1px'
          }} aria-hidden="true" />}
        </div>
      </div>

      {/* Streak */}
      <StreakCounter count={savedCount} />

      {/* Bell */}
      <div style={{
        position: 'relative',
        flexShrink: 0
      }}>
        <button style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#F2F2F7',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} aria-label="Notifications">
          <Bell size={18} strokeWidth={1.5} style={{
            color: '#1C1C1E'
          }} />
        </button>
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#FF385C',
          border: '1.5px solid #FFFFFF'
        }} />
      </div>
    </div>

    {/* Search bar */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <motion.button onClick={handleSearch} whileTap={{
        scale: 0.97
      }} transition={{
        type: 'spring',
        stiffness: 600,
        damping: 20
      }} style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: searchTapped ? 'linear-gradient(135deg, #F0FBE8 0%, #E8F8D4 100%)' : '#F2F2F7',
        border: searchTapped ? '1.5px solid rgba(88,204,2,0.4)' : '1.5px solid transparent',
        borderRadius: '14px',
        height: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: searchTapped ? '0 0 0 3px rgba(88,204,2,0.12)' : 'none',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
      }}>
        <Search size={18} strokeWidth={1.5} style={{
          color: searchTapped ? '#58CC02' : '#8E8E93',
          flexShrink: 0,
          transition: 'color 0.25s ease'
        }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <AnimatePresence mode="wait">
            {searchTapped ? <motion.span key="tapped" initial={{
              opacity: 0,
              y: 4
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -4
            }} transition={{
              duration: 0.18
            }} style={{
              fontFamily: ROBOTO,
              fontSize: '14px',
              fontWeight: 700,
              color: '#58CC02',
              lineHeight: 1.3
            }}>
              Where to next? ✨
            </motion.span> : <motion.span key="default" initial={{
              opacity: 0,
              y: 4
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -4
            }} transition={{
              duration: 0.18
            }} style={{
              fontFamily: ROBOTO,
              fontSize: '14px',
              fontWeight: 700,
              color: '#1C1C1E',
              lineHeight: 1.3
            }}>
              Where to?
            </motion.span>}
          </AnimatePresence>
          <span style={{
            fontFamily: ROBOTO,
            fontSize: '12px',
            fontWeight: 400,
            color: '#8E8E93',
            lineHeight: 1.4
          }}>
            Chamba stays
          </span>
        </div>
      </motion.button>
      <motion.button whileTap={{
        scale: 0.88,
        rotate: -5
      }} whileHover={{
        scale: 1.05
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15
      }} style={{
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1C1C1E',
        border: 'none',
        borderRadius: '14px',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: '0 2px 10px rgba(0,0,0,0.18)'
      }} aria-label="Filter">
        <SlidersHorizontal size={18} strokeWidth={1.5} style={{
          color: '#FFFFFF'
        }} />
      </motion.button>
    </div>
  </div>;
};

/* ─────────────────────────────────────────────────────────────
   Hero Headline
───────────────────────────────────────────────────────────── */
const HeroHeadline: React.FC<{
  newPlacesCount: number;
}> = ({
  newPlacesCount
}) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);
  return <div style={{
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '22px',
    paddingBottom: '4px'
  }}>
    <motion.h1 initial={{
      opacity: 0,
      y: 18
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1
    }} style={{
      fontFamily: ROBOTO,
      fontSize: '26px',
      lineHeight: 1.25,
      letterSpacing: '-0.4px',
      margin: 0,
      color: '#1C1C1E'
    }}>
      <span style={{
        fontWeight: 300
      }}>Discover </span>
      <span style={{
        fontWeight: 800,
        color: '#58CC02',
        letterSpacing: '-0.5px'
      }}>Chamba</span>
      <br />
      <span style={{
        fontWeight: 300
      }}>Stays &amp; Retreats</span>
    </motion.h1>

    <AnimatePresence>
      {show && <motion.div initial={{
        opacity: 0,
        y: 8,
        scale: 0.9
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.9
      }} transition={{
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        marginTop: '10px',
        background: 'linear-gradient(135deg, #F0FBE8 0%, #E8F8D4 100%)',
        border: '1.5px solid rgba(88,204,2,0.3)',
        borderRadius: '20px',
        padding: '5px 12px'
      }}>
        <span style={{
          fontSize: '14px'
        }}>✨</span>
        <span style={{
          fontFamily: ROBOTO,
          fontSize: '12px',
          fontWeight: 600,
          color: '#46A801',
          lineHeight: 1.4
        }}>
          {newPlacesCount} new places found!
        </span>
      </motion.div>}
    </AnimatePresence>
  </div>;
};

/* ─────────────────────────────────────────────────────────────
   Category Picker — Duolingo bouncy
───────────────────────────────────────────────────────────── */
const CategoryPicker: React.FC<{
  activeId: string;
  onSelect: (id: string) => void;
}> = ({
  activeId,
  onSelect
}) => {
  const {
    setMood
  } = useMascot();
  const handleSelect = (id: string) => {
    onSelect(id);
    setMood('excited', 900);
  };
  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'scroll',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    gap: '10px',
    paddingInline: '20px',
    paddingTop: '14px',
    paddingBottom: '14px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1.5px solid rgba(88,204,2,0.12)',
    flexWrap: 'nowrap'
  }} className="hide-scrollbar">
    {CATEGORIES.map(category => {
      const Icon = category.icon;
      const isActive = activeId === category.id;
      return <motion.button key={category.id} onClick={() => handleSelect(category.id)} whileTap={{
        scale: 0.88
      }} whileHover={{
        scale: 1.06
      }} animate={isActive ? {
        scale: [1, 0.9, 1.12, 0.96, 1.04, 1]
      } : {
        scale: 1
      }} transition={{
        type: 'spring',
        stiffness: 600,
        damping: 14
      }} style={{
        scrollSnapAlign: 'start',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '7px',
        background: 'none',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        outline: 'none',
        minWidth: '60px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: isActive ? 'linear-gradient(145deg, #58CC02, #46A801)' : 'linear-gradient(145deg, #F6FFF0, #EDFADE)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isActive ? '0 4px 14px rgba(88,204,2,0.40), 0 0 0 2px rgba(88,204,2,0.15)' : '0 2px 8px rgba(88,204,2,0.10)',
          border: isActive ? '2px solid rgba(255,255,255,0.40)' : '1.5px solid rgba(88,204,2,0.15)',
          transition: 'background 0.25s ease, box-shadow 0.25s ease'
        }}>
          <Icon size={22} strokeWidth={1.5} style={{
            color: isActive ? '#FFFFFF' : '#58CC02',
            transition: 'color 0.25s ease',
            display: 'block'
          }} />
        </div>
        <span style={{
          fontFamily: ROBOTO,
          fontSize: '11px',
          fontWeight: isActive ? 700 : 400,
          color: isActive ? '#46A801' : '#6B6B6B',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: 1.4,
          letterSpacing: '0.1px',
          transition: 'color 0.2s ease'
        }}>
          {category.label}
        </span>
        {isActive && <motion.div layoutId="catDot" style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#58CC02',
          marginTop: '-4px'
        }} transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25
        }} aria-hidden="true" />}
      </motion.button>;
    })}
  </div>;
};

/* ─────────────────────────────────────────────────────────────
   Featured Carousel
───────────────────────────────────────────────────────────── */
const FeaturedCarousel: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const {
    setMood
  } = useMascot();
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = el.scrollWidth / FEATURED_PROPERTIES.length;
      const idx = Math.round(el.scrollLeft / cardWidth);
      const clamped = Math.max(0, Math.min(idx, FEATURED_PROPERTIES.length - 1));
      if (clamped !== activeIndex) {
        setActiveIndex(clamped);
        setMood('excited', 600);
      }
    };
    el.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => el.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);
  return <section style={{
    marginTop: '22px'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '20px',
      paddingRight: '20px',
      marginBottom: '14px'
    }}>
      <h2 style={{
        fontFamily: ROBOTO,
        fontSize: '17px',
        fontWeight: 700,
        color: '#1C1C1E',
        margin: 0
      }}>
        Featured Properties
      </h2>
      <button style={{
        fontFamily: ROBOTO,
        fontSize: '13px',
        fontWeight: 600,
        color: '#58CC02',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}>
        <span style={{
          color: "#877f7f"
        }}>See all</span>
        <ChevronRight size={13} strokeWidth={2} style={{
          color: '#58CC02'
        }} />
      </button>
    </div>

    <div ref={scrollRef} style={{
      display: 'flex',
      overflowX: 'scroll',
      scrollSnapType: 'x mandatory',
      scrollBehavior: 'smooth',
      gap: '14px',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '4px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch'
    }} className="hide-scrollbar">
      {FEATURED_PROPERTIES.map((property, index) => {
        const isAdjacent = index !== activeIndex;
        return <motion.div key={property.id} whileTap={{
          scale: 0.96
        }} transition={{
          type: 'spring',
          stiffness: 500,
          damping: 18
        }} style={{
          scrollSnapAlign: 'center',
          flexShrink: 0,
          width: 'calc(88vw)',
          maxWidth: '380px',
          height: '440px',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: isAdjacent ? '0 4px 18px rgba(0,0,0,0.08)' : '0 12px 36px rgba(88,204,2,0.20), 0 4px 12px rgba(0,0,0,0.10)',
          transform: isAdjacent ? 'scale(0.94)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
          cursor: 'pointer'
        }}>
          {/* Shimmer overlay */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: '24px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)',
              animation: 'cardShimmer 2.2s ease-in-out 0.3s 1'
            }} />
          </div>

          <img src={property.image} alt={property.title} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none'
          }} />
          {/* Price badge */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '6px 12px',
            border: '1px solid rgba(255,255,255,0.20)'
          }}>
            <span style={{
              fontFamily: ROBOTO,
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              {property.price}
            </span>
          </div>
          {/* Heart */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px'
          }}>
            <HeartButton size={36} isLight />
          </div>
          {/* Content */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <h3 style={{
              fontFamily: ROBOTO,
              fontSize: '22px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.4px',
              lineHeight: 1.15,
              margin: 0
            }}>
              {property.title}
            </h3>
            <p style={{
              fontFamily: ROBOTO,
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              marginTop: '2px',
              marginBottom: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              {property.subtitle}
            </p>
            <p style={{
              fontFamily: ROBOTO,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.80)',
              margin: '4px 0 0 0',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.description}
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px'
            }}>
              {property.tags.map(tag => <span key={tag} style={{
                background: 'rgba(88,204,2,0.28)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(88,204,2,0.4)',
                borderRadius: '20px',
                padding: '4px 10px',
                fontFamily: ROBOTO,
                fontSize: '11px',
                fontWeight: 600,
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}>
                {tag}
              </span>)}
            </div>
            <motion.button whileTap={{
              scale: 0.94
            }} whileHover={{
              scale: 1.02
            }} transition={{
              type: 'spring',
              stiffness: 600,
              damping: 18
            }} style={{
              width: '100%',
              height: '46px',
              background: 'linear-gradient(135deg, #58CC02, #46A801)',
              color: '#FFFFFF',
              fontFamily: ROBOTO,
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              borderRadius: '14px',
              marginTop: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(88,204,2,0.45)',
              letterSpacing: '0.2px'
            }}>
              Reserve
            </motion.button>
          </div>
        </motion.div>;
      })}
    </div>

    {/* Dot indicators */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px',
      marginTop: '14px'
    }}>
      {FEATURED_PROPERTIES.map((p, idx) => <motion.div key={p.id} animate={{
        width: activeIndex === idx ? 20 : 6,
        background: activeIndex === idx ? '#58CC02' : 'rgba(0,0,0,0.18)'
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }} style={{
        height: '6px',
        borderRadius: '3px',
        flexShrink: 0
      }} />)}
    </div>
  </section>;
};

/* ─────────────────────────────────────────────────────────────
   Spring-bouncy scroll card wrapper
───────────────────────────────────────────────────────────── */
const BounceInCard: React.FC<{
  index: number;
  children: React.ReactNode;
}> = ({
  index,
  children
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '0px 0px -50px 0px'
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 48,
    scale: 0.94
  }} animate={isInView ? {
    opacity: 1,
    y: 0,
    scale: 1
  } : {
    opacity: 0,
    y: 48,
    scale: 0.94
  }} transition={{
    type: 'spring',
    stiffness: 280,
    damping: 18,
    mass: 0.9,
    delay: index * 0.06
  }}>
    {children}
  </motion.div>;
};

/* ─────────────────────────────────────────────────────────────
   Property Listing Card
───────────────────────────────────────────────────────────── */
const PropertyListingCard: React.FC<{
  property: ListingProperty;
  index: number;
}> = ({
  property,
  index
}) => {
  const [activeImg, setActiveImg] = React.useState(0);
  const [pressed, setPressed] = React.useState(false);
  const imgScrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = imgScrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const imgWidth = el.clientWidth;
      const idx = Math.round(el.scrollLeft / imgWidth);
      setActiveImg(Math.max(0, Math.min(idx, property.images.length - 1)));
    };
    el.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [property.images.length]);
  return <BounceInCard index={index}>
    <motion.div onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)} animate={{
      scale: pressed ? 0.97 : 1
    }} transition={{
      type: 'spring',
      stiffness: 600,
      damping: 22
    }} style={{
      background: '#FFFFFF',
      border: '1.5px solid rgba(88,204,2,0.12)',
      boxShadow: pressed ? '0 2px 8px rgba(0,0,0,0.06)' : '0 6px 24px rgba(88,204,2,0.10), 0 2px 6px rgba(0,0,0,0.05)',
      borderRadius: '20px',
      padding: '10px 10px 16px 10px',
      margin: '0 20px',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'box-shadow 0.25s ease'
    }}>
      {/* Image strip */}
      <div style={{
        position: 'relative'
      }}>
        {/* Shimmer */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          borderRadius: '14px',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)',
            animation: `cardShimmer 1.8s ease-in-out ${0.1 + index * 0.12}s 1`
          }} />
        </div>

        <div ref={imgScrollRef} style={{
          display: 'flex',
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          borderRadius: '14px',
          height: '220px',
          WebkitOverflowScrolling: 'touch'
        }} className="hide-scrollbar">
          {property.images.map((src, i) => <img key={`${property.id}-img-${i}`} src={src} alt={`${property.name} photo ${i + 1}`} style={{
            flexShrink: 0,
            width: '100%',
            height: '220px',
            objectFit: 'cover',
            scrollSnapAlign: 'start',
            borderRadius: '14px',
            display: 'block'
          }} />)}
        </div>
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          borderRadius: '0 0 14px 14px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.18))',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px'
        }}>
          <HeartButton size={34} />
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '5px',
        marginTop: '10px'
      }}>
        {property.images.map((_, i) => <motion.div key={`${property.id}-dot-${i}`} animate={{
          width: activeImg === i ? 16 : 6,
          background: activeImg === i ? '#58CC02' : 'rgba(0,0,0,0.18)'
        }} transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28
        }} style={{
          height: '5px',
          borderRadius: '3px',
          flexShrink: 0
        }} />)}
      </div>

      {/* Card body */}
      <div style={{
        padding: '4px 6px 0 6px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          gap: '10px'
        }}>
          <h3 style={{
            fontFamily: ROBOTO,
            fontSize: '18px',
            fontWeight: 700,
            color: '#1C1C1E',
            letterSpacing: '-0.2px',
            lineHeight: 1.2,
            margin: 0,
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {property.name}
          </h3>
          <div style={{
            background: 'linear-gradient(135deg, #58CC02, #46A801)',
            borderRadius: '20px',
            padding: '5px 12px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(88,204,2,0.3)'
          }}>
            <span style={{
              fontFamily: ROBOTO,
              fontSize: '12px',
              fontWeight: 700,
              color: '#FFFFFF',
              whiteSpace: 'nowrap'
            }}>
              {property.price}
            </span>
          </div>
        </div>

        <p style={{
          fontFamily: ROBOTO,
          fontSize: '13px',
          fontWeight: 400,
          color: '#6B6B6B',
          lineHeight: 1.55,
          marginTop: '7px',
          marginBottom: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {property.description}
        </p>

        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '10px',
          flexWrap: 'nowrap'
        }}>
          {property.tags.map(tag => <span key={tag} style={{
            background: 'linear-gradient(135deg, #F0FBE8, #E8F8D4)',
            color: '#46A801',
            fontFamily: ROBOTO,
            fontSize: '11px',
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: '20px',
            lineHeight: 1.4,
            border: '1px solid rgba(88,204,2,0.2)',
            whiteSpace: 'nowrap'
          }}>
            {tag}
          </span>)}
        </div>

        <motion.button whileTap={{
          scale: 0.95
        }} whileHover={{
          scale: 1.02,
          boxShadow: '0 8px 28px rgba(88,204,2,0.55)'
        }} transition={{
          type: 'spring',
          stiffness: 500,
          damping: 18
        }} style={{
          width: '100%',
          height: '50px',
          background: 'linear-gradient(135deg, #58CC02, #46A801)',
          color: '#FFFFFF',
          fontFamily: ROBOTO,
          fontSize: '15px',
          fontWeight: 700,
          border: 'none',
          borderRadius: '16px',
          marginTop: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(88,204,2,0.38)',
          letterSpacing: '0.2px',
          display: 'block'
        }}>
          Book Now
        </motion.button>
      </div>
    </motion.div>
  </BounceInCard>;
};

/* ─────────────────────────────────────────────────────────────
   Property Listings Section
───────────────────────────────────────────────────────────── */
const PropertyListings: React.FC = () => <section style={{
  marginTop: '32px'
}}>
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginBottom: '20px'
  }}>
    <h2 style={{
      fontFamily: ROBOTO,
      fontSize: '17px',
      fontWeight: 700,
      color: '#1C1C1E',
      margin: 0
    }}>
      All Properties
    </h2>
    <button style={{
      fontFamily: ROBOTO,
      fontSize: '13px',
      fontWeight: 600,
      color: '#58CC02',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '2px'
    }}>
      <span>See all</span>
      <ChevronRight size={13} strokeWidth={2} style={{
        color: '#58CC02'
      }} />
    </button>
  </div>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBottom: '110px'
  }}>
    {LISTING_PROPERTIES.map((property, index) => <PropertyListingCard key={property.id} property={property} index={index} />)}
  </div>
</section>;

/* ─────────────────────────────────────────────────────────────
   MAIN ExploreScreen
───────────────────────────────────────────────────────────── */
export const ExploreScreen: React.FC = () => {
  useInjectedStyles();
  const [activeCategory, setActiveCategory] = React.useState('cottages');
  const [mascotMood, setMascotMoodState] = React.useState<MascotMood>('idle');
  const [savedCount, setSavedCount] = React.useState(0);
  const moodTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const setMood = React.useCallback((m: MascotMood, durationMs = 1200) => {
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    setMascotMoodState(m);
    moodTimerRef.current = setTimeout(() => setMascotMoodState('idle'), durationMs);
  }, []);
  const incrementSaved = React.useCallback(() => {
    setSavedCount(n => n + 1);
  }, []);
  const mascotCtx: MascotContextValue = React.useMemo(() => ({
    mood: mascotMood,
    setMood,
    savedCount,
    incrementSaved
  }), [mascotMood, setMood, savedCount, incrementSaved]);
  return <MascotContext.Provider value={mascotCtx}>
    <div className="min-h-screen pb-28" style={{
      background: '#FAFFFE'
    }}>
      <DuolingoHeader savedCount={savedCount} />
      <HeroHeadline newPlacesCount={LISTING_PROPERTIES.length} />

      <div style={{
        position: 'sticky',
        top: '142px',
        zIndex: 40
      }}>
        <CategoryPicker activeId={activeCategory} onSelect={setActiveCategory} />
      </div>

      <main style={{
        paddingTop: '8px'
      }}>
        <FeaturedCarousel />
        <PropertyListings />
        <div style={{
          height: '32px'
        }} />
      </main>

      <BottomNav activeTab="explore" />
    </div>
  </MascotContext.Provider>;
};