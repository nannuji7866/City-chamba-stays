import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
const FONT = "'Roboto', -apple-system, sans-serif";
interface SearchHeaderProps {
  placeholder?: string;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  className?: string;
}
export const SearchHeader: React.FC<SearchHeaderProps> = ({
  placeholder = 'Search Chamba stays',
  onSearchClick,
  onFilterClick,
  className = ''
}) => {
  return <div className={`px-4 py-3 sticky top-0 bg-white z-40 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Search bar: bg #F2F2F7, border-radius 14px, height 48px, inset shadow */}
        <button onClick={onSearchClick} className="flex-1 flex items-center gap-3 text-left transition-all active:scale-[0.98]" style={{
        background: '#F2F2F7',
        borderRadius: '14px',
        height: '48px',
        border: 'none',
        paddingLeft: '14px',
        paddingRight: '14px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.07)'
      }}>
          <Search size={16} strokeWidth={1.5} style={{
          color: '#8E8E93',
          flexShrink: 0
        }} />
          <div className="flex flex-col min-w-0">
            <span style={{
            fontFamily: FONT,
            fontWeight: 500,
            letterSpacing: '-0.1px',
            color: '#1C1C1E',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: "16px",
            lineHeight: "0.98"
          }}>
              Search Results
            </span>
            <span style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: 1.5,
            letterSpacing: '0px',
            color: '#8E8E93',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
              {placeholder}
            </span>
          </div>
        </button>

        {/* Filter button: dark bg, white icon, shadow */}
        <button onClick={onFilterClick} className="flex items-center justify-center transition-all active:scale-[0.98]" aria-label="Filter" style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: '#1C1C1E',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: '0 3px 12px rgba(0,0,0,0.18)'
      }}>
          <SlidersHorizontal size={18} strokeWidth={1.5} style={{
          color: '#FFFFFF'
        }} />
        </button>
      </div>
    </div>;
};