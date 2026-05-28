import * as React from "react";
import { ChevronLeft, Star, MapPin, Search, Compass, User, SlidersHorizontal, Heart, Navigation } from "lucide-react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import contextImage1 from "@/assets/magicpath/context/01-context-image-1-a4a8ab3a4409.png";

/* ─────────────────────────────────────────────────────────────
   Types & Static Data
───────────────────────────────────────────────────────────── */

interface PropertyCardData {
  id: string;
  name: string;
  price: string;
  location: string;
  rating: number;
  tag: string;
  image: string;
}
interface MapPinData {
  id: string;
  price: string;
  top: string;
  left: string;
  isActive?: boolean;
}
interface FilterChipData {
  id: string;
  label: string;
}
interface HeartParticle {
  id: number;
  emoji: string;
  angle: number;
  dist: number;
}
interface FireworkDot {
  id: number;
  color: string;
  angle: number;
  dist: number;
}
const PROPERTY_DATA: PropertyCardData[] = [{
  id: "1",
  name: "Alpine Woodhouse",
  price: "₹5,500",
  location: "Khajjiar Road",
  rating: 4.98,
  tag: "Top Pick",
  image: contextImage1
}, {
  id: "2",
  name: "Ravi River Cottage",
  price: "₹3,800",
  location: "Sahoo Village",
  rating: 4.92,
  tag: "Riverfront",
  image: contextImage1
}, {
  id: "3",
  name: "Deodar Forest Lodge",
  price: "₹4,500",
  location: "Bharmaur Rd",
  rating: 4.89,
  tag: "Nature Stay",
  image: contextImage1
}];
const MAP_PINS: MapPinData[] = [{
  id: "p1",
  price: "₹5,500",
  top: "28%",
  left: "22%"
}, {
  id: "p2",
  price: "₹3,800",
  top: "35%",
  left: "55%",
  isActive: true
}, {
  id: "p3",
  price: "₹7,200",
  top: "18%",
  left: "70%"
}, {
  id: "p4",
  price: "₹4,500",
  top: "48%",
  left: "38%"
}, {
  id: "p5",
  price: "₹1,900",
  top: "42%",
  left: "75%"
}];
const FILTER_CHIPS: FilterChipData[] = [{
  id: "all",
  label: "All Stays"
}, {
  id: "forest",
  label: "🌲 Forest"
}, {
  id: "river",
  label: "🏞️ Riverside"
}, {
  id: "mountain",
  label: "⛰️ Mountain"
}, {
  id: "heritage",
  label: "🏛️ Heritage"
}];
const HEART_EMOJIS = ["❤️", "✨", "🌟", "💖", "🌸"];
const FIREWORK_COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF922B", "#E040FB", "#00BCD4", "#FF5722"];
const interBase: React.CSSProperties = {
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
};

/* ─────────────────────────────────────────────────────────────
   Heart Explosion Burst (Duolingo-style)
───────────────────────────────────────────────────────────── */

const HeartExplosion = ({
  onComplete
}: {
  onComplete: () => void;
}) => {
  const particles: HeartParticle[] = Array.from({
    length: 12
  }, (_, i) => ({
    id: i,
    emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
    angle: 360 / 12 * i,
    dist: 32 + i % 3 * 12
  }));
  return <div className="pointer-events-none" style={{
    position: "relative",
    width: 0,
    height: 0
  }}>
      {particles.map(p => {
      const rad = p.angle * Math.PI / 180;
      const tx = Math.cos(rad) * p.dist;
      const ty = Math.sin(rad) * p.dist;
      return <motion.div key={p.id} initial={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 0
      }} animate={{
        x: tx,
        y: ty,
        opacity: 0,
        scale: 1.2
      }} transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1]
      }} onAnimationComplete={p.id === 0 ? onComplete : undefined} style={{
        position: "absolute",
        top: -8,
        left: -8,
        fontSize: "14px",
        lineHeight: 1
      }}>
            {p.emoji}
          </motion.div>;
    })}
    </div>;
};

