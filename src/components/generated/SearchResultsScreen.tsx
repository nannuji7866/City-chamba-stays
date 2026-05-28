import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchHeader } from './SearchHeader';
import { StayCard } from './StayCard';
import { BottomNav } from './BottomNav';
import { SlidersHorizontal, Map, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
const FONT = "'Roboto', -apple-system, sans-serif";
interface ChambaStay {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
  tags: [string, string];
  propertyType: string;
  rating: number;
  location: string;
}
const CHAMBA_STAYS: ChambaStay[] = [{
  id: 'stay-1',
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
  title: 'Alpine Woodhouse',
  price: 5500,
  description: "A serene cedar retreat above the Ravi valley. The kind of stillness you've been searching for.",
  tags: ['Top Pick', 'Luxury Stay'],
  propertyType: 'Cottage',
  rating: 4.9,
  location: 'Chamba, Himachal Pradesh'
}, {
  id: 'stay-2',
  image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
  title: 'Ravi River Cottage',
  price: 3800,
  description: 'Wake up to the sound of the Ravi river. Rustic comfort meets Himalayan calm.',
  tags: ['Riverfront', '3 Nights min'],
  propertyType: 'Riverside',
  rating: 4.7,
  location: 'Ravi Valley, Chamba'
}, {
  id: 'stay-3',
  image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
  title: 'Chamba Hilltop Retreat',
  price: 7200,
  description: 'Panoramic views of snow-capped peaks from your private deck. Pure Himachal.',
  tags: ['Top Rated', 'Mountain View'],
  propertyType: 'Villa',
  rating: 4.9,
  location: 'Hilltop, Chamba'
}, {
  id: 'stay-4',
  image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
  title: 'Deodar Forest Lodge',
  price: 4500,
  description: 'Hidden in a deodar forest, this lodge offers silence, stars, and solitude.',
  tags: ['Nature Stay', 'Forest View'],
  propertyType: 'Lodge',
  rating: 4.8,
  location: 'Deodar Forest, Chamba'
}, {
  id: 'stay-5',
  image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600',
  title: 'Bhuri Singh Palace View',
  price: 2800,
  description: "Steps from Chamba's heritage core. History, culture, and comfort in one stay.",
  tags: ['Heritage', 'City Centre'],
  propertyType: 'Heritage',
  rating: 4.6,
  location: 'Old Town, Chamba'
}, {
  id: 'stay-6',
  image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=600',
  title: 'Chamunda Devi Retreat',
  price: 3200,
  description: 'A peaceful stay near the sacred Chamunda temple with valley views.',
  tags: ['Spiritual', 'Valley View'],
  propertyType: 'Retreat',
  rating: 4.7,
  location: 'Chamunda, Chamba'
}];

// Filtered subsets per filter
const FILTER_SUBSETS: Record<string, string[]> = {
  price: ['stay-2', 'stay-5', 'stay-6', 'stay-4'],
  type: ['stay-1', 'stay-3', 'stay-4', 'stay-6', 'stay-2'],
  bedrooms: ['stay-1', 'stay-3', 'stay-5'],
  amenities: ['stay-1', 'stay-2', 'stay-3', 'stay-4', 'stay-5', 'stay-6'],
  instant: ['stay-2', 'stay-4', 'stay-6', 'stay-1'],
  self: ['stay-1', 'stay-3', 'stay-5', 'stay-6', 'stay-2']
};
const FILTER_MATCH_COUNTS: Record<string, number> = {
  price: 9,
  type: 11,
  bedrooms: 7,
  amenities: 13,
  instant: 8,
  self: 10
};
const FILTERS = [{
  id: 'price',
  label: 'Price'
}, {
  id: 'type',
  label: 'Type of place'
}, {
  id: 'bedrooms',
  label: 'Bedrooms'
}, {
  id: 'amenities',
  label: 'Amenities'
}, {
  id: 'instant',
  label: 'Instant Book'
}, {
  id: 'self',
  label: 'Self check-in'
}];
const VIBES = ['Great picks for you! 🏡', 'These match your vibe perfectly ✨', "You've got great taste 🌿", 'Himalayan magic awaits 🏔️'];

// Count-up hook
function useCountUp(target: number, duration: number = 800) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevTargetRef = useRef(target);
  useEffect(() => {
    if (prevTargetRef.current === target && count === target) return;
    prevTargetRef.current = target;
    const startVal = count;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return count;
}
export const SearchResultsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'search' | 'trips' | 'profile'>('search');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterAnimPhase, setFilterAnimPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [visibleStays, setVisibleStays] = useState<ChambaStay[]>(CHAMBA_STAYS);
  const [pendingStays, setPendingStays] = useState<ChambaStay[]>([]);
  const [matchCount, setMatchCount] = useState(15);
  const [showMap, setShowMap] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [priceRange, setPriceRange] = useState(60);
  const [vibeIndex] = useState(() => Math.floor(Math.random() * VIBES.length));
  const [celebrationBadge, setCelebrationBadge] = useState<{
    visible: boolean;
    message: string;
    count: number;
  }>({
    visible: false,
    message: '',
    count: 0
  });
  const [badgeRipple, setBadgeRipple] = useState(false);
  const [deselectedFilter, setDeselectedFilter] = useState<string | null>(null);
  const [shimmerFilter, setShimmerFilter] = useState<string | null>(null);
  const displayCount = useCountUp(matchCount, 900);
  const badgeControls = useAnimation();
  const badgePulse = useCallback(async () => {
    setBadgeRipple(true);
    await badgeControls.start({
      scale: [1, 1.22, 0.9, 1.08, 1],
      transition: {
        type: 'spring',
        stiffness: 460,
        damping: 14,
        duration: 0.6
      }
    });
    setBadgeRipple(false);
  }, [badgeControls]);
  const showCelebration = useCallback((message: string, count: number) => {
    setCelebrationBadge({
      visible: true,
      message,
      count
    });
    badgePulse();
    setTimeout(() => setCelebrationBadge({
      visible: false,
      message: '',
      count: 0
    }), 3200);
  }, [badgePulse]);
  const triggerFilterTransition = useCallback((filterId: string | null) => {
    let newStays: ChambaStay[];
    let newCount: number;
    if (filterId === null) {
      newStays = CHAMBA_STAYS;
      newCount = 15;
    } else {
      const ids = FILTER_SUBSETS[filterId] ?? CHAMBA_STAYS.map(s => s.id);
      newStays = CHAMBA_STAYS.filter(s => ids.includes(s.id));
      newCount = FILTER_MATCH_COUNTS[filterId] ?? 6;
    }
    setPendingStays(newStays);
    setMatchCount(newCount);
    setFilterAnimPhase('exit');
    setTimeout(() => {
      setVisibleStays(newStays);
      setFilterAnimPhase('enter');
    }, 320);
    setTimeout(() => {
      setFilterAnimPhase('idle');
    }, 320 + newStays.length * 80 + 500);
  }, []);
  const handleFilterClick = useCallback((filterId: string) => {
    const isDeselecting = activeFilter === filterId;
    const newActive = isDeselecting ? null : filterId;
    if (isDeselecting) {
      setDeselectedFilter(filterId);
      setTimeout(() => setDeselectedFilter(null), 400);
    } else {
      setShimmerFilter(filterId);
    }
    setActiveFilter(newActive);
    triggerFilterTransition(newActive);
    if (newActive) {
      const count = FILTER_MATCH_COUNTS[newActive] ?? 6;
      showCelebration(`🎉 ${count} perfect matches!`, count);
    }
  }, [activeFilter, triggerFilterTransition, showCelebration]);
  const handleSave = useCallback(() => {
    setSavedCount(c => c + 1);
  }, []);
  const handleFiltersButtonClick = useCallback(() => {
    setShowDrawer(true);
  }, []);
  const isEmpty = visibleStays.length === 0;
  return <div className="flex flex-col min-h-screen bg-white" style={{
    overflowX: 'hidden'
  }}>
      {/* Shimmer keyframe style */}
      <style>{`
        @keyframes shimmerSweep {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sadWobble {
          0%,100% { transform: rotate(0deg) translateY(0); }
          15% { transform: rotate(-8deg) translateY(2px); }
          35% { transform: rotate(7deg) translateY(1px); }
          55% { transform: rotate(-5deg) translateY(2px); }
          75% { transform: rotate(4deg) translateY(1px); }
        }
        @keyframes droopIn {
          0% { opacity: 0; transform: translateY(-30px) scale(0.8); }
          60% { opacity: 1; transform: translateY(8px) scale(1.05); }
          80% { transform: translateY(-4px) scale(0.97); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes rippleRing {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .shimmer-chip {
          background-size: 200% auto;
          animation: shimmerSweep 1.6s linear infinite;
        }
      `}</style>

      {/* Search Header */}
      <SearchHeader placeholder="Chamba · 2 guests" className="pb-0" />

      {/* Filters Bar */}
      <div className="px-4 py-2 border-b border-gray-100 sticky top-[72px] bg-white z-30">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {/* Filters toggle */}
          <motion.button onClick={handleFiltersButtonClick} whileTap={{
          scale: 0.93
        }} className="flex items-center gap-2 whitespace-nowrap" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(240,250,244,0.82))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(82,183,136,0.14)',
          borderRadius: '20px',
          height: '34px',
          padding: '0 16px',
          color: '#3A3A3C',
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: 1.5,
          cursor: 'pointer'
        }}>
            <SlidersHorizontal size={14} strokeWidth={1.5} style={{
            color: '#3A3A3C'
          }} />
            <span>Filters</span>
          </motion.button>

          {FILTERS.map(filter => {
          const isActive = activeFilter === filter.id;
          const isDeselecting = deselectedFilter === filter.id;
          const isShimmering = shimmerFilter === filter.id && isActive;
          return <motion.button key={filter.id} onClick={() => handleFilterClick(filter.id)} whileTap={{
            scale: 0.88
          }} animate={isDeselecting ? {
            scale: [1, 0.82, 1.05, 1],
            opacity: [1, 0.6, 1, 1]
          } : isActive ? {
            scale: [1, 0.88, 1.12, 1]
          } : {
            scale: 1
          }} transition={isDeselecting || isActive ? {
            type: 'spring',
            stiffness: 400,
            damping: 18,
            duration: 0.42
          } : {
            duration: 0.15
          }} className="whitespace-nowrap" style={{
            background: isActive ? isShimmering ? 'linear-gradient(90deg, #1C1C1E 0%, #3A3A3C 40%, #6B6B6B 50%, #3A3A3C 60%, #1C1C1E 100%)' : '#1C1C1E' : 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(240,250,244,0.82))',
            backgroundSize: isShimmering ? '200% auto' : undefined,
            animation: isShimmering ? 'shimmerSweep 1.6s linear infinite' : undefined,
            backdropFilter: isActive ? 'none' : 'blur(8px)',
            WebkitBackdropFilter: isActive ? 'none' : 'blur(8px)',
            border: isActive ? '1px solid #1C1C1E' : '1px solid rgba(82,183,136,0.14)',
            borderRadius: '20px',
            height: '34px',
            padding: '0 16px',
            color: isActive ? '#FFFFFF' : '#3A3A3C',
            fontFamily: FONT,
            fontWeight: isActive ? 600 : 400,
            fontSize: '13px',
            lineHeight: 1.5,
            cursor: 'pointer',
            boxShadow: isActive ? '0 2px 12px rgba(0,0,0,0.18)' : 'none'
          }}>
                {filter.label}
              </motion.button>;
        })}
        </div>
      </div>

      {/* Celebration Badge */}
      <AnimatePresence>
        {celebrationBadge.visible && <motion.div key="celebration" initial={{
        opacity: 0,
        y: -20,
        scale: 0.7
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: -12,
        scale: 0.88
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 22
      }} style={{
        margin: '10px 20px 0',
        background: 'linear-gradient(135deg, #FF385C, #FF6B8A)',
        color: '#FFFFFF',
        borderRadius: '14px',
        padding: '12px 18px',
        fontFamily: FONT,
        fontSize: '14px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(255,56,92,0.38)',
        zIndex: 50,
        letterSpacing: '-0.1px'
      }}>
            <span>{celebrationBadge.message}</span>
            <motion.button onClick={() => setCelebrationBadge({
          visible: false,
          message: '',
          count: 0
        })} whileTap={{
          scale: 0.85
        }} style={{
          background: 'rgba(255,255,255,0.22)',
          border: 'none',
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginLeft: '10px'
        }}>
              <X size={12} color="#FFFFFF" />
            </motion.button>
          </motion.div>}
      </AnimatePresence>

      {/* Character + Results Info */}
      <div className="px-6 pt-4 pb-2">
        <motion.div animate={badgeControls} style={{
        background: 'linear-gradient(135deg, rgba(235,248,241,0.7) 0%, rgba(255,255,255,0.5) 100%)',
        border: '1px solid rgba(82,183,136,0.16)',
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative'
      }}>
          {/* Ripple ring on badge */}
          <AnimatePresence>
            {badgeRipple && <motion.div key="badge-ripple" initial={{
            scale: 1,
            opacity: 0.5
          }} animate={{
            scale: 1.5,
            opacity: 0
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.65,
            ease: 'easeOut'
          }} style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '20px',
            border: '2px solid rgba(82,183,136,0.5)',
            pointerEvents: 'none',
            zIndex: 1
          }} />}
          </AnimatePresence>

          {/* Character */}
          <motion.div animate={{
          rotate: [0, -8, 8, -4, 0]
        }} transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut'
        }} style={{
          fontSize: '28px',
          lineHeight: 1,
          flexShrink: 0
        }}>
            🧡
          </motion.div>

          <div style={{
          flex: 1,
          minWidth: 0
        }}>
            <p style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: '13px',
            color: '#1C1C1E',
            margin: 0,
            lineHeight: 1.35
          }}>
              {VIBES[vibeIndex]}
            </p>
            <p style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: '12px',
            color: '#6B6B6B',
            margin: '2px 0 0 0',
            lineHeight: 1.4
          }}>
              <span style={{
              fontWeight: 700,
              color: '#2D6A4F'
            }}>{displayCount}</span>
              <span> handpicked properties in Chamba</span>
            </p>
          </div>

          {savedCount > 0 && <motion.div key={savedCount} initial={{
          scale: 0.4,
          opacity: 0,
          y: 6
        }} animate={{
          scale: 1,
          opacity: 1,
          y: 0
        }} transition={{
          type: 'spring',
          stiffness: 480,
          damping: 16
        }} style={{
          background: '#FF385C',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '3px 10px',
          fontFamily: FONT,
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
              <span>♥ {savedCount} saved</span>
            </motion.div>}
        </motion.div>
      </div>

      {/* List of Stays */}
      <main className="flex-1">
        <div className="flex flex-col" style={{
        gap: '28px',
        paddingTop: '16px',
        paddingBottom: '110px'
      }}>
          <AnimatePresence mode="popLayout">
            {isEmpty ? (/* Empty State */
          <motion.div key="empty-state" initial={{
            opacity: 0,
            y: -30,
            scale: 0.8
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.9
          }} transition={{
            type: 'spring',
            stiffness: 300,
            damping: 22
          }} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            textAlign: 'center',
            fontFamily: FONT
          }}>
                {/* Sad drooping character */}
                <motion.div style={{
              fontSize: '72px',
              lineHeight: 1,
              marginBottom: '20px',
              display: 'block'
            }} animate={{
              rotate: [0, -8, 7, -5, 4, 0],
              y: [0, 3, -2, 3, -1, 0]
            }} transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut'
            }}>
                  😔
                </motion.div>
                <motion.h3 initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.18,
              type: 'spring',
              stiffness: 300
            }} style={{
              fontFamily: FONT,
              fontSize: '20px',
              fontWeight: 700,
              color: '#1C1C1E',
              margin: '0 0 8px',
              letterSpacing: '-0.3px'
            }}>
                  No matches yet...
                </motion.h3>
                <motion.p initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.28,
              type: 'spring',
              stiffness: 300
            }} style={{
              fontFamily: FONT,
              fontSize: '14px',
              fontWeight: 400,
              color: '#8E8E93',
              margin: 0,
              lineHeight: 1.55
            }}>
                  Try different dates or filters 🥺
                </motion.p>
                <motion.button initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 0.42,
              type: 'spring',
              stiffness: 380,
              damping: 18
            }} whileTap={{
              scale: 0.92
            }} onClick={() => {
              setActiveFilter(null);
              triggerFilterTransition(null);
            }} style={{
              marginTop: '24px',
              background: '#1C1C1E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 28px',
              fontFamily: FONT,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
            }}>
                  Clear filters
                </motion.button>
              </motion.div>) : visibleStays.map((stay, index) => <motion.div key={stay.id} layout initial={filterAnimPhase === 'enter' ? {
            opacity: 0,
            y: 60,
            scale: 0.9
          } : {
            opacity: 0,
            y: 40
          }} animate={filterAnimPhase === 'exit' ? {
            opacity: 0,
            y: 80,
            scale: 0.88
          } : {
            opacity: 1,
            y: 0,
            scale: 1
          }} exit={{
            opacity: 0,
            y: 80,
            scale: 0.88,
            transition: {
              duration: 0.28,
              ease: 'easeIn'
            }
          }} transition={filterAnimPhase === 'exit' ? {
            duration: 0.22,
            delay: index * 0.04,
            ease: 'easeIn'
          } : {
            type: 'spring',
            stiffness: 320,
            damping: 22,
            delay: filterAnimPhase === 'enter' ? index * 0.08 : index * 0.09
          }}>
                  <StayCard image={stay.image} title={stay.title} price={stay.price} description={stay.description} tags={stay.tags} propertyType={stay.propertyType} rating={stay.rating} location={stay.location} onSave={handleSave} />
                </motion.div>)}
          </AnimatePresence>
        </div>

        {/* Map Toggle Button (Floating) */}
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40">
          <motion.button onClick={() => setShowMap(v => !v)} layout animate={showMap ? {
          background: ['#000000', '#2D6A4F'],
          scale: [1, 1.08, 1]
        } : {
          background: ['#2D6A4F', '#000000'],
          scale: [1, 1.05, 1]
        }} transition={{
          duration: 0.45,
          ease: 'easeInOut'
        }} className="flex items-center gap-2 px-6 py-3 rounded-full shadow-xl" style={{
          boxShadow: '0 8px 28px rgba(0,0,0,0.24)',
          border: 'none',
          cursor: 'pointer'
        }} whileTap={{
          scale: 0.92
        }}>
            <motion.div animate={{
            rotate: showMap ? 180 : 0
          }} transition={{
            duration: 0.3,
            ease: 'backInOut'
          }}>
              {showMap ? <X size={14} color="#FFFFFF" /> : <Map size={14} color="#FFFFFF" />}
            </motion.div>
            <motion.span key={showMap ? 'hide' : 'show'} initial={{
            opacity: 0,
            x: 6
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -6
          }} style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: '13px',
            letterSpacing: '0px',
            lineHeight: 1.5,
            color: '#FFFFFF'
          }}>
              {showMap ? 'Hide map' : 'Show map'}
            </motion.span>
          </motion.button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filter Drawer */}
      <AnimatePresence>
        {showDrawer && <motion.div key="drawer-backdrop" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.22
      }} onClick={() => setShowDrawer(false)} style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.32)',
        zIndex: 60
      }}>
            <motion.div key="drawer" initial={{
          y: '100%'
        }} animate={{
          y: 0
        }} exit={{
          y: '100%'
        }} transition={{
          type: 'spring',
          stiffness: 340,
          damping: 34,
          mass: 0.85
        }} onClick={e => e.stopPropagation()} style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          padding: '0 0 40px',
          maxHeight: '82vh',
          overflow: 'hidden',
          fontFamily: FONT
        }}>
              {/* Drawer handle */}
              <div style={{
            width: '36px',
            height: '4px',
            background: '#E5E5EA',
            borderRadius: '2px',
            margin: '12px auto 0'
          }} />

              {/* Drawer Header */}
              <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px 12px',
            borderBottom: '1px solid #F2F2F7'
          }}>
                <h2 style={{
              fontFamily: FONT,
              fontSize: '17px',
              fontWeight: 600,
              color: '#1C1C1E',
              margin: 0,
              letterSpacing: '-0.2px'
            }}>
                  Filters
                </h2>
                <motion.button whileTap={{
              scale: 0.87
            }} onClick={() => setShowDrawer(false)} style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#F2F2F7',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
                  <X size={14} color="#3A3A3C" />
                </motion.button>
              </div>

              {/* Price Range Slider */}
              <div style={{
            padding: '24px 24px 0'
          }}>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '14px'
            }}>
                  <p style={{
                fontFamily: FONT,
                fontSize: '15px',
                fontWeight: 600,
                color: '#1C1C1E',
                margin: 0
              }}>
                    Price range
                  </p>
                  <p style={{
                fontFamily: FONT,
                fontSize: '13px',
                fontWeight: 400,
                color: '#8E8E93',
                margin: 0
              }}>
                    up to ₹{Math.round(priceRange / 100 * 10000).toLocaleString()}
                  </p>
                </div>
                <div style={{
              position: 'relative',
              height: '28px',
              display: 'flex',
              alignItems: 'center'
            }}>
                  <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '4px',
                background: '#E5E5EA',
                borderRadius: '2px'
              }} />
                  <motion.div animate={{
                width: `${priceRange}%`
              }} transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22
              }} style={{
                position: 'absolute',
                left: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #52B788, #2D6A4F)',
                borderRadius: '2px'
              }} />
                  <input type="range" min={0} max={100} value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                width: '100%',
                opacity: 0,
                height: '28px',
                cursor: 'pointer',
                zIndex: 2
              }} />
                  <motion.div animate={{
                left: `calc(${priceRange}% - 11px)`
              }} transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22
              }} style={{
                position: 'absolute',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '2px solid #2D6A4F',
                boxShadow: '0 2px 8px rgba(45,106,79,0.28)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
                </div>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px'
            }}>
                  <span style={{
                fontFamily: FONT,
                fontSize: '11px',
                color: '#8E8E93'
              }}>₹1,000</span>
                  <span style={{
                fontFamily: FONT,
                fontSize: '11px',
                color: '#8E8E93'
              }}>₹10,000</span>
                </div>
              </div>

              {/* Quick filter chips in drawer */}
              <div style={{
            padding: '24px 24px 0'
          }}>
                <p style={{
              fontFamily: FONT,
              fontSize: '15px',
              fontWeight: 600,
              color: '#1C1C1E',
              margin: '0 0 12px'
            }}>
                  Quick filters
                </p>
                <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
                  {FILTERS.map(filter => <motion.button key={filter.id} onClick={() => handleFilterClick(filter.id)} whileTap={{
                scale: 0.88
              }} animate={activeFilter === filter.id ? {
                scale: [1, 0.88, 1.12, 1]
              } : {
                scale: 1
              }} transition={{
                type: 'spring',
                stiffness: 400,
                damping: 18,
                duration: 0.38
              }} style={{
                background: activeFilter === filter.id ? '#1C1C1E' : '#F2F2F7',
                color: activeFilter === filter.id ? '#FFFFFF' : '#3A3A3C',
                border: 'none',
                borderRadius: '20px',
                height: '34px',
                padding: '0 16px',
                fontFamily: FONT,
                fontWeight: activeFilter === filter.id ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                      {filter.label}
                    </motion.button>)}
                </div>
              </div>

              {/* Apply CTA */}
              <div style={{
            padding: '28px 24px 0'
          }}>
                <motion.button whileTap={{
              scale: 0.96
            }} onClick={() => {
              setShowDrawer(false);
              const count = activeFilter ? FILTER_MATCH_COUNTS[activeFilter] ?? 9 : 15;
              showCelebration(`🎉 ${count} perfect matches!`, count);
            }} style={{
              width: '100%',
              height: '52px',
              background: '#1C1C1E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              fontFamily: FONT,
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '-0.1px'
            }}>
                  <span>Show results</span>
                  <ChevronRight size={16} color="#FFFFFF" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};