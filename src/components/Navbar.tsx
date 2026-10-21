import React from 'react';
import { Bell, Search, ShoppingCart, Sprout, Tractor } from 'lucide-react';
import type { CartItem, AppView } from '../types';
import type { SupabaseConfig } from '../lib/supabase';

interface NavbarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  supabaseConfig: SupabaseConfig;
  setIsSupabaseModalOpen: (open: boolean) => void;
  setIsRFQModalOpen: (open: boolean) => void;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenPrivacyModal?: () => void;
  chatUnreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cart,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  unreadNotificationCount = 0,
  onOpenNotifications,
}) => {
  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const navItems: { view: AppView; label: string }[] = [
    { view: 'marketplace', label: 'Shop' },
    { view: 'demand_radar', label: 'Discover' },
    { view: 'farms', label: 'Connect' },
  ];

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <nav className="glass-nav reference-nav">
        <div className="container reference-nav-row">
          <button className="reference-brand" type="button" onClick={() => setActiveView('marketplace')}>
            <span className="reference-brand-mark"><Sprout size={20} /></span>
            <span className="reference-brand-name">AgriFlow</span>
            <span className="reference-brand-tag">Direct</span>
          </button>

          <div className="reference-nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button
                key={item.view}
                type="button"
                className={activeView === item.view ? 'is-active' : ''}
                onClick={() => setActiveView(item.view)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="reference-nav-tools">
            <label className="reference-search" aria-label="Search produce">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            {onOpenNotifications && (
              <button className="reference-icon-button" type="button" onClick={onOpenNotifications} aria-label="Notifications">
                <Bell size={17} />
                {unreadNotificationCount > 0 && <span className="reference-count">{unreadNotificationCount}</span>}
              </button>
            )}
            <button className="reference-icon-button" type="button" onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <ShoppingCart size={18} />
              {cartTotalCount > 0 && <span className="reference-count">{cartTotalCount}</span>}
            </button>
            <button className="reference-farmer-button" type="button" onClick={() => setActiveView('farmer_portal')}>
              <Tractor size={15} />
              <span>Farmer Portal</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
