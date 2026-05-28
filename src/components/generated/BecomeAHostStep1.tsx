import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, DoorClosed, Users, Warehouse, TreePine, Tent, Building2, Waves, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

interface PropertyType {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  emoji: string;
  encouragement: string;
}

// --- Constants ---

const PROPERTY_TYPES: PropertyType[] = [{
  id: 'entire-home',
  label: 'Entire Home',
  sublabel: 'Guests have the whole place',
  icon: <Home size={26} />,
  emoji: '🏡',
  encouragement: "Great choice! Guests love having the whole place to themselves."
}, {
  id: 'private-room',
  label: 'Private Room',
  sublabel: 'Guests get their own room',
  icon: <DoorClosed size={26} />,
  emoji: '🛏️',
  encouragement: "Perfect! Private rooms are one of our most popular listings."
}, {
  id: 'shared-room',
  label: 'Shared Room',
  sublabel: 'Guests share spaces',
  icon: <Users size={26} />,
  emoji: '🤝',
  encouragement: "Awesome — great for budget travelers and community vibes!"
}, {
  id: 'cottage',
  label: 'Cottage',
  sublabel: 'Traditional rural retreat',
  icon: <Warehouse size={26} />,
  emoji: '🌿',
  encouragement: "Charming! Cottages are beloved for their cozy character."
}, {
  id: 'wooden-cabin',
  label: 'Wooden Cabin',
  sublabel: 'Rustic mountain stay',
  icon: <TreePine size={26} />,
  emoji: '🌲',
  encouragement: "So dreamy! Cabin getaways are always fully booked."
}, {
  id: 'campsite',
  label: 'Campsite',
  sublabel: 'Outdoor nature experience',
  icon: <Tent size={26} />,
  emoji: '⛺',
  encouragement: "Under the stars — adventure seekers will love you for this!"
}, {
  id: 'heritage-stay',
  label: 'Heritage Stay',
  sublabel: 'Historic property',
  icon: <Building2 size={26} />,
  emoji: '🏛️',
  encouragement: "Magnificent! History lovers will be thrilled to stay here."
}, {
  id: 'riverside-stay',
  label: 'Riverside Stay',
  sublabel: 'By the water',
  icon: <Waves size={26} />,
  emoji: '🌊',
  encouragement: "Breathtaking! Waterside stays are everyone's dream escape."
}];

// --- Animated Progress Bar ---

const ProgressBar = ({
  progress
}: {
  progress: number;
}) => {
  return <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-['Inter'] text-[11px] font-normal text-[#8E8E93]">
          Step 1 of 5
        </span>
        <motion.span key={progress} initial={{
        opacity: 0,
        y: 4
      }} animate={{
        opacity: 1,
        y: 0
      }} className="font-['Inter'] text-[11px] font-medium text-[#40916C]">
          {progress}% complete
        </motion.span>
      </div>
      <div className="h-[4px] w-full rounded-full bg-[#F2F2F7] overflow-hidden">
        <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#2D6A4F,#52B788)]" initial={{
        width: '5%'
      }} animate={{
        width: `${progress}%`
      }} transition={{
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }} />
      </div>
    </div>;
};

// --- Header ---

const Header = ({
  progress
}: {
  progress: number;
}) => {
  return <header className="sticky top-0 z-10 w-full bg-white">
      <div className="relative flex h-[56px] items-center justify-center px-4">
        <button className="absolute left-4 p-1 transition-opacity hover:opacity-70" aria-label="Go back">
          <ChevronLeft size={24} color="#1C1C1E" />
        </button>
        <h1 className="font-['Inter'] text-[17px] font-medium text-[#1C1C1E]">
          Become a Host
        </h1>
      </div>
      <ProgressBar progress={progress} />
    </header>;
};

// --- Welcome Character Banner ---

const WelcomeBanner = () => {
  return <motion.div initial={{
    opacity: 0,
    y: -12
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.1,
    ease: 'easeOut'
  }} className="mx-5 mt-2 mb-1 flex items-center gap-3 rounded-[16px] bg-[#F0FAF4] px-4 py-3 border border-[#D1EDDB]">
      <motion.span animate={{
      rotate: [0, -12, 12, -8, 8, 0]
    }} transition={{
      duration: 1.2,
      delay: 0.6,
      ease: 'easeInOut'
    }} className="text-[28px] leading-none select-none" aria-hidden="true"></motion.span>
      <div className="flex flex-col">
        <span className="font-['Inter'] text-[13px] font-semibold text-[#1C1C1E] leading-tight">
          Welcome! Let's list your space.
        </span>
        <span className="font-['Inter'] text-[11.5px] font-normal text-[#52B788] mt-[1px]">
          You're just a few steps away from your first booking ✨
        </span>
      </div>
    </motion.div>;
};

// --- Encouragement Toast ---