/* ─────────────────────────────────────────────────────────────
   Heart Save Button — Full Duolingo explosion
───────────────────────────────────────────────────────────── */

const HeartSaveButton = ({
  onSave
}: {
  onSave: () => void;
}) => {
  const [saved, setSaved] = React.useState(false);
  const [burst, setBurst] = React.useState(false);
  const controls = useAnimation();
  const handlePress = async () => {
    if (saved) {
      setSaved(false);
      return;
    }
    await controls.start({
      scale: [1, 0, 1.6, 0.85, 1.2, 1.05, 1],
      rotate: [0, 0, -15, 15, -8, 5, 0],
      transition: {
        duration: 0.55,
        ease: "easeOut"
      }
    });
    setSaved(true);
    setBurst(true);
    onSave();
  };
  return <div style={{
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
      <motion.button animate={controls} onTap={handlePress} style={{
      background: "rgba(255,255,255,0.92)",
      border: "none",
      borderRadius: "50%",
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      flexShrink: 0
    }}>
        <Heart size={15} style={{
        color: saved ? "#FF385C" : "#8E8E93",
        fill: saved ? "#FF385C" : "none",
        transition: "color 0.2s, fill 0.2s"
      }} />
      </motion.button>
      <AnimatePresence>
        {burst && <HeartExplosion onComplete={() => setBurst(false)} />}
      </AnimatePresence>
    </div>;
};

/* ─────────────────────────────────────────────────────────────
   Filter Chip — spring bounce, shimmer, pop-off
───────────────────────────────────────────────────────────── */

const FilterChip = ({
  chip,
  isSelected,
  onSelect
}: {
  chip: FilterChipData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const controls = useAnimation();
  const [shimmer, setShimmer] = React.useState(false);
  const handleTap = async () => {
    if (isSelected) {
      // Pop-off animation
      await controls.start({
        scale: [1, 1.18, 0.88, 1],
        rotate: [0, 4, -4, 0],
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      });
    } else {
      // Spring bounce entrance
      await controls.start({
        scale: [1, 0.82, 1.22, 0.94, 1.06, 1],
        transition: {
          duration: 0.5,
          type: "spring",
          stiffness: 500,
          damping: 16
        }
      });
      setShimmer(true);
      setTimeout(() => setShimmer(false), 900);
    }
    onSelect(chip.id);
  };
  return <motion.button animate={controls} onTap={handleTap} style={{
    ...interBase,
    flexShrink: 0,
    fontSize: "12px",
    fontWeight: isSelected ? 600 : 400,
    color: isSelected ? "#FFFFFF" : "#3A3A3C",
    background: isSelected ? "linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)" : "#F2F2F7",
    border: "none",
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 7,
    paddingBottom: 7,
    cursor: "pointer",
    boxShadow: isSelected ? "0 3px 10px rgba(64,145,108,0.35)" : "none",
    transition: "background 0.22s, color 0.22s, box-shadow 0.22s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative"
  }}>
      <span style={{
      position: "relative",
      zIndex: 1
    }}>{chip.label}</span>
      {/* Shimmer sweep */}
      {isSelected && shimmer && <motion.div initial={{
      x: "-120%"
    }} animate={{
      x: "180%"
    }} transition={{
      duration: 0.65,
      ease: "easeInOut"
    }} style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "60%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)",
      pointerEvents: "none"
    }} />}
    </motion.button>;
};

/* ─────────────────────────────────────────────────────────────
   Map Pin — Duolingo drop-in, shadow land, pulse glow, tap jump
───────────────────────────────────────────────────────────── */

const MapPinItem = ({
  pin,
  index,
  onTap,
  mascotControls
}: {
  pin: MapPinData;
  index: number;
  onTap: (id: string) => void;
  mascotControls: ReturnType<typeof useAnimation>;
}) => {
  const [tapped, setTapped] = React.useState(false);
  const [shadowVisible, setShadowVisible] = React.useState(false);
  const controls = useAnimation();
  const isActive = pin.isActive;
  const handleTap = async () => {
    if (tapped) return;
    setTapped(true);
    // Jump up with spring
    await controls.start({
      y: [-2, -14, -2, -8, 0],
      scale: [1, 1.3, 0.95, 1.12, 1],
      transition: {
        duration: 0.55,
        ease: "easeOut"
      }
    });
    // Mascot happy jump
    mascotControls.start({
      y: [0, -16, 0, -8, 0],
      rotate: [0, -12, 12, -6, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    });
    onTap(pin.id);
    setTimeout(() => setTapped(false), 700);
  };

  // Shadow appear on land
  React.useEffect(() => {
    const t = setTimeout(() => setShadowVisible(true), 400 + index * 120 + 200);
    return () => clearTimeout(t);
  }, [index]);
  return <motion.div style={{
    position: "absolute",
    top: pin.top,
    left: pin.left
  }} initial={{
    y: -60,
    opacity: 0,
    scale: 0.4
  }} animate={{
    y: 0,
    opacity: 1,
    scale: 1
  }} transition={{
    delay: 0.3 + index * 0.12,
    type: "spring",
    stiffness: 420,
    damping: 14,
    mass: 0.8
  }}>
      {/* Landing shadow */}
      <AnimatePresence>
        {shadowVisible && <motion.div initial={{
        scaleX: 0,
        opacity: 0
      }} animate={{
        scaleX: 1,
        opacity: 0.22
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.25,
        ease: "easeOut"
      }} style={{
        position: "absolute",
        bottom: -6,
        left: "50%",
        transform: "translateX(-50%)",
        width: 36,
        height: 6,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.5)",
        filter: "blur(3px)",
        pointerEvents: "none"
      }} />}
      </AnimatePresence>

      <motion.div animate={controls} onTap={handleTap} style={{
      cursor: "pointer"
    }}>
        {/* Pulse glow ring — every 3 seconds */}
        <motion.div animate={{
        scale: [1, 2.2, 1],
        opacity: [0, 0.45, 0]
      }} transition={{
        duration: 1.4,
        repeat: Infinity,
        repeatDelay: 1.6,
        ease: "easeOut",
        delay: index * 0.5
      }} style={{
        position: "absolute",
        inset: -4,
        borderRadius: 24,
        background: isActive ? "rgba(64,145,108,0.5)" : "rgba(45,106,79,0.3)",
        pointerEvents: "none"
      }} />

        {/* Tapped burst ring */}
        <AnimatePresence>
          {tapped && <motion.div initial={{
          scale: 0.7,
          opacity: 0.7
        }} animate={{
          scale: 2.4,
          opacity: 0
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.55,
          ease: "easeOut"
        }} style={{
          position: "absolute",
          inset: -4,
          borderRadius: 24,
          background: "rgba(255,107,107,0.38)",
          pointerEvents: "none"
        }} />}
        </AnimatePresence>

        <div style={{
        position: "relative",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5,
        ...interBase,
        fontSize: "13px",
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "#FFFFFF" : "#1C1C1E",
        background: isActive ? "#1C1C1E" : "rgba(255,255,255,0.92)",
        border: isActive ? "1px solid transparent" : "1px solid rgba(0,0,0,0.1)",
        borderRadius: 20,
        backdropFilter: "blur(12px)",
        boxShadow: isActive ? "0 4px 18px rgba(64,145,108,0.28), 0 2px 8px rgba(0,0,0,0.15)" : "0 2px 12px rgba(0,0,0,0.12)"
      }}>
          {pin.price}
          <div style={{
          position: "absolute",
          bottom: -5,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `6px solid ${isActive ? "#1C1C1E" : "rgba(255,255,255,0.92)"}`
        }} />
        </div>
      </motion.div>
    </motion.div>;
};

/* ─────────────────────────────────────────────────────────────
   Mascot Explorer Character
───────────────────────────────────────────────────────────── */

const MascotExplorer = ({
  mascotControls
}: {
  mascotControls: ReturnType<typeof useAnimation>;
}) => {
  return <motion.div animate={mascotControls} style={{
    position: "absolute",
    bottom: 20,
    left: 12,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "default",
    userSelect: "none"
  }}>
      {/* Idle bob */}
      <motion.div animate={{
      y: [0, -5, 0]
    }} transition={{
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut"
    }}>
        {/* Character SVG — cute explorer */}
        <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hat */}
          <ellipse cx="22" cy="13" rx="13" ry="3.5" fill="#5C4033" />
          <rect x="15" y="5" width="14" height="10" rx="4" fill="#795548" />
          <rect x="17" y="8" width="10" height="4" rx="2" fill="#A1887F" />
          {/* Hatband */}
          <rect x="15" y="13" width="14" height="2.5" rx="1.2" fill="#40916C" />

          {/* Face */}
          <ellipse cx="22" cy="21" rx="9" ry="9.5" fill="#FFCC80" />
          {/* Eyes */}
          <ellipse cx="18.5" cy="19.5" rx="1.5" ry="2" fill="#3E2723" />
          <ellipse cx="25.5" cy="19.5" rx="1.5" ry="2" fill="#3E2723" />
          {/* Eye shine */}
          <circle cx="19.3" cy="18.8" r="0.5" fill="white" />
          <circle cx="26.3" cy="18.8" r="0.5" fill="white" />
          {/* Rosy cheeks */}
          <ellipse cx="16" cy="22" rx="2.2" ry="1.4" fill="#FFAB91" opacity="0.7" />
          <ellipse cx="28" cy="22" rx="2.2" ry="1.4" fill="#FFAB91" opacity="0.7" />
          {/* Smile */}
          <path d="M18.5 23.5 Q22 26.5 25.5 23.5" stroke="#BF6E3D" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Body */}
          <rect x="14" y="30" width="16" height="14" rx="5" fill="#66BB6A" />
          {/* Backpack */}
          <rect x="9" y="30" width="7" height="10" rx="3" fill="#8D6E63" />
          <rect x="10" y="32" width="5" height="6" rx="2" fill="#A1887F" />
          {/* Belt */}
          <rect x="14" y="38" width="16" height="2.5" rx="1.2" fill="#5C4033" />

          {/* Left arm */}
          <rect x="8" y="32" width="5" height="2.5" rx="1.2" fill="#FFCC80" />
          {/* Right arm (pointing) */}
          <rect x="31" y="31" width="6" height="2.5" rx="1.2" fill="#FFCC80" />
          <polygon points="37,30 40,32.2 37,34.4" fill="#FFCC80" />

          {/* Legs */}
          <rect x="16" y="43" width="5" height="8" rx="2.5" fill="#455A64" />
          <rect x="23" y="43" width="5" height="8" rx="2.5" fill="#455A64" />
          {/* Boots */}
          <rect x="15" y="49" width="7" height="3" rx="1.5" fill="#3E2723" />
          <rect x="22" y="49" width="7" height="3" rx="1.5" fill="#3E2723" />
        </svg>
      </motion.div>

      {/* Speech bubble */}
      <motion.div initial={{
      opacity: 0,
      scale: 0.5
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      delay: 1.5,
      type: "spring",
      stiffness: 380,
      damping: 20
    }} style={{
      background: "white",
      borderRadius: 12,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
      paddingBottom: 4,
      ...interBase,
      fontSize: "9px",
      fontWeight: 600,
      color: "#2D6A4F",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      marginTop: 2,
      whiteSpace: "nowrap"
    }}>
        Explore! 🗺️
      </motion.div>
    </motion.div>;
};

