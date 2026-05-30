import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, LogOut, Settings, CreditCard, ShieldCheck, Moon, UserCog, MessageCircle, Edit2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ConnectedAuthScreen } from '@/components/auth/ConnectedAuthScreen';

const FONT = "'Roboto', -apple-system, sans-serif";
const SETTINGS_LIST = [{
  id: 'account',
  icon: UserCog,
  label: 'Personal Information',
  iconBg: '#EEF2FF',
  iconColor: '#6366F1'
}, {
  id: 'payments',
  icon: CreditCard,
  label: 'Payments and Payouts',
  iconBg: '#F0FDF4',
  iconColor: '#22C55E'
}, {
  id: 'security',
  icon: ShieldCheck,
  label: 'Login & Security',
  iconBg: '#FFF7ED',
  iconColor: '#F97316'
}, {
  id: 'notifications',
  icon: Bell,
  label: 'Notifications',
  iconBg: '#FFF1F2',
  iconColor: '#EF4444'
}, {
  id: 'support',
  icon: MessageCircle,
  label: 'Get Support',
  iconBg: '#F0F9FF',
  iconColor: '#0EA5E9'
}];

// ─── Ripple Hook ────────────────────────────────────────────────────────────
interface RippleState {
  id: number;
  x: number;
  y: number;
}
function useRipple() {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const trigger = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, {
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  }, []);
  return {
    ripples,
    trigger
  };
}

// ─── Setting Item ────────────────────────────────────────────────────────
interface SettingItemProps {
  item: typeof SETTINGS_LIST[0];
  isDark: boolean;
  delay: number;
}
const SettingItem: React.FC<SettingItemProps> = ({
  item,
  isDark,
  delay
}) => {
  const [pressed, setPressed] = useState(false);
  const {
    ripples,
    trigger
  } = useRipple();
  const Icon = item.icon;
  return <motion.div initial={{
    opacity: 0,
    x: -14
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    delay,
    duration: 0.38,
    ease: 'easeOut'
  }}>
      <button onClick={e => trigger(e)} onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)} style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: isDark ? '#1C1C1E' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
        borderRadius: '16px',
        marginBottom: '8px',
        boxShadow: isDark ? '0 1px 8px rgba(0,0,0,0.24)' : '0 1px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        textAlign: 'left',
        overflow: 'hidden',
        position: 'relative',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.12s ease, background 0.15s ease'
      }}>
        {ripples.map(r => <span key={r.id} style={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.06)',
          width: '120px',
          height: '120px',
          top: r.y - 60,
          left: r.x - 60,
          transform: 'scale(0)',
          animation: 'rippleOut 0.6s ease-out forwards',
          pointerEvents: 'none'
        }} />)}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: isDark ? '#2C2C2E' : item.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={18} strokeWidth={1.8} style={{
              color: isDark ? '#FFFFFF' : item.iconColor
            }} />
          </div>
          <span style={{
            fontFamily: FONT,
            fontSize: '15px',
            fontWeight: 400,
            color: isDark ? '#FFFFFF' : '#1C1C1E',
            letterSpacing: '-0.1px'
          }}>
            {item.label}
          </span>
        </div>
        <ChevronRight size={16} strokeWidth={1.5} style={{
          color: '#C7C7CC',
          flexShrink: 0
        }} />
      </button>
    </motion.div>;
};

// ─── Dark Mode Toggle ───────────────────────────────────────────────────────
interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}
const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDark,
  onToggle
}) => {
  const [pressed, setPressed] = useState(false);
  return <motion.div initial={{
    opacity: 0,
    x: -14
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    delay: 0.04,
    duration: 0.38,
    ease: 'easeOut'
  }} style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
    borderRadius: '16px',
    marginBottom: '8px',
    boxShadow: isDark ? '0 1px 8px rgba(0,0,0,0.24)' : '0 1px 8px rgba(0,0,0,0.05)'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        background: isDark ? '#3A3A3C' : '#1C1C1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: '#FFFFFF' }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
      <span style={{
        fontFamily: FONT,
        fontSize: '15px',
        fontWeight: 400,
        color: isDark ? '#FFFFFF' : '#1C1C1E'
      }}>
        Dark Mode
      </span>
    </div>
    <button role="switch" aria-checked={isDark} aria-label="Toggle dark mode" onPointerDown={() => setPressed(true)} onPointerUp={() => {
      setPressed(false);
      onToggle();
    }} onPointerLeave={() => setPressed(false)} style={{
      width: '51px',
      height: '31px',
      borderRadius: '16px',
      background: isDark ? '#34C759' : '#E5E5EA',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      flexShrink: 0,
      outline: 'none',
      position: 'relative',
      transform: pressed ? 'scale(0.88)' : 'scale(1)',
      transition: 'background 0.28s cubic-bezier(0.34,1.56,0.64,1), transform 0.14s ease'
    }}>
      <span style={{
        width: '23px',
        height: '23px',
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 2px 7px rgba(0,0,0,0.22)',
        position: 'absolute',
        top: '4px',
        left: isDark ? 'calc(100% - 27px)' : '4px',
        transition: 'left 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'block'
      }} />
    </button>
  </motion.div>;
};

