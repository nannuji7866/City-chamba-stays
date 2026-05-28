import React, { useState, useCallback, useRef } from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
const FONT = "'Roboto', -apple-system, sans-serif";
interface StayCardProps {
  image: string;
  title: string;
  price: number;
  description: string;
  tags: [string, string];
  propertyType?: string;
  rating?: number;
  location?: string;
  onSave?: () => void;
}
interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  emoji: string;
}
const SPARKLE_COLORS = ['#FF385C', '#FFD600', '#52B788', '#FF9F43', '#A29BFE', '#FD79A8', '#00CEC9', '#FDCB6E'];
const SPARKLE_EMOJIS = ['✨', '❤️', '💫', '⭐', '✨', '❤️', '💛', '✨'];
export const StayCard: React.FC<StayCardProps> = ({
  image,
  title,
  price,
  description,
  tags,
  propertyType = 'Cottage',
  rating = 4.8,
  location = 'Chamba, Himachal Pradesh',
  onSave
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [heartPhase, setHeartPhase] = useState<'idle' | 'squish' | 'explode' | 'rotate' | 'settle'>('idle');
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [rippleVisible, setRippleVisible] = useState(false);

  // 3D tilt press effect
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const springRotateX = useSpring(rotateX, {
    stiffness: 300,
    damping: 20
  });
  const springRotateY = useSpring(rotateY, {
    stiffness: 300,
    damping: 20
  });
  const springScale = useSpring(scale, {
    stiffness: 280,
    damping: 22
  });
  const handleCardPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    rotateX.set(-dy * 6);
    rotateY.set(dx * 6);
    scale.set(0.972);
  }, [rotateX, rotateY, scale]);
  const handleCardPointerUp = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);
  const handleSave = useCallback(() => {
    if (isSaved) {
      setIsSaved(false);
      setHeartPhase('idle');
      return;
    }
    setIsSaved(true);
    setHeartPhase('squish');

    // Burst sparkles
    const newSparkles: SparkleParticle[] = Array.from({
      length: 8
    }, (_, i) => {
      const angle = i / 8 * 2 * Math.PI;
      const dist = 32 + Math.random() * 18;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
        size: 8 + Math.random() * 6,
        emoji: SPARKLE_EMOJIS[i]
      };
    });
    setSparkles(newSparkles);
    setTimeout(() => setHeartPhase('explode'), 80);
    setTimeout(() => setHeartPhase('rotate'), 200);
    setTimeout(() => setHeartPhase('settle'), 360);
    setTimeout(() => {
      setHeartPhase('idle');
      setSparkles([]);
    }, 700);

    // Ripple
    setRippleVisible(true);
    setTimeout(() => setRippleVisible(false), 700);
    onSave?.();
  }, [isSaved, onSave]);
  const heartVariants = {
    idle: {
      scale: 1,
      rotate: 0
    },
    squish: {
      scale: 0,
      rotate: 0,
      transition: {
        duration: 0.08,
        ease: 'easeIn'
      }
    },
    explode: {
      scale: 1.6,
      rotate: 10,
      transition: {
        type: 'spring',
        stiffness: 520,
        damping: 12
      }
    },
    rotate: {
      scale: 1.3,
      rotate: -8,
      transition: {
        duration: 0.1,
        ease: 'easeOut'
      }
    },
    settle: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 18
      }
    }
  };
  return <motion.div ref={cardRef} onPointerDown={handleCardPointerDown} onPointerUp={handleCardPointerUp} onPointerLeave={handleCardPointerUp} style={{
    rotateX: springRotateX,
    rotateY: springRotateY,
    scale: springScale,
    transformPerspective: 900,
    background: 'linear-gradient(145deg, rgba(255,255,255,0.93) 0%, rgba(235,248,241,0.88) 100%)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(45,106,79,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.82)',
    border: '1px solid rgba(82,183,136,0.16)',
    padding: '10px 10px 16px 10px',
    margin: '0 20px',
    fontFamily: FONT,
    cursor: 'pointer',
    userSelect: 'none'
  }}>
      {/* Property Image Container */}
      <div style={{
      width: '100%',
      height: '220px',
      borderRadius: '18px',
      overflow: 'hidden',
      flexShrink: 0,
      position: 'relative'
    }}>
        <img src={image} alt={title} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }} />

        {/* Bottom gradient */}
        <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.28), transparent)',
        borderRadius: '0 0 18px 18px',
        pointerEvents: 'none'
      }} />

        {/* Property type pill */}
        <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#1C1C1E',
        fontSize: '10px',
        fontWeight: 500,
        fontFamily: FONT,
        padding: '4px 10px',
        borderRadius: '20px',
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}>
          {propertyType}
        </div>

        {/* Heart button — Duolingo-style */}
        <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px'
      }} onClick={e => {
        e.stopPropagation();
        handleSave();
      }}>
          {/* Ripple ring */}
          <AnimatePresence>
            {rippleVisible && <motion.div key="ripple" initial={{
            scale: 0.5,
            opacity: 0.7
          }} animate={{
            scale: 2.8,
            opacity: 0
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.65,
            ease: 'easeOut'
          }} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid #FF385C',
            marginTop: '-16px',
            marginLeft: '-16px',
            pointerEvents: 'none',
            zIndex: 5
          }} />}
          </AnimatePresence>

          {/* Sparkle particles */}
          <AnimatePresence>
            {sparkles.map(sparkle => <motion.div key={sparkle.id} initial={{
            opacity: 1,
            scale: 0,
            x: 0,
            y: 0
          }} animate={{
            opacity: 0,
            scale: 1,
            x: sparkle.x,
            y: sparkle.y
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.65,
            ease: 'easeOut'
          }} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: sparkle.size,
            height: sparkle.size,
            borderRadius: '50%',
            background: sparkle.color,
            marginTop: -sparkle.size / 2,
            marginLeft: -sparkle.size / 2,
            pointerEvents: 'none',
            zIndex: 10,
            fontSize: sparkle.size * 1.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />)}
          </AnimatePresence>

          <motion.button aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'} variants={heartVariants} animate={heartPhase} style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: isSaved ? '#FFF0F3' : '#FFFFFF',
          border: isSaved ? '1.5px solid rgba(255,56,92,0.25)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSaved ? '0 2px 12px rgba(255,56,92,0.32)' : '0 2px 8px rgba(0,0,0,0.15)',
          padding: 0,
          position: 'relative',
          zIndex: 6
        }}>
            <Heart size={17} strokeWidth={1.8} fill={isSaved ? '#FF385C' : 'none'} color={isSaved ? '#FF385C' : '#1C1C1E'} />
          </motion.button>
        </div>
      </div>

      {/* Dot Indicators */}
      <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px',
      marginTop: '10px'
    }}>
        <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#1C1C1E'
      }} />
        <div style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.20)'
      }} />
        <div style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.20)'
      }} />
      </div>

      {/* Content Area */}
      <div style={{
      padding: '0 6px'
    }}>
        {/* Row 1: Title + Price */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginTop: '12px'
      }}>
          <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1C1C1E',
          letterSpacing: '-0.2px',
          lineHeight: 1.2,
          margin: 0,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: FONT
        }}>
            {title}
          </h3>
          <div style={{
          background: '#1C1C1E',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: FONT,
          padding: '5px 12px',
          borderRadius: '20px',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
            <span>₹{price.toLocaleString()}</span>
          </div>
        </div>

        {/* Location + Rating Row */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5px'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px'
        }}>
            <MapPin size={12} strokeWidth={1.5} style={{
            color: '#8E8E93',
            flexShrink: 0
          }} />
            <span style={{
            fontFamily: FONT,
            fontSize: '12px',
            fontWeight: 400,
            color: '#8E8E93',
            letterSpacing: '0px',
            lineHeight: 1.4
          }}>
              {location}
            </span>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px'
        }}>
            <Star size={12} strokeWidth={1.5} fill="#F59E0B" style={{
            color: '#F59E0B',
            flexShrink: 0
          }} />
            <span style={{
            fontFamily: FONT,
            fontSize: '12px',
            fontWeight: 500,
            color: '#1C1C1E'
          }}>
              {rating}
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={{
        fontFamily: FONT,
        fontSize: '13px',
        fontWeight: 400,
        color: '#6B6B6B',
        lineHeight: 1.55,
        margin: '7px 0 0 0',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
          {description}
        </p>

        {/* Tag Pills */}
        <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        marginTop: '10px'
      }}>
          {tags.map(tag => <div key={tag} style={{
          background: '#F2F2F7',
          color: '#3A3A3C',
          fontSize: '11px',
          fontWeight: 400,
          fontFamily: FONT,
          padding: '5px 12px',
          borderRadius: '20px',
          whiteSpace: 'nowrap'
        }}>
              {tag}
            </div>)}
        </div>

        {/* CTA Button */}
        <button style={{
        width: '100%',
        marginTop: '14px',
        color: '#FFFFFF',
        fontWeight: 500,
        height: '50px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.22)',
        cursor: 'pointer',
        letterSpacing: '0.1px',
        textShadow: '0 1px 2px rgba(0,0,0,0.18)',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(90deg, rgba(45,106,79,0.9) 0%, rgba(45,106,79,0.9) 100%)',
        fontFamily: FONT,
        fontSize: '18px',
        boxShadow: '0px 4px 20px 0px #bdc7ac, 0px 1px 0px 0px rgba(255,255,255,0.28), 0px -1px 0px 0px rgba(0,0,0,0.12)'
      }}>
          <div style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 100%)',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          position: 'absolute'
        }} />
          <span>Book Now</span>
        </button>
      </div>
    </motion.div>;
};