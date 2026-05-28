import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ChevronLeft, MapPin, Bed, Users, Bath, Plus, Minus, Navigation, Check, FileText, Wand2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Types & Constants
 */
interface StepperValue {
  label: string;
  value: number;
  icon: React.ReactNode;
  min: number;
  hint: string;
}
interface EncouragementItem {
  threshold: number;
  text: string;
  emoji: string;
}
const DESCRIPTION_MAX = 300;
const DESCRIPTION_WARN = 250;
const DESCRIPTION_DANGER = 290;
const AI_SUGGESTIONS = ['A peaceful getaway nestled in the hills. Wake up to fresh mountain air, enjoy a fully equipped kitchen, and unwind on the private terrace with breathtaking views. Perfect for couples and solo travelers.', 'Modern and cozy apartment in the heart of the city. Walking distance to top restaurants, cafes, and attractions. Features fast WiFi, a comfortable workspace, and all the amenities you need for a perfect stay.', 'Charming cottage surrounded by nature. Ideal for a quiet retreat — enjoy the fireplace, lush garden, and starlit nights. A truly magical escape from the everyday hustle.', 'A sun-soaked retreat with sweeping valley views and handcrafted wooden interiors. Mornings here smell like pine and coffee. Evenings belong to the stars. Come as a guest, leave as a local.'];
const PROPERTY_TYPES = ['Wooden Cabin', 'Cottage', 'Heritage Stay', 'Farmhouse', 'Villa'];
const ENCOURAGEMENTS: EncouragementItem[] = [{
  threshold: 1,
  text: 'Great start!',
  emoji: '✨'
}, {
  threshold: 2,
  text: 'Looking great so far!',
  emoji: '✅'
}, {
  threshold: 3,
  text: 'Almost halfway there!',
  emoji: '🌟'
}, {
  threshold: 4,
  text: "You're on a roll!",
  emoji: '🚀'
}, {
  threshold: 5,
  text: "That's everything!",
  emoji: '🎉'
}];
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1
    }
  }
};
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/**
 * Sub-components
 */

const FormLabel = ({
  children
}: {
  children: React.ReactNode;
}) => <span style={{
  fontFamily: 'Inter, sans-serif',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.4px',
  textTransform: 'uppercase' as const,
  color: '#1C1C1E',
  display: 'block',
  marginBottom: '8px'
}}>
    {children}
  </span>;
