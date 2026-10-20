import React from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  Tractor, 
  Store, 
  Database, 
  MapPin, 
  FileSpreadsheet, 
  Search,
  Package,
  Building2,
  ThermometerSnowflake,
  Radio,
  Globe
} from 'lucide-react';
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
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cart,
  setIsCartOpen,
  selectedRegion,
  setSelectedRegion,
  searchQuery,
  setSearchQuery,
  supabaseConfig,
  setIsSupabaseModalOpen,
  setIsRFQModalOpen,
}) => {
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'marketplace', label: 'Produce Catalog', icon: <Store size={15} /> },
    { view: 'csa_boxes', label: 'CSA Bounty Boxes', icon: <Package size={15} /> },
    { view: 'wholesale_hub', label: 'Wholesale B2B', icon: <Building2 size={15} /> },
    { view: 'farms', label: 'Verified Farms', icon: <Sprout size={15} /> },
    { view: 'logistics', label: 'Cold-Chain Hubs', icon: <ThermometerSnowflake size={15} /> },
    { view: 'orders', label: 'Live Tracker', icon: <Radio size={15} /> },
    { view: 'impact', label: 'Soil Impact', icon: <Globe size={15} /> },
  ];

  return (
    <header className="sticky-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Banner: Real-Time Transparency Ticker */}
      <div className="navbar-ticker" style={{
        backgroundColor: 'var(--primary-950)', 
        color: '#d1fae5', 
        fontSize: '0.8rem', 
        padding: '6px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="navbar-ticker-track">
          <div className="navbar-ticker-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot"></span>
            <span>
              <strong>Today's Live Agribusiness Stream:</strong> 18,420 kg fresh produce moved • <strong>88.6% direct farmer payout</strong> • Average 11h from soil to cold-hub
            </span>
          </div>

          <div className="navbar-ticker-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: supabaseConfig.isConnected ? '#34d399' : '#fbbf24',
                cursor: 'pointer',
                fontSize: '0.78rem'
              }}
            >
              <Database size={13} />
              <span>{supabaseConfig.isConnected ? 'Supabase: Live Connected' : 'Supabase: Offline Mode (Click to Connect)'}</span>
            </button>
            <span style={{ opacity: 0.4 }}>|</span>
            <button
              onClick={() => setIsRFQModalOpen(true)}
              style={{ color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FileSpreadsheet size={13} />
              <span>Wholesale RFQ</span>
            </button>
            <span style={{ opacity: 0.4 }}>|</span>
            <button
              onClick={() => setActiveView('onboarding')}
              style={{ color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <Tractor size={13} />
              <span>Sell on AgriFlow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-nav" style={{ padding: '12px 0' }}>
        <div className="container navbar-main-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveView('marketplace')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-900) 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15, 70, 44, 0.25)',
              color: '#ffffff'
            }}>
              <Sprout size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 800, 
                  fontSize: '1.35rem', 
                  letterSpacing: '-0.02em', 
                  color: 'var(--primary-950)' 
                }}>
                  AgriFlow
                </span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  background: 'var(--primary-100)', 
                  color: 'var(--primary-800)', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  Direct
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
                Farm-to-Market Exchange
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="navbar-search" style={{ flex: 1, maxWidth: '340px', position: 'relative' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} 
            />
            <input 
              type="text"
              placeholder="Search produce, cultivar, or farm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ 
                paddingLeft: '38px', 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-full)',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Sourcing Region Selector */}
          <div className="navbar-region" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <MapPin size={15} color="var(--primary-600)" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--border-color)', 
                padding: '6px 10px', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="all">All Sourcing Regions</option>
              <option value="Pacific West">Pacific West (Cascadia)</option>
              <option value="California Central Valley">California Valley</option>
              <option value="Midwest Prairies">Midwest Prairies</option>
              <option value="Sunbelt South">Sunbelt Blue Ridge</option>
            </select>
          </div>

          {/* Quick Action CTA & Cart */}
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Farmer Command Hub */}
            <button
              onClick={() => setActiveView('farmer_portal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                transition: 'all var(--trans-fast)',
                backgroundColor: activeView === 'farmer_portal' ? 'var(--primary-900)' : 'var(--bg-subtle)',
                color: activeView === 'farmer_portal' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <Tractor size={15} color={activeView === 'farmer_portal' ? '#ffffff' : 'var(--primary-700)'} />
              <span>Farmer Portal</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-secondary"
              style={{ position: 'relative', padding: '9px 14px' }}
              aria-label="View Cart"
            >
              <ShoppingCart size={18} color="var(--primary-700)" />
              {cartTotalCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-6px', 
                  right: '-6px', 
                  background: 'var(--earth-500)', 
                  color: '#ffffff', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.4)'
                }}>
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Secondary Sub-Navigation Links Row */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '10px', paddingTop: '8px' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {navLinks.map((link) => {
              const isCurrent = activeView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => setActiveView(link.view)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 700 : 500,
                    backgroundColor: isCurrent ? 'var(--primary-100)' : 'transparent',
                    color: isCurrent ? 'var(--primary-900)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--trans-fast)'
                  }}
                >
                  <span style={{ color: isCurrent ? 'var(--primary-700)' : 'inherit' }}>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </nav>
    </header>
  );
};
