import React from 'react';
import type { Farm, Product } from '../types';
import { 
  Sprout, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  X
} from 'lucide-react';

interface FarmStoriesProps {
  farms: Farm[];
  products: Product[];
  selectedFarmId: string | null;
  setSelectedFarmId: (farmId: string | null) => void;
  onSelectProduct: (product: Product) => void;
  onFilterByFarm: (farmName: string) => void;
}

export const FarmStories: React.FC<FarmStoriesProps> = ({
  farms,
  products,
  selectedFarmId,
  setSelectedFarmId,
  onSelectProduct,
  onFilterByFarm,
}) => {
  const activeModalFarm = farms.find(f => f.id === selectedFarmId);
  const activeFarmProducts = activeModalFarm 
    ? products.filter(p => p.farmId === activeModalFarm.id)
    : [];

  return (
    <section style={{ padding: '60px 0 80px', backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span className="badge badge-organic" style={{ marginBottom: '12px' }}>
            <Sprout size={13} />
            Soil Provenance & Traceability
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Meet the Stewards of the Soil
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Every carrot, strawberry, and bushel of grain comes from an audited, independently operated family farm committed to living soils, clean water, and zero synthetic shortcuts.
          </p>
        </div>

        {/* Farm Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {farms.map((farm) => {
            const farmCropCount = products.filter(p => p.farmId === farm.id).length;
            
            return (
              <div 
                key={farm.id}
                className="card-hover"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  backgroundColor: '#ffffff',
                  cursor: 'pointer' 
                }}
                onClick={() => setSelectedFarmId(farm.id)}
              >
                {/* Banner & Avatar */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={farm.bannerImage} 
                    alt={farm.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' 
                  }} />

                  {/* Region badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: 'var(--primary-900)' }}>
                      <MapPin size={11} />
                      {farm.region}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '-20px', 
                    left: '20px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #ffffff',
                    boxShadow: 'var(--shadow-md)',
                    backgroundColor: '#ffffff'
                  }}>
                    <img src={farm.avatar} alt={farm.ownerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {farm.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {farm.location}, {farm.state} • {farm.acreage} Acres
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber-600)' }}>
                      <Star size={15} fill="var(--amber-500)" stroke="none" />
                      <span>{farm.rating}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '10px 0 16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {farm.story}
                  </p>

                  {/* Certifications Row */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {farm.certifications.slice(0, 2).map((cert) => (
                      <span key={cert} className="badge badge-organic" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        <ShieldCheck size={10} />
                        {cert}
                      </span>
                    ))}
                    {farm.certifications.length > 2 && (
                      <span className="badge badge-farm" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        +{farm.certifications.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Footer details */}
                  <div style={{ 
                    marginTop: 'auto', 
                    paddingTop: '14px', 
                    borderTop: '1px solid var(--border-color)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <strong>{farmCropCount}</strong> crops in stock
                    </div>

                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Explore Farm Story
                      <ArrowRight size={14} />
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* DEEP FARM DETAIL MODAL */}
        {activeModalFarm && (
          <div className="modal-backdrop" onClick={() => setSelectedFarmId(null)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '880px', padding: 0 }}
            >
              <button
                onClick={() => setSelectedFarmId(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 10,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              {/* Modal Banner */}
              <div style={{ height: '240px', position: 'relative' }}>
                <img 
                  src={activeModalFarm.bannerImage} 
                  alt={activeModalFarm.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,46,29,0.85) 100%)' 
                }} />

                <div style={{ position: 'absolute', bottom: '20px', left: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img 
                    src={activeModalFarm.avatar} 
                    alt={activeModalFarm.ownerName} 
                    style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #ffffff', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
                  />
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {activeModalFarm.name}
                    </h2>
                    <p style={{ color: '#d1fae5', fontSize: '0.88rem', margin: 0 }}>
                      Managed by {activeModalFarm.ownerName} • {activeModalFarm.location}, {activeModalFarm.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '28px 32px' }}>
                
                {/* Stats bar */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '24px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Acreage</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeModalFarm.acreage} Acres</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Direct Payout</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#047857' }}>{activeModalFarm.directPayoutShare}% to Farm</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Harvest Moved</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeModalFarm.totalHarvestSoldKg.toLocaleString()} kg</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Partner Since</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeModalFarm.joinedYear}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>The Farm Heritage Story</h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {activeModalFarm.story}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                  
                  {/* Farming Practices */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Ecological Farming Practices
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeModalFarm.practices.map((practice) => (
                        <div key={practice} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--primary-600)' }}>✔</span>
                          <span>{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Verified Certifications
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {activeModalFarm.certifications.map((cert) => (
                        <span key={cert} className="badge badge-organic" style={{ padding: '6px 12px' }}>
                          <ShieldCheck size={14} />
                          {cert}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Direct Contact: </strong> {activeModalFarm.email} • {activeModalFarm.phone}
                    </div>
                  </div>

                </div>

                {/* Crops available from this farm */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                      Live Harvest Batches From {activeModalFarm.name} ({activeFarmProducts.length})
                    </h4>
                    <button
                      onClick={() => {
                        onFilterByFarm(activeModalFarm.name);
                        setSelectedFarmId(null);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Filter Marketplace by this Farm
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {activeFarmProducts.map((p) => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setSelectedFarmId(null);
                          onSelectProduct(p);
                        }}
                        style={{ 
                          border: '1px solid var(--border-color)', 
                          borderRadius: 'var(--radius-md)', 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-800)' }}>${p.retailPrice.toFixed(2)} <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>/{p.retailUnit}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
