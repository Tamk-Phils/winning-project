import React from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';
import type { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onOpenFarmerPortal: () => void;
  onOpenRFQ: () => void;
  onOpenSupabase: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenFarmerPortal,
  onOpenRFQ,
  onOpenSupabase: _onOpenSupabase,
}) => {
  return (
    <footer style={{ backgroundColor: 'var(--primary-950)', color: '#ffffff', paddingTop: '64px', paddingBottom: '40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container">
        
        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '56px' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={22} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                AgriFlow
              </span>
            </div>
            
            <p style={{ color: '#a7f3d0', opacity: 0.85, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              The modern farm-to-market agricultural exchange. Empowering regenerative farmers with direct market access, unbroken cold-chain logistics, and fair wholesale economics.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#6ee7b7' }}>
              <ShieldCheck size={16} />
              <span>Certified Sustainable Agribusiness Network</span>
            </div>
          </div>

          {/* Sourcing & Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px' }}>
              Produce & Subscriptions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#a7f3d0' }}>
              <li>
                <button onClick={() => onNavigate('marketplace')} style={{ color: '#a7f3d0', cursor: 'pointer', textAlign: 'left' }}>
                  Heirloom Vegetables & Roots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} style={{ color: '#a7f3d0', cursor: 'pointer', textAlign: 'left' }}>
                  High-Brix Orchard Berries & Fruit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('csa_boxes')} style={{ color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Weekly CSA Farm Bounty Subscriptions</span>
                  <ArrowUpRight size={13} color="#34d399" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wholesale_hub')} style={{ color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Commercial Wholesale B2B Portal</span>
                  <ArrowUpRight size={13} color="#34d399" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('farms')} style={{ color: '#a7f3d0', cursor: 'pointer', textAlign: 'left' }}>
                  Verified Family Farm Profiles
                </button>
              </li>
            </ul>
          </div>

          {/* Agribusiness Rails */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px' }}>
              Agribusiness Rails
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#a7f3d0' }}>
              <li>
                <button onClick={onOpenFarmerPortal} style={{ color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Farmer Command Hub</span>
                  <ArrowUpRight size={13} />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Agricultural Services Hub</span>
                  <ArrowUpRight size={13} color="#34d399" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('onboarding')} style={{ color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Sell on AgriFlow</span>
                  <ArrowUpRight size={13} />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} style={{ color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Track Dispatches & Escrow</span>
                  <ArrowUpRight size={13} />
                </button>
              </li>
              <li>
                <button onClick={onOpenRFQ} style={{ color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <span>Submit Wholesale RFQ</span>
                  <ArrowUpRight size={13} />
                </button>
              </li>
            </ul>
          </div>

          {/* Regional Agro-Clearing Hub */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px' }}>
              Agro-Clearing Hub
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: '#a7f3d0' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="#34d399" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>Highland Agro-Terminal, Foumbot Basin, West Region, Cameroon</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="#34d399" style={{ flexShrink: 0 }} />
                <span>+237 670 00 12 34</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="#34d399" style={{ flexShrink: 0 }} />
                <span>support@agriflow-cameroon.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          paddingTop: '28px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: '#a7f3d0',
          opacity: 0.75
        }}>
          <div>
            © 2026 AgriFlow Agribusiness Platform. Built with React, TypeScript, Vite & Supabase.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Soil Traceability Guaranteed</span>
            <span>•</span>
            <span>Unbroken Cold Chain</span>
            <span>•</span>
            <span>88.6% Farmer Payout Audited</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