const InputField = ({
  placeholder,
  label,
  value,
  onChange
}: {
  placeholder: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  const isFilled = value.trim().length >= 2;
  return <div className="flex flex-col mb-4">
      <div className="flex items-center justify-between mb-[8px]">
        <FormLabel>{label}</FormLabel>
        <AnimatePresence>
          {isFilled && <motion.div key="check" initial={{
          scale: 0,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0,
          opacity: 0
        }} transition={{
          type: 'spring',
          stiffness: 500,
          damping: 22
        }} className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                <Check size={10} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
      <div className="relative">
        <input type="text" value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        color: '#1C1C1E',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: focused ? '0 0 0 3px rgba(255, 186, 100, 0.18), 0 1px 4px rgba(255, 149, 0, 0.08)' : isFilled ? '0 0 0 2px rgba(16,185,129,0.15)' : 'none'
      }} className={cn('w-full bg-[#F2F2F7] rounded-[12px] h-[48px] px-4 border focus:outline-none placeholder:text-[#C7C7CC] transition-all', focused ? 'border-[#FFBA64]/60 bg-white' : isFilled ? 'border-[#10B981]/30 bg-[#F0FDF4]' : 'border-transparent')} />
      </div>
    </div>;
};
const NumberRoll = ({
  value
}: {
  value: number;
}) => {
  const [display, setDisplay] = useState(value);
  const [dir, setDir] = useState(0);
  const prevRef = useRef(value);
  useEffect(() => {
    if (value !== prevRef.current) {
      setDir(value > prevRef.current ? 1 : -1);
      prevRef.current = value;
      const t = setTimeout(() => setDisplay(value), 10);
      return () => clearTimeout(t);
    }
  }, [value]);
  return <div className="overflow-hidden h-[22px] flex items-center justify-center" style={{
    minWidth: 20
  }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={display} initial={{
        y: dir > 0 ? 14 : -14,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} exit={{
        y: dir > 0 ? -14 : 14,
        opacity: 0
      }} transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1]
      }} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        fontWeight: 600,
        color: '#1C1C1E',
        lineHeight: 1,
        display: 'block'
      }}>
          {display}
        </motion.span>
      </AnimatePresence>
    </div>;
};
const StepperCard = ({
  item,
  onIncrease,
  onDecrease
}: {
  item: StepperValue;
  onIncrease: () => void;
  onDecrease: () => void;
}) => {
  const minusControls = useAnimation();
  const plusControls = useAnimation();
  const handleDecrease = () => {
    if (item.value <= item.min) return;
    minusControls.start({
      scale: [1, 0.72, 1.15, 1],
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    });
    onDecrease();
  };
  const handleIncrease = () => {
    plusControls.start({
      scale: [1, 0.72, 1.18, 1],
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    });
    onIncrease();
  };
  return <div className="flex-1 bg-[#F2F2F7] rounded-[12px] p-3 flex flex-col items-center justify-center min-w-0">
      <div className="text-[#8E8E93] mb-1">{item.icon}</div>
      <span style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      fontWeight: 400,
      color: '#8E8E93',
      whiteSpace: 'nowrap',
      marginBottom: '4px',
      display: 'block'
    }}>
        {item.label}
      </span>
      <div className="mb-2">
        <NumberRoll value={item.value} />
      </div>
      <div className="flex items-center gap-2">
        <motion.button animate={minusControls} onClick={handleDecrease} disabled={item.value <= item.min} className={cn('w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm transition-opacity', item.value <= item.min && 'opacity-40')}>
          <Minus size={14} className="text-[#1C1C1E]" />
        </motion.button>
        <motion.button animate={plusControls} onClick={handleIncrease} className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Plus size={14} className="text-[#1C1C1E]" />
        </motion.button>
      </div>
    </div>;
};
const MapPreviewCard = () => <div className="bg-[#F2F2F7] rounded-[12px] h-[80px] flex items-center justify-center gap-2 mt-2 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
    backgroundImage: 'radial-gradient(#000 1px, transparent 0)',
    backgroundSize: '20px 20px'
  }} />
    <div className="relative flex flex-col items-center">
      <MapPin size={18} className="text-[#8E8E93] mb-1" />
      <span style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      fontWeight: 400,
      color: '#8E8E93'
    }}>
        Chamba, Himachal Pradesh
      </span>
    </div>
    <div className="absolute top-2 right-2">
      <div className="w-5 h-5 bg-[#FF385C] rounded-full flex items-center justify-center shadow-sm">
        <Navigation size={10} className="text-white fill-current" />
      </div>
    </div>
  </div>;
const EncouragementToast = ({
  text,
  emoji
}: {
  text: string;
  emoji: string;
}) => <motion.div key={text} initial={{
  opacity: 0,
  y: 8,
  scale: 0.94
}} animate={{
  opacity: 1,
  y: 0,
  scale: 1
}} exit={{
  opacity: 0,
  y: -6,
  scale: 0.95
}} transition={{
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1]
}} className="flex items-center gap-2 bg-white rounded-[10px] px-3 py-2 shadow-sm border border-[#E8F5E9]" style={{
  boxShadow: '0 2px 12px rgba(16,185,129,0.10)'
}}>
    <span style={{
    fontSize: '14px'
  }}>{emoji}</span>
    <span style={{
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    color: '#059669'
  }}>
      {text}
    </span>
  </motion.div>;

/**
 * AnimatedCounter — smoothly rolls through digit changes
 */
const AnimatedCounter = ({
  count,
  max
}: {
  count: number;
  max: number;
}) => {
  const isWarn = count >= DESCRIPTION_WARN;
  const isDanger = count >= DESCRIPTION_DANGER;
  const color = isDanger ? '#FF3B30' : isWarn ? '#FF9500' : '#8E8E93';
  return <span style={{
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    fontWeight: 500,
    color,
    transition: 'color 0.25s ease',
    letterSpacing: '0.2px'
  }}>
      <span>{count}</span>
      <span style={{
      color: '#C7C7CC'
    }}>{` / ${max}`}</span>
    </span>;
};

/**
 * DescriptionSection — textarea + AI suggest
 */
