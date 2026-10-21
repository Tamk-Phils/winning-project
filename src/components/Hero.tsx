import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Percent, 
  Clock, 
  Package
} from 'lucide-react';
import type { ProductCategory } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onPostRFQClick: () => void;
  onCategorySelect: (cat: ProductCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onPostRFQClick,
  onCategorySelect,
}) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--primary-950)', color: '#ffffff' }}>
      
      {/* Cameroon farm video with a restrained contrast overlay. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=85"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.35,
          filter: 'saturate(1.15)'
        }}
      >
        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
      </video>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(5,27,17,0.52), rgba(5,27,17,0.82))'
      }} />

      {/* Atmospheric Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(34, 160, 102, 0.25) 0%, rgba(5, 27, 17, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '64px', paddingBottom: '72px' }}>
        
        {/* Top Floating Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#a7f3d0'
          }}>
            <Sparkles size={16} color="#34d399" />
            <span>Cameroon’s Farm-to-Market Exchange</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <span style={{ color: '#fbbf24' }}>Littoral to West Highlands</span>
          </div>
        </div>

        {/* Main Headline */}
        <div style={{ textAlign: 'center', maxWidth: '920px', margin: '0 auto 36px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)', 
            fontWeight: 800, 
            lineHeight: 1.12, 
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            color: '#ffffff'
          }}>
            Cameroon’s harvest, <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #6ee7b7 0%, #38c182 50%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              direct from source to market.
            </span>
          </h1>

          <p style={{ 
            fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', 
            color: '#d1fae5', 
            lineHeight: 1.6, 
            fontWeight: 400,
            maxWidth: '780px',
            margin: '0 auto',
            opacity: 0.92
          }}>
            Discover produce from Cameroon’s family farms and cooperatives, from PGI Penja Pepper and Foumbot vegetables to
            plantain, cocoa, honey, and ginger. Built for buyers in Douala, Yaoundé, Buea, and regional CEMAC trade routes.
          </p>

          {/* Action CTAs */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '16px', 
            marginTop: '36px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={onExploreClick}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px', fontSize: '1.05rem' }}
            >
              <span>Explore Fresh Harvest</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={onPostRFQClick}
              className="btn btn-secondary btn-lg"
              style={{ 
                minWidth: '200px',
                backgroundColor: 'rgba(255,255,255,0.12)', 
                borderColor: 'rgba(255,255,255,0.25)', 
                color: '#ffffff' 
              }}
            >
              <Package size={18} color="#34d399" />
              <span>Wholesale Bulk Pricing</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars of the Agribusiness Exchange */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '18px', 
          marginTop: '48px' 
        }}>
          
          <div style={{ 
            backgroundColor: 'rgba(15, 70, 44, 0.45)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#34d399" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>11 Hours Avg</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ecfdf5' }}>Farm-Gate to Douala Hub</h3>
            <p style={{ fontSize: '0.84rem', color: '#a7f3d0', opacity: 0.85, margin: 0 }}>
              Harvested at dawn, graded locally, and prepared for verified cold-chain dispatch.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(15, 70, 44, 0.45)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Percent size={20} color="#fbbf24" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>88.6% Direct</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ecfdf5' }}>Farmer Direct Revenue</h3>
            <p style={{ fontSize: '0.84rem', color: '#a7f3d0', opacity: 0.85, margin: 0 }}>
              Clear pricing and direct supplier terms for Cameroon’s growers and buyers.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(15, 70, 44, 0.45)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThermometerSnowflake size={20} color="#38bdf8" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>2°C - 4°C Monitored</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ecfdf5' }}>Unbroken Cold-Chain</h3>
            <p style={{ fontSize: '0.84rem', color: '#a7f3d0', opacity: 0.85, margin: 0 }}>
              Track verified dispatch information when a connected hub record is available.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(15, 70, 44, 0.45)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#c084fc" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>100% Certified</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ecfdf5' }}>Living Soil & Organic</h3>
            <p style={{ fontSize: '0.84rem', color: '#a7f3d0', opacity: 0.85, margin: 0 }}>
              See each supplier’s actual certifications, practices, and privacy settings.
            </p>
          </div>

        </div>

        {/* Quick Category Chips */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '10px', 
          marginTop: '36px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 600, textTransform: 'uppercase' }}>Quick Browse:</span>
          
          <button 
            onClick={() => onCategorySelect('vegetables')}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              color: '#ffffff', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer'
            }}
          >
            🥦 Fresh Heirloom Veggies
          </button>

          <button 
            onClick={() => onCategorySelect('fruits')}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              color: '#ffffff', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer'
            }}
          >
            🍓 Sweet Orchard Berries
          </button>

          <button 
            onClick={() => onCategorySelect('grains')}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              color: '#ffffff', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer'
            }}
          >
            🌾 Heritage Grains & Pulses
          </button>

          <button 
            onClick={() => onCategorySelect('dairy_honey')}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              color: '#ffffff', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer'
            }}
          >
            🍯 Forest Honey & Dairy
          </button>

          <button 
            onClick={() => onCategorySelect('bundles')}
            style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.2)', 
              color: '#fef3c7', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📦 Seasonal CSA Bounty Boxes
          </button>
        </div>

      </div>
    </div>
  );
};
