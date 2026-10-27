import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ShoppingCart, 
  Sprout, 
  Tractor, 
  Menu, 
  X, 
  Wrench, 
  Shield, 
  Radio, 
  Users, 
  Package, 
  Briefcase, 
  Truck, 
  ClipboardList, 
  MessageSquare, 
  Sparkles,
  Database,
  ChevronRight
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
  setIsSupabaseModalOpen,
  unreadNotificationCount = 0,
  onOpenNotifications,
  onOpenVoiceAssistant,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close mobile drawer on Escape key or window resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 900 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems: { view: AppView; label: string; badge?: string }[] = [
    { view: 'marketplace', label: 'Shop' },
    { view: 'services', label: 'Services', badge: 'NEW' },
    { view: 'demand_radar', label: 'Discover' },
    { view: 'farms', label: 'Connect' },
  ];

  const handleMobileNav = (view: AppView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <nav className="glass-nav reference-nav">
        <div className="container reference-nav-row">
          
          {/* Brand Logo */}
          <button className="reference-brand" type="button" onClick={() => setActiveView('marketplace')}>
            <span className="reference-brand-mark"><Sprout size={20} /></span>
            <span className="reference-brand-name">AgriFlow</span>
            <span className="reference-brand-tag">Direct</span>
          </button>

          {/* Desktop Primary Nav Links */}
          <div className="reference-nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button
                key={item.view}
                type="button"
                className={activeView === item.view ? 'is-active' : ''}
                onClick={() => setActiveView(item.view)}
                style={{ position: 'relative' }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                    lineHeight: 1.2
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Admin Link for Desktop */}
            <button
              type="button"
              className={activeView === 'admin_dashboard' ? 'is-active' : ''}
              onClick={() => setActiveView('admin_dashboard')}
              title="Admin Panel"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Shield size={14} color={activeView === 'admin_dashboard' ? 'var(--primary-600)' : 'currentColor'} />
              <span>Admin</span>
            </button>
          </div>

          {/* Right Tools Bar */}
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

            {/* Farmer Portal button on desktop */}
            <button className="reference-farmer-button" type="button" onClick={() => setActiveView('farmer_portal')}>
              <Tractor size={15} />
              <span>Farmer Portal</span>
            </button>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              className="reference-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              style={{
                display: 'none', // Controlled via media query in CSS, fallback inline below
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isMobileMenuOpen ? 'var(--primary-100)' : 'var(--bg-subtle)',
                color: 'var(--primary-950)',
                border: '1px solid var(--border-color)',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '4px'
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SLIDE-OUT NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 27, 17, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-start',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              borderRight: '1px solid var(--border-color)'
            }}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--primary-950)',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sprout size={18} color="#ffffff" />
                </span>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    AgriFlow Direct
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 600 }}>
                    Navigation Menu
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Search */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="search"
                  placeholder="Search produce & services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    backgroundColor: 'var(--bg-page)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Navigation Sections */}
            <div style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* SECTION 1: MARKETPLACE & SERVICES */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 8px 6px' }}>
                  Marketplace & Services
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleMobileNav('marketplace')}
                    style={getMobileNavItemStyle(activeView === 'marketplace')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sprout size={17} color={activeView === 'marketplace' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'marketplace' ? 800 : 600 }}>Produce Marketplace</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('services')}
                    style={getMobileNavItemStyle(activeView === 'services')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Wrench size={17} color={activeView === 'services' ? 'var(--primary-700)' : 'var(--primary-600)'} />
                      <span style={{ fontWeight: activeView === 'services' ? 800 : 700, color: 'var(--primary-900)' }}>
                        Service Booking Hub
                      </span>
                    </span>
                    <span style={{
                      backgroundColor: 'var(--primary-600)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      NEW
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('demand_radar')}
                    style={getMobileNavItemStyle(activeView === 'demand_radar')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Radio size={17} color={activeView === 'demand_radar' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'demand_radar' ? 800 : 600 }}>Demand Radar & RFQs</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('farms')}
                    style={getMobileNavItemStyle(activeView === 'farms')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Users size={17} color={activeView === 'farms' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'farms' ? 800 : 600 }}>Verified Family Farms</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('csa_boxes')}
                    style={getMobileNavItemStyle(activeView === 'csa_boxes')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Package size={17} color={activeView === 'csa_boxes' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'csa_boxes' ? 800 : 600 }}>Weekly CSA Subscriptions</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('wholesale_hub')}
                    style={getMobileNavItemStyle(activeView === 'wholesale_hub')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Briefcase size={17} color={activeView === 'wholesale_hub' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'wholesale_hub' ? 800 : 600 }}>Commercial Wholesale B2B</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>
                </div>
              </div>

              {/* SECTION 2: LOGISTICS & ORDERS */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 8px 6px' }}>
                  Logistics & Orders
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleMobileNav('logistics')}
                    style={getMobileNavItemStyle(activeView === 'logistics')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Truck size={17} color={activeView === 'logistics' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'logistics' ? 800 : 600 }}>Cold-Chain IoT Hubs</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('orders')}
                    style={getMobileNavItemStyle(activeView === 'orders')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ClipboardList size={17} color={activeView === 'orders' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'orders' ? 800 : 600 }}>Live Dispatch Tracker</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('impact')}
                    style={getMobileNavItemStyle(activeView === 'impact')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sprout size={17} color={activeView === 'impact' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'impact' ? 800 : 600 }}>Soil Health & Impact</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>
                </div>
              </div>

              {/* SECTION 3: FARMER COMMAND & MESSAGING */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 8px 6px' }}>
                  Producer Rails
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleMobileNav('farmer_portal')}
                    style={getMobileNavItemStyle(activeView === 'farmer_portal')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Tractor size={17} color={activeView === 'farmer_portal' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'farmer_portal' ? 800 : 700, color: 'var(--primary-900)' }}>Farmer Command Portal</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('onboarding')}
                    style={getMobileNavItemStyle(activeView === 'onboarding')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sprout size={17} color={activeView === 'onboarding' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'onboarding' ? 800 : 600 }}>Sell on AgriFlow</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNav('live_chat')}
                    style={getMobileNavItemStyle(activeView === 'live_chat')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MessageSquare size={17} color={activeView === 'live_chat' ? 'var(--primary-700)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: activeView === 'live_chat' ? 800 : 600 }}>Live Chat & Inquiries</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>
                </div>
              </div>

              {/* SECTION 4: ADMINISTRATION & SYSTEM */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 8px 6px' }}>
                  System Administration
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleMobileNav('admin_dashboard')}
                    style={{
                      ...getMobileNavItemStyle(activeView === 'admin_dashboard'),
                      backgroundColor: activeView === 'admin_dashboard' ? '#fee2e2' : 'var(--bg-subtle)',
                      border: '1px solid #fecaca'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Shield size={17} color="#dc2626" />
                      <span style={{ fontWeight: 800, color: '#991b1b' }}>Admin Panel</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b91c1c' }}>Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSupabaseModalOpen(true);
                    }}
                    style={getMobileNavItemStyle(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Database size={17} color="var(--text-muted)" />
                      <span style={{ fontWeight: 600 }}>Database Config</span>
                    </span>
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Bottom Quick Action Bar */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-page)',
              display: 'flex',
              gap: '10px'
            }}>
              {onOpenVoiceAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenVoiceAssistant();
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    backgroundColor: 'var(--primary-800)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={15} color="#86efac" />
                  <span>AI Copilot</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  backgroundColor: '#ffffff',
                  color: 'var(--primary-950)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ShoppingCart size={15} />
                <span>Cart ({cartTotalCount})</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

function getMobileNavItemStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    backgroundColor: isActive ? 'var(--primary-100)' : 'transparent',
    color: isActive ? 'var(--primary-900)' : 'var(--text-main)',
    textAlign: 'left',
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  };
}