/* ─────────────────────────────────────────────────────────────
   Property Card — spring slide, 3D tilt, heart explosion
───────────────────────────────────────────────────────────── */

const PropertyCard = ({
  data,
  index,
  onSave
}: {
  data: PropertyCardData;
  index: number;
  onSave: (name: string) => void;
}) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const cardRotateX = useTransform(rotateX, [-1, 1], ["-6deg", "6deg"]);
  const cardRotateY = useTransform(rotateY, [-1, 1], ["-8deg", "8deg"]);
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set((e.clientY - cy) / (rect.height / 2));
    rotateY.set((e.clientX - cx) / (rect.width / 2));
  };
  const handlePointerLeave = () => {
    animate(rotateX, 0, {
      type: "spring",
      stiffness: 300,
      damping: 20
    });
    animate(rotateY, 0, {
      type: "spring",
      stiffness: 300,
      damping: 20
    });
  };
  return <motion.div className="w-[240px] flex-shrink-0 snap-start" initial={{
    opacity: 0,
    y: 48,
    scale: 0.88
  }} animate={{
    opacity: 1,
    y: 0,
    scale: 1
  }} transition={{
    delay: 0.55 + index * 0.1,
    type: "spring",
    stiffness: 300,
    damping: 18,
    mass: 0.9
  }} style={{
    perspective: 800
  }}>
      <motion.div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} style={{
      rotateX: cardRotateX,
      rotateY: cardRotateY,
      transformStyle: "preserve-3d",
      background: "white",
      borderRadius: 20,
      padding: 8,
      paddingBottom: 12,
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)"
    }} whileTap={{
      scale: 0.97
    }}>
        <div style={{
        position: "relative",
        width: "100%",
        height: 130,
        borderRadius: 14,
        overflow: "hidden"
      }}>
          <img src={data.image} alt={data.name} style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }} />
          <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)"
        }} />
          <div style={{
          position: "absolute",
          top: 8,
          right: 8
        }}>
            <HeartSaveButton onSave={() => onSave(data.name)} />
          </div>
        </div>

        <div style={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 8
      }}>
          <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8
        }}>
            <h3 style={{
            ...interBase,
            fontSize: "14px",
            fontWeight: 500,
            color: "#1C1C1E",
            letterSpacing: "-0.1px",
            lineHeight: "1.3",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0
          }}>
              {data.name}
            </h3>
            <div style={{
            background: "#1C1C1E",
            color: "#FFFFFF",
            borderRadius: 12,
            whiteSpace: "nowrap",
            flexShrink: 0,
            ...interBase,
            fontSize: "12px",
            fontWeight: 600,
            paddingLeft: 9,
            paddingRight: 9,
            paddingTop: 3,
            paddingBottom: 3
          }}>
              {data.price}
            </div>
          </div>

          <div style={{
          display: "flex",
          alignItems: "center",
          marginTop: 2
        }}>
            <MapPin size={11} style={{
            color: "#8E8E93",
            marginRight: 4,
            flexShrink: 0
          }} />
            <span style={{
            ...interBase,
            fontSize: "11px",
            fontWeight: 400,
            color: "#8E8E93",
            lineHeight: "1.4",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
              {data.location}
            </span>
          </div>

          <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 6
        }}>
            <div style={{
            display: "flex",
            alignItems: "center"
          }}>
              <Star size={11} style={{
              color: "#8E8E93",
              fill: "#8E8E93",
              marginRight: 2,
              flexShrink: 0
            }} />
              <span style={{
              ...interBase,
              fontSize: "11px",
              fontWeight: 400,
              color: "#8E8E93"
            }}>
                {data.rating}
              </span>
            </div>
            <div style={{
            background: "#F2F2F7",
            borderRadius: 10,
            ...interBase,
            fontSize: "10px",
            fontWeight: 400,
            color: "#3A3A3C",
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 3,
            paddingBottom: 3
          }}>
              {data.tag}
            </div>
          </div>

          <motion.button style={{
          width: "100%",
          marginTop: 10,
          height: 38,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "linear-gradient(135deg, #2D6A4F 0%, #40916C 40%, #52B788 100%)",
          textShadow: "0 1px 2px rgba(0,0,0,0.15)",
          boxShadow: "0 3px 14px rgba(64,145,108,0.38), inset 0 1px 0 rgba(255,255,255,0.25)",
          cursor: "pointer"
        }} whileTap={{
          scale: 0.94
        }}>
            <span style={{
            ...interBase,
            fontSize: "13px",
            fontWeight: 500,
            color: "#FFFFFF"
          }}>
              Book Now
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>;
};