const EncouragementBanner = ({
  selectedType
}: {
  selectedType: PropertyType | undefined;
}) => {
  return <AnimatePresence mode="wait">
      {selectedType && <motion.div key={selectedType.id} initial={{
      opacity: 0,
      y: 8,
      scale: 0.96
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: -6,
      scale: 0.96
    }} transition={{
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1]
    }} className="mx-5 mt-4 flex items-start gap-2 rounded-[14px] bg-[#FFF9EC] border border-[#FDDFA0] px-4 py-3">
          <span className="text-[18px] leading-none mt-[1px] select-none" aria-hidden="true">
            {selectedType.emoji}
          </span>
          <span className="font-['Inter'] text-[12.5px] font-normal text-[#7A5C00] leading-snug">
            {selectedType.encouragement}
          </span>
        </motion.div>}
    </AnimatePresence>;
};

// --- Property Card ---

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.38,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};
const PropertyCard = ({
  type,
  isSelected,
  onClick,
  index
}: {
  type: PropertyType;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) => {
  return <motion.button custom={index} variants={cardVariants} initial="hidden" animate="visible" whileTap={{
    scale: 0.95
  }} whileHover={{
    scale: 1.03
  }} onClick={onClick} className="relative flex flex-col items-start rounded-[18px] text-left overflow-hidden" style={{
    padding: '16px 14px',
    border: isSelected ? '2.5px solid #40916C' : '2px solid #E5E5EA',
    background: isSelected ? 'linear-gradient(145deg, #F0FAF4 0%, #E8F5EE 100%)' : '#FAFAFA',
    boxShadow: isSelected ? '0 6px 24px rgba(64,145,108,0.18)' : '0 2px 10px rgba(0,0,0,0.06)',
    transition: 'border 0.2s ease, background 0.2s ease, box-shadow 0.25s ease',
    minHeight: '117px'
  }}>
      {/* Checkmark badge */}
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
        type: 'spring',
        stiffness: 500,
        damping: 20
      }} className="absolute top-2.5 right-2.5 w-[20px] h-[20px] rounded-full bg-[#40916C] flex items-center justify-center">
            <Check size={11} strokeWidth={3} color="white" />
          </motion.div>}
      </AnimatePresence>

      {/* Icon container */}
      <motion.div animate={isSelected ? {
      scale: 1.08,
      rotate: -3
    } : {
      scale: 1,
      rotate: 0
    }} transition={{
      type: 'spring',
      stiffness: 400,
      damping: 18
    }} className="mb-[10px] flex items-center justify-center w-[44px] h-[44px] rounded-[13px]" style={{
      background: isSelected ? '#D1EDDB' : '#F2F2F7',
      color: isSelected ? '#2D6A4F' : '#1C1C1E'
    }}>
        {type.icon}
      </motion.div>

      <div className="flex flex-col">
        <span className="font-['Inter'] text-[13.5px] font-semibold leading-tight" style={{
        color: isSelected ? '#2D6A4F' : '#1C1C1E'
      }}>
          {type.label}
        </span>
        <span className="mt-[2px] font-['Inter'] text-[10.5px] font-normal text-[#8E8E93] leading-tight">
          {type.sublabel}
        </span>
      </div>
    </motion.button>;
};

// --- Footer CTA ---

const Footer = ({
  hasSelection
}: {
  hasSelection: boolean;
}) => {
  return <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-[rgba(0,0,0,0.06)] bg-white px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {hasSelection && <motion.button initial={{
        y: 60,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} exit={{
        y: 40,
        opacity: 0
      }} transition={{
        type: 'spring',
        stiffness: 380,
        damping: 28
      }} className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#2D6A4F,#40916C,#52B788)] hover:opacity-90 active:scale-[0.98] transition-opacity">
            <span className="font-['Inter'] text-[15px] font-medium text-white">
              Next: Location Details →
            </span>
          </motion.button>}
      </AnimatePresence>
      <div className="mt-2 text-center">
        <span className="font-['Inter'] text-[11px] font-normal text-[#8E8E93]">
          Your progress is saved automatically
        </span>
      </div>
    </footer>;
};

// --- Main Component ---

export const BecomeAHostStep1 = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [progress, setProgress] = useState(5);
  useEffect(() => {
    if (selectedTypeId) {
      setProgress(20);
    } else {
      setProgress(5);
    }
  }, [selectedTypeId]);
  const selectedType = PROPERTY_TYPES.find(t => t.id === selectedTypeId);
  return <div className="min-h-screen w-full bg-white pb-[128px]">
      <Header progress={progress} />

      <main>
        <WelcomeBanner />

        <section className="px-5 pt-5 pb-[4px]">
          <motion.h2 initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4,
          delay: 0.2
        }} className="font-['Inter'] text-[22px] font-bold leading-[1.2] tracking-[-0.4px] text-[#1C1C1E]">
            What kind of place are you sharing?
          </motion.h2>
          <motion.p initial={{
          opacity: 0,
          y: 8
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4,
          delay: 0.28
        }} className="mt-1 font-['Inter'] text-[13.5px] font-normal text-[#8E8E93]">
            Don't worry, you can always change this later 😊
          </motion.p>
        </section>

        <EncouragementBanner selectedType={selectedType} />

        <section className="mt-4 grid grid-cols-2 gap-3 px-5">
          {PROPERTY_TYPES.map((type, index) => <PropertyCard key={type.id} type={type} isSelected={selectedTypeId === type.id} onClick={() => setSelectedTypeId(type.id)} index={index} />)}
        </section>
      </main>

      <Footer hasSelection={selectedTypeId !== null} />
    </div>;
};