import React from 'react';
import { 
  Sprout, 
  Heart, 
  Droplet, 
  Sun, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ImpactViewProps {
  onExploreFarms: () => void;
  onExploreMarket: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({
  onExploreFarms,
  onExploreMarket,
}) => {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
          <span className="badge badge-organic" style={{ marginBottom: '12px' }}>
            <Sprout size={13} />
            Ecological & Community Stewardship
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Cultivating Living Soil, Not Just Crops
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Every purchase through AgriFlow sends vital capital directly into living mycorrhizal soils, riparian restoration, and family farm livelihoods. Here is what we have collectively grown together:
          </p>
        </div>

        {/* 4 Big Impact Metrics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px',
          marginBottom: '56px'
        }}>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Layers size={22} color="var(--primary-800)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-950)', fontFamily: 'var(--font-heading)' }}>
              4,280 ha
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-main)' }}>
              Living Soil Under Regeneration
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Cover-cropped, no-till acreage sequestering carbon and cultivating deep microbial networks.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Droplet size={22} color="#0284c7" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-950)', fontFamily: 'var(--font-heading)' }}>
              14.8M L
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-main)' }}>
              Water Saved via Micro-Drip
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Precision soil moisture monitoring reducing agricultural runoff and protecting snowmelt aquifers.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sun size={22} color="var(--primary-600)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-heading)' }}>
              1,420 Tons
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-main)' }}>
              Carbon Sequestered
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Atmospheric carbon drawn down into permanent prairie roots and biodynamic compost.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Heart size={22} color="var(--amber-600)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-950)', fontFamily: 'var(--font-heading)' }}>
              $1.42M+
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-main)' }}>
              Direct Farmer Revenue
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Net earnings directly deposited to rural farming families with zero broker deductions.
            </p>
          </div>

        </div>

        {/* The Economic Comparison Breakdown */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: '40px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '56px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Radical Transparency</span>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--primary-950)' }}>
              Where Your Produce Dollar Goes: Comparison
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Industrial grocery pipelines hide dozens of broker markups. We engineered an unbroken direct rail:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            {/* Traditional Grocery Box */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Conventional Supermarket Chain
                </h4>
                <span className="badge badge-farm">Old Broker Model</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#b91c1c', fontWeight: 700 }}>Farmer Share:</span>
                    <strong style={{ color: '#b91c1c' }}>14.3¢ (14.3%)</strong>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '14.3%', height: '100%', backgroundColor: '#ef4444' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Brokers, Wholesalers & Aggregators:</span>
                    <strong>38.2¢ (38.2%)</strong>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '38.2%', height: '100%', backgroundColor: '#94a3b8' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Retail Supermarket Margin & Spoilage:</span>
                    <strong>47.5¢ (47.5%)</strong>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '47.5%', height: '100%', backgroundColor: '#64748b' }} />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '20px', lineHeight: 1.4 }}>
                ⚠️ Harvest sits in warehousing for 10–21 days. High loss rates and minimal returns to the growers.
              </p>
            </div>

            {/* AgriFlow Direct Model */}
            <div style={{ backgroundColor: 'var(--primary-900)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--primary-700)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  AgriFlow Direct Farm-to-Market
                </h4>
                <span className="badge badge-organic" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>Direct Rail</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#34d399', fontWeight: 800 }}>🌱 Direct to Farmer Payout:</span>
                    <strong style={{ color: '#34d399', fontSize: '1rem' }}>88.6¢ (88.6%)</strong>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '88.6%', height: '100%', backgroundColor: '#34d399' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#93c5fd' }}>❄️ Cold-Chain Linehaul & Pre-Cooling:</span>
                    <strong>6.4¢ (6.4%)</strong>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '6.4%', height: '100%', backgroundColor: '#60a5fa' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#fde047' }}>🛡️ Escrow Insurance & Platform Clearing:</span>
                    <strong>5.0¢ (5.0%)</strong>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '5.0%', height: '100%', backgroundColor: '#fbbf24' }} />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#d1fae5', marginTop: '20px', lineHeight: 1.4 }}>
                ✨ Freshness delivered within 14–24 hours of cutting. Guaranteed transparent bank settlement.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Support Regenerative Agriculture?
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={onExploreMarket} className="btn btn-primary btn-lg">
              <span>Shop Today's Harvest</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={onExploreFarms} className="btn btn-secondary btn-lg">
              <span>Meet The Farmers</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
