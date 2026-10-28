import React, { useState, useEffect } from 'react';
import type { Product, CSABoxPlan } from '../types';
import { 
  Sparkles, 
  Check, 
  Clock, 
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { getStoredCSAPlans } from '../lib/agriflowStore';

interface CSASubscriptionsViewProps {
  onAddToCart: (product: Product, quantity: number, tier: 'retail' | 'wholesale') => void;
  onExploreMarket: () => void;
  products: Product[];
}

export const CSASubscriptionsView: React.FC<CSASubscriptionsViewProps> = ({
  onAddToCart,
  onExploreMarket,
  products,
}) => {
  const [plans, setPlans] = useState<CSABoxPlan[]>(() => getStoredCSAPlans());
  const [cadence, setCadence] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);

  // Sync with store updates
  useEffect(() => {
    const handleUpdate = () => {
      setPlans(getStoredCSAPlans());
    };
    window.addEventListener('agriflow-data-updated', handleUpdate);
    return () => window.removeEventListener('agriflow-data-updated', handleUpdate);
  }, []);

  const handleSubscribe = (plan: CSABoxPlan) => {
    const baseProduct = products.find(p => p.category === 'bundles') || products[0];
    
    // Cadence multiplier
    const cadenceMultiplier = cadence === 'weekly' ? 1 : (cadence === 'biweekly' ? 1.1 : 1.25);
    const calculatedPriceXaf = Math.round((plan.pricePerDeliveryXaf || 22000) * cadenceMultiplier);
    const calculatedPriceUsd = Number(((plan.pricePerDelivery || 35) * cadenceMultiplier).toFixed(2));

    const customBundle: Product = {
      ...baseProduct,
      id: `csa-${plan.id}-${Date.now()}`,
      name: `${plan.name} (${cadence.toUpperCase()})`,
      retailPrice: calculatedPriceUsd,
      retailPriceXaf: calculatedPriceXaf,
      retailUnit: 'box/delivery',
      description: `${plan.tagline} • Delivered on ${cadence} schedule with unbroken cold-chain transport.`,
      imageUrl: plan.imageUrl,
    };

    onAddToCart(customBundle, 1, 'retail');
    setAddedPlanId(plan.id);
    setTimeout(() => setAddedPlanId(null), 2000);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '12px' }}>
            <Sparkles size={13} />
            Community Supported Agriculture (CSA)
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Direct Farm Bounty Subscriptions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Experience the authentic rhythm of the agricultural season. We pack that morning’s finest harvests from certified volcanic soil family farms into insulated totes and deliver straight to your doorstep.
          </p>

          {/* Cadence Switcher */}
          <div style={{ 
            display: 'inline-flex', 
            backgroundColor: 'var(--bg-subtle)', 
            padding: '5px', 
            borderRadius: 'var(--radius-full)', 
            border: '1.5px solid var(--border-color)',
            marginTop: '28px'
          }}>
            <button
              onClick={() => setCadence('weekly')}
              style={{
                padding: '8px 24px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: cadence === 'weekly' ? 'var(--primary-700)' : 'transparent',
                color: cadence === 'weekly' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Weekly Harvest
            </button>
            <button
              onClick={() => setCadence('biweekly')}
              style={{
                padding: '8px 24px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: cadence === 'biweekly' ? 'var(--primary-700)' : 'transparent',
                color: cadence === 'biweekly' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Bi-Weekly (Every 2 Weeks)
            </button>
            <button
              onClick={() => setCadence('monthly')}
              style={{
                padding: '8px 24px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: cadence === 'monthly' ? 'var(--primary-700)' : 'transparent',
                color: cadence === 'monthly' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Monthly Reserve
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px',
          marginBottom: '64px'
        }}>
          {plans.map((plan) => {
            const priceXaf = Math.round((plan.pricePerDeliveryXaf || 22000) * (cadence === 'weekly' ? 1 : (cadence === 'biweekly' ? 1.08 : 1.2)));
            const priceUsd = Number(((plan.pricePerDelivery || 36.5) * (cadence === 'weekly' ? 1 : (cadence === 'biweekly' ? 1.08 : 1.2))).toFixed(2));
            const isAdded = addedPlanId === plan.id;

            return (
              <div 
                key={plan.id}
                className="card-hover"
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: 'var(--radius-2xl)', 
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {/* Image Header */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: 'rgba(22, 101, 52, 0.9)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)'
                  }}>
                    {plan.popularityBadge || 'Certified Organic'}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    {plan.servings}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px', lineHeight: 1.25 }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                    {plan.tagline}
                  </p>

                  {/* Pricing Box */}
                  <div style={{ 
                    backgroundColor: 'var(--bg-subtle)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '16px 20px', 
                    marginBottom: '24px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary-950)', fontFamily: 'var(--font-heading)' }}>
                        {priceXaf.toLocaleString()} FCFA
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        / {cadence}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600, marginTop: '2px' }}>
                      ≈ ${priceUsd} USD • Approx. {plan.weightKg} kg fresh harvest
                    </div>
                  </div>

                  {/* Sample Items Included */}
                  <div style={{ marginBottom: '28px', flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', letterSpacing: '0.04em', marginBottom: '12px' }}>
                      What's Inside Each Delivery:
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plan.sampleItems.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                          <Check size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subscribe Action Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: isAdded ? '#15803d' : 'var(--primary-700)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: 'var(--shadow-md)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={18} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={18} />
                        <span>Subscribe & Add to Cart</span>
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pause or cancel anytime before weekly dawn cut
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Banners */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-2xl)', 
          padding: '40px 32px', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
            <span className="badge badge-fresh" style={{ marginBottom: '8px' }}>The CSA Community Promise</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-950)' }}>
              Why Subscribers Love AgriFlow Farm Shares
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="var(--primary-800)" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--primary-950)' }}>Field-Cut to Kitchen</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Never sits in supermarket distribution centers. Harvested at daybreak and delivered chilled the same day.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#0284c7" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--primary-950)' }}>100% Traceable Origin</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Every tote includes a farmer QR card showing the exact cooperative, soil practices, and harvest timestamp.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} color="var(--amber-600)" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--primary-950)' }}>90% Direct Farmer Share</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Eliminating 4 layers of predatory middlemen ensures smallholder growers receive predictable living wages.
              </p>
            </div>
          </div>
        </div>

        {/* Explore Single Harvests CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            type="button"
            onClick={onExploreMarket}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontWeight: 700 }}
          >
            <span>Prefer Individual Produce Items? Browse Full Marketplace</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