/* ─────────────────────────────────────────────────────────────
   Location Button — 3 sonar rings, spin on tap
───────────────────────────────────────────────────────────── */

const LocationButton = () => {
  const [spinning, setSpinning] = React.useState(false);
  const controls = useAnimation();
  const handleTap = async () => {
    if (spinning) return;
    setSpinning(true);
    await controls.start({
      rotate: [0, 360],
      scale: [1, 0.85, 1.2, 1],
      transition: {
        rotate: {
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1]
        },
        scale: {
          duration: 0.55,
          ease: "easeOut"
        }
      }
    });
    setSpinning(false);
  };
  const sonarRings = [0, 1, 2];
  return <div style={{
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
      {/* 3 expanding sonar rings */}
      {sonarRings.map(i => <motion.div key={i} animate={{
      scale: [1, 2.6],
      opacity: [0.5, 0]
    }} transition={{
      duration: 2.4,
      repeat: Infinity,
      ease: "easeOut",
      delay: i * 0.7
    }} style={{
      position: "absolute",
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "1.5px solid rgba(64,145,108,0.55)",
      pointerEvents: "none"
    }} />)}

      <motion.button animate={controls} onTap={handleTap} style={{
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "white",
      border: "none",
      boxShadow: "0 2px 12px rgba(0,0,0,0.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      position: "relative",
      zIndex: 1
    }}>
        <Navigation size={16} style={{
        color: "#40916C"
      }} />
      </motion.button>
    </div>;
};

/* ─────────────────────────────────────────────────────────────
   Firework dots for Discovery Toast
───────────────────────────────────────────────────────────── */

const FireworkCorner = ({
  side,
  active
}: {
  side: "left" | "right";
  active: boolean;
}) => {
  const dots: FireworkDot[] = Array.from({
    length: 6
  }, (_, i) => ({
    id: i,
    color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
    angle: (side === "left" ? 180 : 0) + (i - 2.5) * 28,
    dist: 22 + i * 5
  }));
  return <div style={{
    position: "absolute",
    top: 4,
    [side === "left" ? "left" : "right"]: -4,
    width: 0,
    height: 0,
    pointerEvents: "none"
  }}>
      <AnimatePresence>
        {active && dots.map(d => {
        const rad = d.angle * Math.PI / 180;
        const tx = Math.cos(rad) * d.dist;
        const ty = Math.sin(rad) * d.dist;
        return <motion.div key={d.id} initial={{
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1
        }} animate={{
          x: tx,
          y: ty,
          opacity: 0,
          scale: 0.2
        }} transition={{
          duration: 0.7,
          ease: "easeOut",
          delay: d.id * 0.04
        }} style={{
          position: "absolute",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: d.color,
          top: -3.5,
          left: -3.5
        }} />;
      })}
      </AnimatePresence>
    </div>;
};

/* ─────────────────────────────────────────────────────────────
   Toast Notification — drops from top with bounce + fireworks
───────────────────────────────────────────────────────────── */

const ExploreToast = ({
  message,
  isDiscovery,
  onDismiss
}: {
  message: string;
  isDiscovery: boolean;
  onDismiss: () => void;
}) => {
  const [firework, setFirework] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 3400);
    if (isDiscovery) {
      setFirework(true);
      const ft = setTimeout(() => setFirework(false), 800);
      return () => {
        clearTimeout(t);
        clearTimeout(ft);
      };
    }
    return () => clearTimeout(t);
  }, [onDismiss, isDiscovery]);
  return <motion.div initial={{
    opacity: 0,
    y: -60,
    scale: 0.5
  }} animate={{
    opacity: 1,
    y: 0,
    scale: 1
  }} exit={{
    opacity: 0,
    y: -30,
    scale: 0.85
  }} transition={{
    type: "spring",
    stiffness: 460,
    damping: 18,
    mass: 0.7
  }} style={{
    position: "fixed",
    top: 110,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 70,
    background: "#1C1C1E",
    color: "#FFFFFF",
    borderRadius: 24,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
    ...interBase,
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    boxShadow: "0 8px 30px rgba(0,0,0,0.28)",
    display: "flex",
    alignItems: "center",
    gap: 6
  }}>
      <FireworkCorner side="left" active={firework} />
      <FireworkCorner side="right" active={firework} />
      <span>{message}</span>
    </motion.div>;
};

