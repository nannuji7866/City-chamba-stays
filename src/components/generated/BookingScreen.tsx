import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Users, CreditCard, MapPin, Calendar, Wallet, Smartphone, ShieldCheck, Info, Plus, Minus, Check, Loader2 } from 'lucide-react';
const FF = "'Inter', -apple-system, sans-serif";

/* ─── Static Data ─────────────────────────────────────── */
const PROPERTY = {
  name: 'Alpine Woodhouse',
  location: 'Khajjiar Road, Chamba',
  rating: 4.98,
  reviews: 124,
  image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200&auto=format&fit=crop&q=80'
};
const PRICE_ITEMS = [{
  id: 'nights',
  label: '₹5,500 × 3 nights',
  rawValue: 16500
}, {
  id: 'cleaning',
  label: 'Cleaning fee',
  rawValue: 800
}, {
  id: 'service',
  label: 'Service fee',
  rawValue: 1200
}, {
  id: 'taxes',
  label: 'Taxes (GST 5%)',
  rawValue: 925
}];
const TOTAL_RAW = 19425;
const TOTAL_STR = '₹19,425';
const STEPS = [{
  id: 'trip',
  label: 'Trip'
}, {
  id: 'price',
  label: 'Price'
}, {
  id: 'payment',
  label: 'Pay'
}];

/* ─── Sub-components ──────────────────────────────────── */