// ─── Main Screen ────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const { session, user, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const screenBg = isDark ? '#0A0A0A' : '#F6F6F8';
  const primaryText = isDark ? '#FFFFFF' : '#1C1C1E';
  const secondaryText = isDark ? '#636366' : '#8E8E93';
  const headerBg = isDark ? '#111111' : '#FFFFFF';
  const navBg = isDark ? 'rgba(17,17,17,0.92)' : 'rgba(255,255,255,0.95)';
  const navBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const versionColor = isDark ? '#48484A' : '#C7C7CC';

  // If not authenticated, show auth screen
  if (!session || !user) {
    return <ConnectedAuthScreen onAuthenticated={() => window.location.hash = '/profile'} />;
  }

  // Extract user display name from email or user metadata
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const userAvatar = user.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160`;

  const handleLogout = async () => {
    await signOut();
    window.location.hash = '/auth';
  };

  return <div style={{
    minHeight: '100vh',
    background: screenBg,
    paddingBottom: '112px',
    transition: 'background 0.3s ease',
    fontFamily: FONT
  }}>
    <style>{`
      @keyframes rippleOut {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(5); opacity: 0; }
      }
    `}</style>

    {/* ── HEADER ── */}
    <header style={{
      background: headerBg,
      padding: '32px 24px 28px',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#EBEBEB'}`,
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        {/* LEFT: User Info */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            flex: 1,
            display: 'flex',
            gap: '14px',
            alignItems: 'center'
          }}
        >
          {/* Avatar */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
          }}>
            <img
              src={userAvatar}
              alt={`Profile photo of ${userName}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* User Details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: 0,
            flex: 1
          }}>
            <h1 style={{
              fontFamily: FONT,
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              color: primaryText,
              transition: 'color 0.3s ease',
              margin: 0
            }}>
              {userName}
            </h1>
            <p style={{
              fontFamily: FONT,
              fontSize: '13px',
              fontWeight: 400,
              color: secondaryText,
              transition: 'color 0.3s ease',
              margin: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
              {userEmail}
            </p>
          </div>
        </motion.div>

        {/* RIGHT: Edit Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => console.log('Edit profile clicked')}
          aria-label="Edit profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: isDark ? '#1C1C1E' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 500,
            color: primaryText,
            transition: 'background 0.2s ease, border-color 0.2s ease',
            boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.05)',
            flexShrink: 0
          }}
        >
          <Edit2 size={14} strokeWidth={2} />
          <span>Edit</span>
        </motion.button>
      </div>
    </header>

    {/* ── MAIN CONTENT ── */}
    <main style={{
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>

      {/* ── SETTINGS ── */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: FONT,
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: primaryText,
            marginBottom: '16px',
            margin: 0
          }}
        >
          Settings ⚙️
        </motion.h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(p => !p)} />
          {SETTINGS_LIST.map((item, i) => <SettingItem key={item.id} item={item} isDark={isDark} delay={0.06 + i * 0.07} />)}
        </div>
      </section>

      {/* ── LOGOUT ── */}
      <section style={{
        paddingTop: '8px'
      }}>
        <motion.button
          whileTap={{ scale: 0.975 }}
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: '16px',
            background: isDark ? '#1C1C1E' : '#FFF1F2',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(239,68,68,0.14)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: '15px',
            fontWeight: 600,
            color: '#EF4444'
          }}
        >
          <LogOut size={18} strokeWidth={2} style={{
            color: '#EF4444'
          }} />
          <span>Log out</span>
        </motion.button>
        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: '12px',
          color: versionColor,
          margin: 0
        }}>
          SwissChamba Version 2.4.0
        </p>
      </section>
    </main>

    {/* ── BOTTOM NAV ── */}
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: navBg,
      borderTop: `1px solid ${navBorder}`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '8px 24px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 50,
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      {([{
        id: 'explore',
        label: 'Explore'
      }, {
        id: 'search',
        label: 'Search'
      }, {
        id: 'trips',
        label: 'Trips'
      }, {
        id: 'profile',
        label: 'Profile'
      }] as const).map(({
        id,
        label
      }) => {
        const isActive = id === 'profile';
        const iconColor = isActive ? isDark ? '#FFFFFF' : '#1C1C1E' : isDark ? '#636366' : '#8E8E93';
        return <motion.button key={id} whileTap={{
          scale: 0.84
        }} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: iconColor,
          transition: 'color 0.3s ease',
          paddingBottom: '2px'
        }}>
          {id === 'explore' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>}
          {id === 'search' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>}
          {id === 'trips' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>}
          {id === 'profile' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>}
          <span style={{
            fontFamily: FONT,
            fontSize: '10px',
            fontWeight: isActive ? 600 : 400,
            letterSpacing: '0.1px',
            color: iconColor
          }}>
            {label}
          </span>
          {isActive && <span style={{
            display: 'block',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#FF385C',
            marginTop: '1px'
          }} />}
        </motion.button>;
      })}
    </nav>
  </div>;
};
