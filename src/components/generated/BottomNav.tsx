import React from 'react';
import { Map, Search, MapPin, User } from 'lucide-react';
const ROBOTO = "'Roboto', -apple-system, sans-serif";
interface BottomNavProps {
  activeTab?: 'explore' | 'search' | 'trips' | 'profile';
  onTabChange?: (tab: 'explore' | 'search' | 'trips' | 'profile') => void;
}
const NAV_TABS = [{
  id: 'explore' as const,
  label: 'Explore',
  icon: Map
}, {
  id: 'search' as const,
  label: 'Search',
  icon: Search
}, {
  id: 'trips' as const,
  label: 'Discover',
  icon: MapPin
}, {
  id: 'profile' as const,
  label: 'Profile',
  icon: User
}];
export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = 'explore',
  onTabChange
}) => {
  return <nav style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(0,0,0,0.07)',
    height: '72px',
    paddingBottom: 'env(safe-area-inset-bottom)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
    zIndex: 50
  }}>
      {NAV_TABS.map(({
      id,
      label,
      icon: Icon
    }) => {
      const isActive = activeTab === id;
      return <button key={id} onClick={() => onTabChange?.(id)} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 16px',
        position: 'relative'
      }}>
            <Icon size={22} strokeWidth={1.5} style={{
          color: isActive ? '#1C1C1E' : '#8E8E93',
          transition: 'color 0.2s ease'
        }} />
            <span style={{
          fontFamily: ROBOTO,
          fontSize: '10px',
          fontWeight: isActive ? 500 : 400,
          color: isActive ? '#1C1C1E' : '#8E8E93',
          lineHeight: 1.4,
          letterSpacing: '0.1px',
          transition: 'color 0.2s ease'
        }}>
              {label}
            </span>
            {isActive && <div style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#FF385C',
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)'
        }} aria-hidden="true" />}
          </button>;
    })}
    </nav>;
};