function ProgressBar({
  currentStep
}: {
  currentStep: number;
}) {
  const pct = (currentStep + 1) / STEPS.length * 100;
  return <div style={{
    marginBottom: '28px'
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }}>
        {STEPS.map((step, idx) => <div key={step.id} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}>
            <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: idx <= currentStep ? '#1C1C1E' : '#E5E5EA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease'
        }}>
              {idx < currentStep ? <Check style={{
            width: 12,
            height: 12,
            color: '#fff'
          }} strokeWidth={3} /> : <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: idx <= currentStep ? '#fff' : '#8E8E93',
            fontFamily: FF
          }}>
                  {idx + 1}
                </span>}
            </div>
            <span style={{
          fontSize: '10px',
          fontWeight: 600,
          color: idx <= currentStep ? '#1C1C1E' : '#8E8E93',
          fontFamily: FF,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease'
        }}>
              {step.label}
            </span>
          </div>)}
      </div>

      <div style={{
      height: '3px',
      background: '#E5E5EA',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
        <motion.div initial={{
        width: '0%'
      }} animate={{
        width: `${pct}%`
      }} transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }} style={{
        height: '100%',
        background: '#1C1C1E',
        borderRadius: '4px'
      }} />
      </div>
    </div>;
}
function FieldCheckmark({
  show
}: {
  show: boolean;
}) {
  return <AnimatePresence>
      {show && <motion.div initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.8
    }} transition={{
      duration: 0.2,
      ease: 'easeOut'
    }} style={{
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }}>
          <Check style={{
        width: 16,
        height: 16,
        color: '#22C55E'
      }} strokeWidth={2.5} />
        </motion.div>}
    </AnimatePresence>;
}
function RollUpNumber({
  target,
  duration = 1.1
}: {
  target: number;
  duration?: number;
}) {
  const [displayed, setDisplayed] = React.useState(0);
  const hasAnimated = React.useRef(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = (Date.now() - start) / (duration * 1000);
          const p = Math.min(elapsed, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplayed(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, {
      threshold: 0.3
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{displayed.toLocaleString('en-IN')}</span>;
}

/* ─── Main Component ──────────────────────────────────── */
export const BookingScreen: React.FC = () => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [cardError, setCardError] = React.useState(false);
  const [expiryError, setExpiryError] = React.useState(false);
  const [cvcError, setCvcError] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [guestCount, setGuestCount] = React.useState(2);
  const [guestDir, setGuestDir] = React.useState<'up' | 'down'>('up');
  const [datesSelected] = React.useState(true);
  const [currentStep] = React.useState(2);
  const cardValid = cardNumber.replace(/\s/g, '').length === 16;
  const expiryValid = expiry.replace(/\s/g, '').length === 5;
  const cvcValid = cvc.length >= 3;
  const allFieldsValid = cardValid && expiryValid && cvcValid;
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + ' / ' + digits.slice(2);
    return digits;
  };
  const handleCardBlur = () => {
    if (cardNumber.length > 0 && !cardValid) setCardError(true);else setCardError(false);
  };
  const handleExpiryBlur = () => {
    if (expiry.length > 0 && !expiryValid) setExpiryError(true);else setExpiryError(false);
  };
  const handleCvcBlur = () => {
    if (cvc.length > 0 && !cvcValid) setCvcError(true);else setCvcError(false);
  };
  const handleGuestChange = (delta: number) => {
    const next = Math.max(1, Math.min(8, guestCount + delta));
    if (next === guestCount) return;
    setGuestDir(delta > 0 ? 'up' : 'down');
    setGuestCount(next);
  };
  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  };

  /* ── Success Screen ─────────────────────────── */
  if (isSuccess) {
    return <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.4,
      ease: 'easeOut'
    }} style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 32px',
      textAlign: 'center',
      fontFamily: FF
    }}>
        <motion.div initial={{
        opacity: 0,
        scale: 0.85
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.35,
        ease: [0.34, 1.2, 0.64, 1],
        delay: 0.1
      }} style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: '#F0FDF4',
        border: '1.5px solid #BBF7D0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
          <Check style={{
          width: 28,
          height: 28,
          color: '#16A34A'
        }} strokeWidth={2.5} />
        </motion.div>

        <motion.h1 initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.22
      }} style={{
        fontSize: '22px',
        fontWeight: 700,
        color: '#1C1C1E',
        marginBottom: '8px',
        fontFamily: FF,
        letterSpacing: '-0.3px'
      }}>
          Booking Confirmed
        </motion.h1>

        <motion.p initial={{
        opacity: 0,
        y: 6
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.32
      }} style={{
        fontSize: '14px',
        color: '#6B7280',
        lineHeight: 1.6,
        maxWidth: '260px',
        marginBottom: '36px',
        fontFamily: FF
      }}>
          <span>Your stay at </span>
          <span style={{
          fontWeight: 600,
          color: '#1C1C1E'
        }}>{PROPERTY.name}</span>
          <span> is confirmed. Check your email for details.</span>
        </motion.p>

        <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.42
      }} style={{
        background: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '32px',
        width: '100%',
        maxWidth: '300px'
      }}>
          {[{
          label: 'Check-in',
          value: 'Jun 14, 2025'
        }, {
          label: 'Check-out',
          value: 'Jun 17, 2025'
        }, {
          label: 'Total paid',
          value: TOTAL_STR,
          highlight: true
        }].map(row => <div key={row.label} style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: row.label === 'Total paid' ? 0 : '10px'
        }}>
              <span style={{
            fontSize: '13px',
            color: '#9CA3AF',
            fontFamily: FF
          }}>{row.label}</span>
              <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: row.highlight ? '#16A34A' : '#1C1C1E',
            fontFamily: FF
          }}>
                {row.value}
              </span>
            </div>)}
        </motion.div>

        <motion.button initial={{
        opacity: 0,
        y: 6
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.52
      }} whileTap={{
        scale: 0.98
      }} onClick={() => setIsSuccess(false)} style={{
        width: '100%',
        maxWidth: '300px',
        background: '#1C1C1E',
        color: '#FFFFFF',
        fontFamily: FF,
        fontSize: '15px',
        fontWeight: 600,
        padding: '15px 24px',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '0.1px'
      }}>
          Back to Explore
        </motion.button>
      </motion.div>;
  }

  /* ── Main Booking Form ──────────────────────── */
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#fff',
    fontFamily: FF
  }}>

      {/* Header */}
      <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: '#fff',
      padding: 'max(env(safe-area-inset-top),16px) 20px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.06)'
    }}>
        <button style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: 'none',
        background: '#F2F2F7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>
          <ChevronLeft style={{
          width: 20,
          height: 20,
          color: '#1C1C1E'
        }} strokeWidth={2} />
        </button>
        <h1 style={{
        fontSize: '17px',
        fontWeight: 700,
        color: '#1C1C1E',
        letterSpacing: '-0.2px',
        fontFamily: FF
      }}>
          Confirm &amp; Pay
        </h1>
        <div style={{
        width: 36
      }} aria-hidden="true" />
      </header>

      {/* Scrollable content */}
      <main style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px 20px 160px'
    }}>

        {/* ── Progress Bar ── */}
        <ProgressBar currentStep={currentStep} />

        {/* ── Section 1: Property Summary ── */}
        <section style={{
        marginBottom: '28px'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid #E5E5EA',
          borderRadius: '16px',
          padding: '14px'
        }}>
            <div style={{
            width: 76,
            height: 76,
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
              <img src={PROPERTY.image} alt={PROPERTY.name} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }} />
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: 0
          }}>
              <p style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#1C1C1E',
              letterSpacing: '-0.2px',
              fontFamily: FF
            }}>
                {PROPERTY.name}
              </p>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
                <MapPin style={{
                width: 11,
                height: 11,
                color: '#8E8E93',
                flexShrink: 0
              }} strokeWidth={1.5} />
                <span style={{
                fontSize: '12px',
                color: '#8E8E93',
                fontFamily: FF
              }}>{PROPERTY.location}</span>
              </div>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
                <Star style={{
                width: 11,
                height: 11,
                color: '#F59E0B',
                fill: '#F59E0B'
              }} />
                <span style={{
                fontSize: '12px',
                color: '#8E8E93',
                fontFamily: FF
              }}>{PROPERTY.rating}</span>
                <span style={{
                fontSize: '12px',
                color: '#8E8E93',
                fontFamily: FF
              }}>· {PROPERTY.reviews} reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Your Trip ── */}
        <section style={{
        marginBottom: '28px'
      }}>
          <p style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1C1C1E',
          marginBottom: '14px',
          fontFamily: FF
        }}>
            Your Trip
          </p>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>

            {/* Check-in */}
            <motion.div whileTap={{
            scale: 0.97
          }} transition={{
            duration: 0.15,
            ease: 'easeInOut'
          }} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: datesSelected ? '#F0FDF4' : '#F8F8F8',
            border: datesSelected ? '1.5px solid #BBF7D0' : '1.5px solid #E5E5EA',
            borderRadius: '12px',
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'background 0.2s ease, border-color 0.2s ease'
          }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                <Calendar style={{
                width: 15,
                height: 15,
                color: datesSelected ? '#16A34A' : '#8E8E93'
              }} strokeWidth={2} />
                <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: datesSelected ? '#16A34A' : '#8E8E93',
                fontFamily: FF
              }}>
                  CHECK-IN
                </span>
              </div>
              <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1C1C1E',
              fontFamily: FF
            }}>Jun 14, 2025</span>
            </motion.div>

            {/* Check-out */}
            <motion.div whileTap={{
            scale: 0.97
          }} transition={{
            duration: 0.15,
            ease: 'easeInOut'
          }} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: datesSelected ? '#F0FDF4' : '#F8F8F8',
            border: datesSelected ? '1.5px solid #BBF7D0' : '1.5px solid #E5E5EA',
            borderRadius: '12px',
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'background 0.2s ease, border-color 0.2s ease'
          }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                <Calendar style={{
                width: 15,
                height: 15,
                color: datesSelected ? '#16A34A' : '#8E8E93'
              }} strokeWidth={2} />
                <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: datesSelected ? '#16A34A' : '#8E8E93',
                fontFamily: FF
              }}>
                  CHECK-OUT
                </span>
              </div>
              <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1C1C1E',
              fontFamily: FF
            }}>Jun 17, 2025</span>
            </motion.div>

            {/* Guests */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8F9FA',
            border: '1.5px solid #E5E5EA',
            borderRadius: '12px',
            padding: '12px 16px'
          }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                <Users style={{
                width: 15,
                height: 15,
                color: '#8E8E93'
              }} strokeWidth={2} />
                <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#8E8E93',
                fontFamily: FF
              }}>
                  GUESTS
                </span>
              </div>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
                <motion.button whileTap={{
                scale: 0.92
              }} transition={{
                duration: 0.12,
                ease: 'easeInOut'
              }} onClick={() => handleGuestChange(-1)} disabled={guestCount <= 1} style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1.5px solid #D1D5DB',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: guestCount <= 1 ? 'not-allowed' : 'pointer',
                opacity: guestCount <= 1 ? 0.35 : 1
              }}>
                  <Minus style={{
                  width: 14,
                  height: 14,
                  color: '#3A3A3C'
                }} strokeWidth={2.5} />
                </motion.button>

                <div style={{
                width: 24,
                textAlign: 'center',
                overflow: 'hidden',
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                  <AnimatePresence mode="wait">
                    <motion.span key={guestCount} initial={{
                    y: guestDir === 'up' ? 14 : -14,
                    opacity: 0
                  }} animate={{
                    y: 0,
                    opacity: 1
                  }} exit={{
                    y: guestDir === 'up' ? -14 : 14,
                    opacity: 0
                  }} transition={{
                    duration: 0.18,
                    ease: 'easeInOut'
                  }} style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1C1C1E',
                    fontFamily: FF
                  }}>
                      {guestCount}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <motion.button whileTap={{
                scale: 0.92
              }} transition={{
                duration: 0.12,
                ease: 'easeInOut'
              }} onClick={() => handleGuestChange(1)} disabled={guestCount >= 8} style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1.5px solid #1C1C1E',
                background: '#1C1C1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: guestCount >= 8 ? 'not-allowed' : 'pointer',
                opacity: guestCount >= 8 ? 0.35 : 1
              }}>
                  <Plus style={{
                  width: 14,
                  height: 14,
                  color: '#fff'
                }} strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Price Details ── */}
        <section style={{
        marginBottom: '28px'
      }}>
          <p style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1C1C1E',
          marginBottom: '14px',
          fontFamily: FF
        }}>
            Price Details
          </p>
          <div style={{
          border: '1px solid #E5E5EA',
          borderRadius: '14px',
          padding: '16px',
          background: '#FAFAFA'
        }}>
            {PRICE_ITEMS.map(item => <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0'
          }}>
                <span style={{
              fontSize: '14px',
              color: '#3A3A3C',
              fontFamily: FF
            }}>{item.label}</span>
                <span style={{
              fontSize: '14px',
              color: '#3A3A3C',
              fontFamily: FF
            }}>
                  <span>₹</span>
                  <RollUpNumber target={item.rawValue} duration={0.9} />
                </span>
              </div>)}
            <div style={{
            height: '1px',
            background: '#E5E5EA',
            margin: '10px 0 10px'
          }} />
            <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
              <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#1C1C1E',
              fontFamily: FF
            }}>Total</span>
              <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#1C1C1E',
              fontFamily: FF
            }}>
                <span>₹</span>
                <RollUpNumber target={TOTAL_RAW} duration={1.1} />
              </span>
            </div>
          </div>
        </section>

        {/* ── Section 4: Payment ── */}
        <section style={{
        marginBottom: '28px'
      }}>
          <p style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1C1C1E',
          marginBottom: '14px',
          fontFamily: FF
        }}>
            Payment
          </p>

          {/* Alt payment buttons */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '16px'
        }}>
            <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#000',
            borderRadius: '12px',
            height: '48px',
            width: '100%',
            border: 'none',
            cursor: 'pointer'
          }}>
              <Smartphone style={{
              width: 16,
              height: 16,
              color: '#fff'
            }} strokeWidth={1.5} />
              <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              fontFamily: FF
            }}>Pay</span>
            </button>
            <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#fff',
            borderRadius: '12px',
            height: '48px',
            width: '100%',
            border: '1px solid #D1D5DB',
            cursor: 'pointer'
          }}>
              <Wallet style={{
              width: 16,
              height: 16,
              color: '#1C1C1E'
            }} strokeWidth={1.5} />
              <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1C1C1E',
              fontFamily: FF
            }}>Google Pay</span>
            </button>
          </div>

          {/* Separator */}
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
            <div style={{
            flex: 1,
            height: 1,
            background: '#E5E5EA'
          }} />
            <span style={{
            fontSize: '12px',
            color: '#9CA3AF',
            fontFamily: FF,
            whiteSpace: 'nowrap'
          }}>
              or pay with card
            </span>
            <div style={{
            flex: 1,
            height: 1,
            background: '#E5E5EA'
          }} />
          </div>

          {/* Card inputs */}
          <div style={{
          border: `1.5px solid ${allFieldsValid ? '#BBF7D0' : cardError || expiryError || cvcError ? '#FCA5A5' : '#E5E5EA'}`,
          borderRadius: '14px',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease',
          background: allFieldsValid ? '#F0FDF4' : '#fff'
        }}>
            {/* Card Number row */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            borderBottom: '1px solid #F0F0F0',
            background: cardError ? 'rgba(254,226,226,0.4)' : 'transparent',
            transition: 'background 0.2s ease'
          }}>
              <CreditCard style={{
              width: 16,
              height: 16,
              color: cardValid ? '#16A34A' : '#8E8E93',
              flexShrink: 0,
              transition: 'color 0.25s ease'
            }} strokeWidth={1.5} />
              <input type="text" inputMode="numeric" placeholder="1234 1234 1234 1234" value={cardNumber} onChange={e => {
              setCardNumber(formatCardNumber(e.target.value));
              setCardError(false);
            }} onBlur={handleCardBlur} maxLength={19} style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1C1C1E',
              background: 'transparent',
              fontFamily: FF,
              letterSpacing: cardNumber ? '0.05em' : '0'
            }} className="placeholder:text-[#C4C4C4]" />
              <FieldCheckmark show={cardValid} />
            </div>

            {/* Expiry + CVC row */}
            <div style={{
            display: 'flex',
            alignItems: 'stretch'
          }}>
              <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 16px',
              background: expiryError ? 'rgba(254,226,226,0.4)' : 'transparent',
              transition: 'background 0.2s ease'
            }}>
                <input type="text" inputMode="numeric" placeholder="MM / YY" value={expiry} onChange={e => {
                setExpiry(formatExpiry(e.target.value));
                setExpiryError(false);
              }} onBlur={handleExpiryBlur} maxLength={7} style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1C1C1E',
                background: 'transparent',
                fontFamily: FF
              }} className="placeholder:text-[#C4C4C4]" />
                <FieldCheckmark show={expiryValid} />
              </div>
              <div style={{
              width: 1,
              background: '#F0F0F0'
            }} />
              <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 16px',
              background: cvcError ? 'rgba(254,226,226,0.4)' : 'transparent',
              transition: 'background 0.2s ease'
            }}>
                <input type="text" inputMode="numeric" placeholder="CVC" value={cvc} onChange={e => {
                setCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
                setCvcError(false);
              }} onBlur={handleCvcBlur} maxLength={4} style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1C1C1E',
                background: 'transparent',
                fontFamily: FF
              }} className="placeholder:text-[#C4C4C4]" />
                <FieldCheckmark show={cvcValid} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Policy ── */}
        <section style={{
        marginBottom: '28px'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '6px'
        }}>
            <ShieldCheck style={{
            width: 14,
            height: 14,
            color: '#16A34A',
            flexShrink: 0,
            marginTop: '2px'
          }} strokeWidth={2} />
            <p style={{
            fontSize: '13px',
            color: '#3A3A3C',
            lineHeight: 1.6,
            fontFamily: FF
          }}>
              <span>Free cancellation before Jun 13, 2025.</span>
            </p>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
            <Info style={{
            width: 13,
            height: 13,
            color: '#9CA3AF',
            flexShrink: 0,
            marginTop: '3px'
          }} strokeWidth={1.5} />
            <p style={{
            fontSize: '13px',
            color: '#3A3A3C',
            lineHeight: 1.6,
            fontFamily: FF
          }}>
              <span>Review the host&apos;s </span>
              <a href="#" style={{
              color: '#FF385C',
              textDecoration: 'underline',
              fontFamily: FF
            }} onClick={e => e.preventDefault()}>
                full cancellation policy
              </a>
              <span>.</span>
            </p>
          </div>
        </section>

      </main>

      {/* ── Fixed CTA Footer ── */}
      <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,0,0,0.07)',
      padding: '16px 20px',
      paddingBottom: 'max(env(safe-area-inset-bottom),16px)'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
            <span style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#1C1C1E',
            letterSpacing: '-0.4px',
            lineHeight: 1.2,
            fontFamily: FF
          }}>
              {TOTAL_STR}
            </span>
            <span style={{
            fontSize: '11px',
            color: '#9CA3AF',
            marginTop: '2px',
            fontFamily: FF
          }}>
              Total with taxes
            </span>
          </div>

          <AnimatePresence mode="wait">
            {isProcessing ? <motion.div key="processing" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.15
          }} style={{
            height: 50,
            padding: '0 28px',
            borderRadius: '14px',
            background: '#1C1C1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: 136
          }}>
                <Loader2 style={{
              width: 16,
              height: 16,
              color: 'rgba(255,255,255,0.7)',
              animation: 'spin 0.8s linear infinite'
            }} strokeWidth={2} />
                <span style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: FF
            }}>Processing…</span>
              </motion.div> : <motion.button key="idle" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} whileTap={{
            scale: 0.98
          }} transition={{
            duration: 0.15
          }} onClick={handleConfirm} style={{
            background: '#1C1C1E',
            color: '#fff',
            fontFamily: FF,
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '14px',
            height: 50,
            padding: '0 28px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.1px',
            whiteSpace: 'nowrap'
          }}>
                Confirm &amp; Pay
              </motion.button>}
          </AnimatePresence>
        </div>
      </footer>
    </div>;
};