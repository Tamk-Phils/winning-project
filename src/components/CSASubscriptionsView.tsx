import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  Package, 
  Sparkles, 
  Check, 
  Clock, 
  Heart, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { DataUnavailableState } from './DataUnavailableState';

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
  if (products.length === 0) {
    return <DataUnavailableState title="CSA plans are not configured" message="CSA subscriptions will appear when live bundle listings and supplier records are available in Supabase." />;
  }

  const [cadence, setCadence] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);

  // Plans data with verified photos
  const plans = [
    {
      id: 'csa-bounty',
      name: "The Seasonal Farmstead Bounty Box",
      tagline: "Our flagship farm-to-table box with that morning's best seasonal harvest",
      servings: "Ideal for 2–4 people (8–9 kg total)",
      price: cadence === 'weekly' ? 39.50 : cadence === 'biweekly' ? 44.00 : 48.00,
      badge: "Most Popular",
      imageUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
      itemsIncluded: [
        "1.5 kg Vine Heirloom Tomatoes",
        "1.2 kg Organic Rainbow Sweet Carrots",
        "2 Punnets Handpicked Albion Strawberries",
        "1 Bunch Tender Guelph Asparagus",
        "300g Forest Shiitake & Oyster Mushrooms",
        "1 Pot Living Genovese Basil",
        "1 head Crisp Butterhead Lettuce"
      ],
      farmerStory: "Curated in partnership with Cascadia Bio-Dynamic Orchards & Sunstone Valley Co-op."
    },
    {
      id: 'csa-chef',
      name: "The Chef's Artisanal Culinary Box",
      tagline: "Prized rare varieties, edible flowers, microgreens & pantry staples",
      servings: "For culinary enthusiasts & boutique restaurants (6 kg)",
      price: cadence === 'weekly' ? 56.00 : cadence === 'biweekly' ? 62.00 : 68.00,
      badge: "Chef's Choice",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      itemsIncluded: [
        "1 Decanter Cold-Pressed Extra Virgin Olive Oil (750ml)",
        "500g Wild Forest Raw Honeycomb Jar",
        "2 Pots Living Microgreen & Herb Sprout Plugs",
        "400g Specialty Shiitake & Lion's Mane Mushrooms",
        "1.5 kg Mixed Heirloom Tomatoes & Sweet Peppers",
        "1 Dozen Pasture-Raised Free-Range Forest Eggs"
      ],
      farmerStory: "Direct collaboration between Cascadia Orchards, Sunstone Greens, & Highland Apiaries."
    },
    {
      id: 'csa-orchard',
      name: "The Orchard Fruit & Raw Berry Crate",
      tagline: "Sun-drenched, high-Brix berries, seasonal tree fruit, and natural sweets",
      servings: "For families & fruit lovers (5 kg)",
      price: cadence === 'weekly' ? 34.00 : cadence === 'biweekly' ? 38.00 : 42.00,
      badge: "Seasonal Sweet",
      imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
      itemsIncluded: [
        "4 Punnets Albion Day-Neutral Sweet Strawberries",
        "1.5 kg Honeycrisp & Gala Heirloom Apples",
        "1 Jar Pure Wildflower Amber Honey (500g)",
        "1.2 kg Mixed Citrus & Seasonal Stone Fruit"
      ],
      farmerStory: "Hand-sorted in Hood River Valley volcanic soils."
    }
  ];

  const handleSubscribe = (plan: typeof plans[0]) => {
    // Find matching bundle product or create on the fly
    const bundleProduct = products.find(p => p.category === 'bundles') || products[0];
    
    // Create custom product instance for this plan
    const customBundle: Product = {
      ...bundleProduct,
      id: `csa-${plan.id}-${Date.now()}`,
      name: `${plan.name} (${cadence.toUpperCase()})`,
      retailPrice: plan.price,
      description: plan.tagline,
      imageUrl: plan.imageUrl,
    };

    onAddToCart(customBundle, 1, 'retail');
    setAddedPlanId(plan.id);
    setTimeout(() => setAddedPlanId(null), 1800);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '12px' }}>
            <Sparkles size={13} />
            Community Supported Agriculture (CSA)
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Direct Farm Bounty Subscriptions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Experience the authentic rhythm of the agricultural season. We pack that morning’s finest harvests into insulated, chilled totes and deliver directly to your kitchen.
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
                padding: '8px 22px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: cadence === 'weekly' ? 'var(--primary-800)' : 'transparent',
                color: cadence === 'weekly' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: cadence === 'weekly' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Weekly Harvest (Save 15%)
            </button>

            <button
              onClick={() => setCadence('biweekly')}
              style={{
                padding: '8px 22px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: cadence === 'biweekly' ? 'var(--primary-800)' : 'transparent',
                color: cadence === 'biweekly' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: cadence === 'biweekly' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Bi-Weekly (Every 2 Weeks)
            </button>

            <button
              onClick={() => setCadence('monthly')}
              style={{
                padding: '8px 22px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: cadence === 'monthly' ? 'var(--primary-800)' : 'transparent',
                color: cadence === 'monthly' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: cadence === 'monthly' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Monthly Reserve
            </button>
          </div>
        </div>

        {/* 3 Subscription Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
          gap: '28px',
          marginBottom: '64px'
        }}>
          {plans.map((plan) => {
            const isFeatured = plan.id === 'csa-bounty';
            const isAdded = addedPlanId === plan.id;

            return (
              <div 
                key={plan.id}
                className="card-hover"
                style={{ 
                  backgroundColor: '#ffffff',
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  border: isFeatured ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                  boxShadow: isFeatured ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                }}
              >
                {/* Image */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img src={plan.imageUrl} alt={plan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                    <span className={isFeatured ? 'badge badge-organic' : 'badge badge-fresh'} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                      <Sparkles size={12} />
                      {plan.badge}
                    </span>
                  </div>

                  <div style={{ 
                    position: 'absolute', 
                    bottom: '10px', 
                    left: '14px', 
                    backgroundColor: 'rgba(10, 46, 29, 0.85)', 
                    color: '#ffffff', 
                    padding: '4px 10px', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(6px)'
                  }}>
                    {plan.servings}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.25 }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-heading)' }}>
                      ${plan.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      / {cadence} box
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#047857', fontWeight: 700, backgroundColor: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                      FREE Chilled Shipping
                    </span>
                  </div>

                  {/* Included Harvest Items */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                      This Week's Curated Harvest:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {plan.itemsIncluded.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <Check size={14} color="#059669" style={{ flexShrink: 0 }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Farmer origin attribution */}
                  <div style={{ marginTop: 'auto', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    🌱 <strong>Origin:</strong> {plan.farmerStory}
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className={`btn ${isFeatured ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                    style={{ width: '100%', fontSize: '0.95rem' }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={18} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <Package size={18} />
                        <span>Subscribe {cadence.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CSA Benefits Banner */}
        <div style={{ 
          backgroundColor: 'var(--primary-900)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: 'clamp(20px, 4vw, 40px)',
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', 
          gap: '28px',
          border: '1px solid var(--primary-700)'
        }}>
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Clock size={22} color="#34d399" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Field-to-Door in 14 Hours
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#a7f3d0', opacity: 0.9, lineHeight: 1.5, margin: 0 }}>
              Produce is packed hours after morning harvest and transported in biodegradable chilled totes, retaining natural enzymes.
            </p>
          </div>

          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <RefreshCw size={22} color="#fbbf24" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Skip or Pause Anytime
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#a7f3d0', opacity: 0.9, lineHeight: 1.5, margin: 0 }}>
              Going out of town? You can pause, skip, or change your delivery address with 24 hours notice with zero penalties.
            </p>
          </div>

          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Heart size={22} color="#38bdf8" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Secures Farmer Crop Capital
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#a7f3d0', opacity: 0.9, lineHeight: 1.5, margin: 0 }}>
              CSA commitments guarantee farmers fair forward contracts, enabling soil regeneration and zero crop wastage.
            </p>
          </div>
        </div>

        {/* Explore Individual Produce CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '14px' }}>
            Prefer to build your own custom basket rather than a subscription?
          </p>
          <button
            onClick={onExploreMarket}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontWeight: 700 }}
          >
            <span>Browse Full A La Carte Farm Market</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