const DescriptionSection = ({
  description,
  onDescriptionChange
}: {
  description: string;
  onDescriptionChange: (val: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [hasSuggested, setHasSuggested] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshControls = useAnimation();
  const charCount = description.length;
  const runTypewriter = (text: string) => {
    // Clear any ongoing typewriter
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    onDescriptionChange('');
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        onDescriptionChange(text.slice(0, i));
        i++;
        typewriterRef.current = setTimeout(step, 18);
      }
    };
    step();
  };
  const handleSuggestAI = () => {
    if (isLoadingAI) return;
    setIsLoadingAI(true);
    // Spin the regenerate icon if we've already suggested
    if (hasSuggested) {
      refreshControls.start({
        rotate: 360,
        transition: {
          duration: 0.7,
          ease: 'easeInOut'
        }
      }).then(() => refreshControls.set({
        rotate: 0
      }));
    }
    // Fake 1.1s loading, then typewrite
    setTimeout(() => {
      const nextIndex = (suggestionIndex + 1) % AI_SUGGESTIONS.length;
      setSuggestionIndex(nextIndex);
      setIsLoadingAI(false);
      setHasSuggested(true);
      runTypewriter(AI_SUGGESTIONS[nextIndex]);
    }, 1100);
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= DESCRIPTION_MAX) {
      onDescriptionChange(e.target.value);
    }
  };
  return <div className="flex flex-col">
      {/* Section heading */}
      <div className="flex items-center gap-2 mb-1">
        <FileText size={14} color="#FF385C" strokeWidth={2} />
        <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.4px',
        textTransform: 'uppercase' as const,
        color: '#1C1C1E'
      }}>
          Tell us about your space
        </span>
      </div>
      <p style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      fontWeight: 400,
      color: '#8E8E93',
      marginBottom: '10px',
      marginTop: '2px'
    }}>
        Help guests know what makes your place special
      </p>

      {/* Textarea + counter */}
      <div className="relative">
        <textarea value={description} onChange={handleTextareaChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="e.g. A cozy mountain retreat with stunning valley views..." maxLength={DESCRIPTION_MAX} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        color: '#1C1C1E',
        resize: 'vertical',
        minHeight: '100px',
        maxHeight: '160px',
        lineHeight: 1.55,
        transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
        boxShadow: focused ? '0 0 0 3px rgba(255, 56, 92, 0.13), 0 1px 4px rgba(255, 56, 92, 0.07)' : 'none'
      }} className={cn('w-full bg-[#F2F2F7] rounded-2xl px-4 pt-3 pb-8 border focus:outline-none placeholder:text-[#C7C7CC] transition-all', focused ? 'border-[#FF385C]/50 bg-white' : 'border-transparent')} />
        {/* Character counter — bottom right of textarea */}
        <div className="absolute bottom-2.5 right-3.5 pointer-events-none">
          <AnimatedCounter count={charCount} max={DESCRIPTION_MAX} />
        </div>
      </div>

      {/* AI Suggest button */}
      <div className="mt-3">
        <motion.button onClick={handleSuggestAI} disabled={isLoadingAI} whileTap={{
        scale: 0.96
      }} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 500,
        borderColor: isLoadingAI ? '#E5E5EA' : '#FF385C',
        transition: 'all 0.22s ease',
        color: "#8a909b",
        borderTopWidth: "1px",
        borderTopColor: "#f0acb8",
        borderRightWidth: "1px",
        borderRightColor: "#f0acb8",
        borderBottomWidth: "1px",
        borderBottomColor: "#f0acb8",
        borderLeftWidth: "1px",
        borderLeftColor: "#f0acb8",
        borderStyle: "solid",
        borderRadius: "3.35544e+07px"
      }} className="flex items-center gap-2 px-4 h-9 rounded-full border bg-white">
          {isLoadingAI ?
        // Shimmer skeleton inside button
        <span className="flex items-center gap-2">
              <span style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: 'linear-gradient(90deg, #F2F2F7 25%, #E5E5EA 50%, #F2F2F7 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1s infinite linear'
          }} />
              <span style={{
            display: 'inline-block',
            width: '80px',
            height: '10px',
            borderRadius: '6px',
            background: 'linear-gradient(90deg, #F2F2F7 25%, #E5E5EA 50%, #F2F2F7 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1s infinite linear'
          }} />
            </span> : hasSuggested ? <span className="flex items-center gap-1.5">
              <motion.span animate={refreshControls} style={{
            display: 'flex'
          }}>
                <RefreshCw size={14} color="#FF385C" />
              </motion.span>
              <span>Regenerate</span>
            </span> : <span className="flex items-center gap-1.5">
              <Wand2 size={14} color="#FF385C" />
              <span>Suggest by AI</span>
            </span>}
        </motion.button>
      </div>
    </div>;
};

/**
 * Main Component: HostOnboardingStep2
 */