/* ─────────────────────────────────────────────────────────────
   Main Screen
───────────────────────────────────────────────────────────── */

export const DiscoverMapScreen = () => {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isDiscoveryToast, setIsDiscoveryToast] = React.useState(false);
  const [exploredAreas, setExploredAreas] = React.useState(0);
  const [savedCount, setSavedCount] = React.useState(0);
  const mascotControls = useAnimation();
  const toastKey = React.useRef(0);
  const showToast = React.useCallback((msg: string, discovery = false) => {
    setToastMessage(null);
    setTimeout(() => {
      toastKey.current += 1;
      setToastMessage(msg);
      setIsDiscoveryToast(discovery);
    }, 50);
  }, []);
  const handleSave = React.useCallback((name: string) => {
    setSavedCount(c => c + 1);
    showToast(`✨ ${name} saved to wishlist!`);
  }, [showToast]);
  const handlePinTap = React.useCallback((_id: string) => {
    setExploredAreas(prev => {
      const next = prev + 1;
      showToast(`🗺️ New area discovered! ✨`, true);
      return next;
    });
  }, [showToast]);
  const handleFilterSelect = React.useCallback((id: string) => {
    setSelectedFilter(id);
  }, []);
  const dismissToast = React.useCallback(() => {
    setToastMessage(null);
  }, []);
  return <div className="relative w-full h-full min-h-screen bg-white overflow-hidden select-none" style={interBase}>
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-black/5" style={{
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(20px)"
    }}>
        <div className="h-[56px] px-5 flex items-center justify-between">
          <button style={{
          color: "#1C1C1E",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}>
            <ChevronLeft size={20} />
          </button>

          <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1
        }}>
            <h1 style={{
            ...interBase,
            fontSize: "17px",
            fontWeight: 500,
            color: "#1C1C1E",
            letterSpacing: "-0.1px",
            lineHeight: "1.3",
            margin: 0
          }}>
              <span>🧭</span>
              <span> Discover</span>
            </h1>
            <p style={{
            ...interBase,
            fontSize: "10px",
            fontWeight: 400,
            color: "#8E8E93",
            lineHeight: 1,
            margin: 0
          }}>
              Tap a pin to explore 📍
            </p>
          </div>

          <motion.div style={{
          background: "#F2F2F7",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingLeft: 14,
          paddingRight: 14,
          paddingTop: 6,
          paddingBottom: 6,
          ...interBase,
          fontSize: "13px",
          fontWeight: 400,
          color: "#3A3A3C",
          cursor: "pointer"
        }} whileTap={{
          scale: 0.92
        }}>
            <SlidersHorizontal size={13} />
            <span>Filters</span>
          </motion.div>
        </div>

        {/* Filter chips */}
        <div style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "scroll",
        gap: 8,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 12,
        paddingTop: 2,
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      }} className="no-scrollbar">
          {FILTER_CHIPS.map(chip => <FilterChip key={chip.id} chip={chip} isSelected={selectedFilter === chip.id} onSelect={handleFilterSelect} />)}
        </div>
      </header>

      {/* ── MAP AREA ── */}
      <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "58%",
      overflow: "hidden"
    }}>
        {/* Map background */}
        <div style={{
        position: "absolute",
        inset: 0,
        filter: "blur(0.8px)",
        background: `
              radial-gradient(ellipse at 70% 60%, rgba(100,130,95,0.35) 0%, transparent 45%),
              radial-gradient(ellipse at 30% 40%, rgba(180,200,170,0.4) 0%, transparent 50%),
              linear-gradient(160deg, #C8D8C0 0%, #B8CDB0 20%, #A8BC9E 35%, #96A88A 50%, #8A9E82 60%, #7A8E72 70%, #6B7D65 80%, #5C6E58 100%)
            `
      }}>
          <svg style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: 150,
          opacity: 0.4
        }} viewBox="0 0 400 150" preserveAspectRatio="none">
            <path d="M0,100 C100,20 200,130 400,50" fill="none" stroke="rgba(100,140,180,0.5)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        paddingTop: 100
      }}>
          {MAP_PINS.map((pin, index) => <MapPinItem key={pin.id} pin={pin} index={index} onTap={handlePinTap} mascotControls={mascotControls} />)}

          {/* Mascot Explorer */}
          <MascotExplorer mascotControls={mascotControls} />

          {/* Location Button */}
          <div style={{
          position: "absolute",
          bottom: 16,
          right: 16
        }}>
            <LocationButton />
          </div>
        </div>
      </div>

      {/* ── BOTTOM SHEET ── */}
      <motion.div style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "48%",
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(24px)",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTop: "1px solid rgba(0,0,0,0.1)",
      boxShadow: "0 -4px 30px rgba(0,0,0,0.08)",
      zIndex: 20
    }} initial={{
      y: "100%"
    }} animate={{
      y: 0
    }} transition={{
      delay: 0.18,
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 1
    }}>
        {/* Handle */}
        <div style={{
        width: 36,
        height: 4,
        background: "rgba(0,0,0,0.2)",
        borderRadius: 2,
        margin: "12px auto 0"
      }} />

        {/* Sheet Header */}
        <div style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 14,
        paddingBottom: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
          <span style={{
          ...interBase,
          fontSize: "15px",
          fontWeight: 500,
          color: "#1C1C1E",
          letterSpacing: "-0.1px"
        }}>
            3 Stays Nearby
          </span>
          <button style={{
          ...interBase,
          fontSize: "13px",
          fontWeight: 400,
          color: "#FF385C",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer"
        }}>
            See all
          </button>
        </div>

        {/* Cards scroll */}
        <div style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "scroll",
        scrollSnapType: "x mandatory",
        gap: 14,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 4,
        paddingBottom: 20,
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      }} className="no-scrollbar">
          {PROPERTY_DATA.map((item, idx) => <PropertyCard key={item.id} data={item} index={idx} onSave={handleSave} />)}
        </div>
      </motion.div>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 84,
      borderTop: "1px solid rgba(0,0,0,0.1)",
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 12,
      display: "flex",
      alignItems: "flex-start",
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(20px)",
      zIndex: 40
    }}>
        {[{
        icon: <Compass size={22} />,
        label: "Explore",
        active: false
      }, {
        icon: <Search size={22} />,
        label: "Search",
        active: false
      }, {
        icon: <MapPin size={22} />,
        label: "Discover",
        active: true
      }, {
        icon: <User size={22} />,
        label: "Profile",
        active: false
      }].map(item => <div key={item.label} style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: item.active ? 1 : 0.5,
        color: item.active ? "#1C1C1E" : "#8E8E93"
      }}>
            {item.icon}
            <span style={{
          ...interBase,
          fontSize: "10px",
          fontWeight: item.active ? 500 : 400,
          color: item.active ? "#1C1C1E" : "#8E8E93"
        }}>
              {item.label}
            </span>
          </div>)}
      </nav>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toastMessage && <ExploreToast key={`toast-${toastKey.current}`} message={toastMessage} isDiscovery={isDiscoveryToast} onDismiss={dismissToast} />}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes shimmerSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(180%); }
        }
      `}</style>
    </div>;
};