export const HostOnboardingStep2: React.FC = () => {
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedType, setSelectedType] = useState('Wooden Cabin');
  const [description, setDescription] = useState('');
  const [steppers, setSteppers] = useState<StepperValue[]>([{
    label: 'Bedrooms',
    value: 2,
    icon: <Bed size={16} />,
    min: 1,
    hint: 'rooms'
  }, {
    label: 'Guests',
    value: 4,
    icon: <Users size={16} />,
    min: 1,
    hint: 'guests'
  }, {
    label: 'Bathrooms',
    value: 1,
    icon: <Bath size={16} />,
    min: 1,
    hint: 'baths'
  }]);
  const nameOk = propertyName.trim().length >= 2;
  const addressOk = address.trim().length >= 2;
  const typeOk = true; // always has a value
  const spaceOk = true; // always has values

  const completedSections = [nameOk, addressOk, spaceOk, typeOk].filter(Boolean).length;
  const allFilled = nameOk && addressOk;

  // Progress: base 40% + earned segments
  const progressWidth = Math.min(20 + completedSections * 12, 68);
  const encouragement = completedSections >= 1 ? ENCOURAGEMENTS.find(e => e.threshold === Math.min(completedSections, ENCOURAGEMENTS.length)) ?? null : null;
  const [lastEncouragement, setLastEncouragement] = useState<EncouragementItem | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const prevCompletedRef = useRef(completedSections);
  useEffect(() => {
    if (completedSections > prevCompletedRef.current && encouragement) {
      setLastEncouragement(encouragement);
      setShowEncouragement(true);
      const t = setTimeout(() => setShowEncouragement(false), 2800);
      prevCompletedRef.current = completedSections;
      return () => clearTimeout(t);
    }
    prevCompletedRef.current = completedSections;
  }, [completedSections, encouragement]);
  const handleStepperChange = (index: number, delta: number) => {
    const newSteppers = [...steppers];
    const newValue = newSteppers[index].value + delta;
    if (newValue >= newSteppers[index].min) {
      newSteppers[index] = {
        ...newSteppers[index],
        value: newValue
      };
      setSteppers(newSteppers);
    }
  };

  // Character mood
  const charEmoji = allFilled ? '🏡' : nameOk || addressOk ? '😊' : '📝';
  const charSubtext = allFilled ? "You're all set! Let's go! 🎉" : nameOk ? 'Nice name! Now add the address 🗺️' : 'Tell us about your place!';
  return <div className="flex flex-col min-h-screen bg-white text-[#1C1C1E]" style={{
    fontFamily: 'Inter, sans-serif'
  }}>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white pt-14 pb-4 px-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="p-1 -ml-1 text-[#1C1C1E] active:scale-95 transition-transform">
              <ChevronLeft size={24} />
            </button>
            <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '17px',
            fontWeight: 500,
            color: '#1C1C1E',
            letterSpacing: '-0.1px',
            margin: 0
          }}>
              Property Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            color: '#8E8E93'
          }}>
              2 of 5
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[#F2F2F7] rounded-full w-full overflow-hidden">
          <motion.div animate={{
          width: `${progressWidth}%`
        }} transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1]
        }} className="h-full bg-gradient-to-r from-[#FF385C] to-[#FF5A5F]" />
        </div>
      </header>

      {/* Hero Text + Character */}
      <section className="px-5 pt-6 pb-1.5">
        <div className="flex items-start gap-3 mb-3">
          <motion.div key={charEmoji} initial={{
          scale: 0.7,
          rotate: -10
        }} animate={{
          scale: 1,
          rotate: 0
        }} transition={{
          type: 'spring',
          stiffness: 380,
          damping: 18
        }} style={{
          fontSize: '32px',
          lineHeight: 1,
          flexShrink: 0,
          marginTop: '2px'
        }}>
            {charEmoji}
          </motion.div>
          <div>
            <h2 style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#1C1C1E',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            margin: 0,
            fontFamily: 'Roboto'
          }}>
              Tell us about your space
            </h2>
            <AnimatePresence mode="wait">
              <motion.p key={charSubtext} initial={{
              opacity: 0,
              y: 4
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -4
            }} transition={{
              duration: 0.28,
              ease: 'easeOut'
            }} style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#8E8E93',
              lineHeight: 1.5,
              marginTop: '4px',
              marginBottom: 0
            }}>
                {charSubtext}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Encouragement Toast */}
        <div className="h-9 flex items-center">
          <AnimatePresence>
            {showEncouragement && lastEncouragement && <EncouragementToast text={lastEncouragement.text} emoji={lastEncouragement.emoji} />}
          </AnimatePresence>
        </div>
      </section>

      {/* Form Area */}
      <motion.main className="flex-1 px-5 pb-32 mt-2 overflow-y-auto" variants={staggerContainer} initial="hidden" animate="show">
        <div className="flex flex-col gap-6">
          {/* Property Name */}
          <motion.div variants={fadeUp}>
            <InputField label="Property Name" placeholder="e.g. Alpine Woodhouse Chamba" value={propertyName} onChange={setPropertyName} />
          </motion.div>

          {/* Address */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <InputField label="Address in Chamba" placeholder="Street, area, Chamba, HP" value={address} onChange={setAddress} />
            <MapPreviewCard />
          </motion.div>

          {/* Space Steppers */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <div className="flex items-center justify-between mb-[8px]">
              <FormLabel>Space</FormLabel>
              <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#8E8E93',
              fontWeight: 400
            }}>
                The more the merrier! 🎉
              </span>
            </div>
            <div className="flex gap-2.5">
              {steppers.map((item, idx) => <StepperCard key={item.label} item={item} onIncrease={() => handleStepperChange(idx, 1)} onDecrease={() => handleStepperChange(idx, -1)} />)}
            </div>
          </motion.div>

          {/* Property Type */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <FormLabel>Property Type</FormLabel>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map(type => {
              const isSelected = type === selectedType;
              return <motion.button key={type} onClick={() => setSelectedType(type)} whileTap={{
                scale: 0.93
              }} style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500
              }} className={cn('px-4 h-9 rounded-full transition-all duration-200', isSelected ? 'bg-[#1C1C1E] text-white shadow-md' : 'bg-[#F2F2F7] text-[#3A3A3C] hover:bg-[#E5E5EA]')}>
                    {type}
                  </motion.button>;
            })}
            </div>
          </motion.div>

          {/* Description Section — NEW */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <DescriptionSection description={description} onDescriptionChange={setDescription} />
          </motion.div>

          {/* All-complete celebration */}
          <AnimatePresence>
            {allFilled && <motion.div initial={{
            opacity: 0,
            scale: 0.92,
            y: 8
          }} animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }} exit={{
            opacity: 0,
            scale: 0.92,
            y: 8
          }} transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }} className="flex items-center gap-3 rounded-[14px] px-4 py-3 bg-[#F0FDF4] border border-[#10B981]/20">
                <motion.span animate={{
              rotate: [0, -12, 12, -8, 8, 0]
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} style={{
              fontSize: '22px'
            }}>
                  🎉
                </motion.span>
                <div>
                  <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#059669',
                display: 'block'
              }}>
                    Everything looks amazing!
                  </span>
                  <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#6EE7B7'
              }}>
                    Ready to unlock your listing ✨
                  </span>
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Fixed Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-[#F2F2F7] flex items-center justify-between pb-8" style={{
      filter: "blur(4px)"
    }}>
        <button style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: 400,
        color: '#8E8E93'
      }} className="active:opacity-60 transition-opacity">
          Back
        </button>

        <motion.button animate={allFilled ? {
        scale: [1, 1.04, 1],
        boxShadow: ['0 4px 24px rgba(16,185,129,0.20)', '0 6px 32px rgba(16,185,129,0.38)', '0 4px 24px rgba(16,185,129,0.20)']
      } : {}} transition={allFilled ? {
        duration: 1.6,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: 'easeInOut'
      } : {}} whileTap={{
        scale: 0.97
      }} style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        fontWeight: 500,
        color: '#FFFFFF',
        background: "linear-gradient(90deg, #10b981 15.13%, #059669 63.84%, #047857 100%)"
      }} className="w-[60%] h-14 rounded-[16px] shadow-lg shadow-[#10B981]/20 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] flex items-center justify-center gap-2">
          <span style={{
          textShadow: "0px 8px 2px rgba(0, 0, 0, 0.2)"
        }}>Next: Amenities</span>
          {allFilled && <motion.span initial={{
          x: -4,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          duration: 0.25
        }} style={{
          fontSize: '14px'
        }}>
              →
            </motion.span>}
        </motion.button>
      </footer>

      {/* Floating Gradient Blur */}
      <div className="fixed -top-10 -right-10 w-40 h-40 bg-[#FF385C] blur-[100px] opacity-[0.03] pointer-events-none rounded-full" />
      <div className="fixed -bottom-10 -left-10 w-40 h-40 bg-[#10B981] blur-[100px] opacity-[0.03] pointer-events-none rounded-full" />
    </div>;
};