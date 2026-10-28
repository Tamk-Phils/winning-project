import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  X, 
  Clock, 
  ThermometerSnowflake, 
  Calendar, 
  Building2, 
  Check, 
  ShoppingCart, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, tier: 'retail' | 'wholesale') => void;
  onSelectFarm: (farmId: string) => void;
  onOpenRFQ: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectFarm,
  onOpenRFQ,
}) => {
  if (!product) return null;

  const [selectedTier, setSelectedTier] = useState<'retail' | 'wholesale'>('retail');
  const [qty, setQty] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const handleTierChange = (t: 'retail' | 'wholesale') => {
    setSelectedTier(t);
    setQty(t === 'wholesale' ? product.wholesaleMinOrder : 1);
  };

  const handleAdd = () => {
    onAddToCart(product, qty, selectedTier);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '860px', 
          width: '100%', 
          maxHeight: 'calc(100vh - 64px)', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          padding: 0,
          position: 'relative' 
        }}
      >
        {/* Sticky Header Close Button (always visible while scrolling) */}
        <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none', padding: '12px 14px 0 0', height: 0 }}>
          <button
            onClick={onClose}
            style={{
              pointerEvents: 'auto',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
              border: '1px solid #e2e8f0',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Layout Grid */}
        <div className="product-modal-grid">
          
          {/* Left Column: Image & Batch Passport */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', position: 'relative' }}>
            <div className="product-modal-image-col" style={{ height: '340px', width: '100%', overflow: 'hidden' }}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Farm Passport Card */}
            <div style={{ padding: '20px 16px' }}>
              <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: 'var(--radius-lg)', 
                padding: '16px', 
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img 
                    src={product.farmAvatar} 
                    alt={product.farmName} 
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{product.farmName}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{product.farmLocation}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {product.certifications.map((cert) => (
                    <span key={cert} className="badge badge-organic" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={11} />
                      {cert}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectFarm(product.farmId);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  <span>View Farm Story & Land Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Cold-Chain Specs */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                  <ThermometerSnowflake size={16} color="#0284c7" />
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Cold-Chain Storage: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{product.coldChainTemp}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                  <Clock size={16} color="#059669" />
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Harvested: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{product.harvestDate} ({product.harvestAgeHours}h ago)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                  <Calendar size={16} color="#d97706" />
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Peak Shelf Stability: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{product.shelfLifeDays} days from delivery</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Details, Nutritional, Buying Actions */}
          <div className="product-modal-content-col" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <span className="badge badge-farm">{product.category.toUpperCase()}</span>
              <span className="badge badge-fresh">{product.grade}</span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
              {product.name}
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--primary-700)', fontWeight: 600, marginBottom: '14px' }}>
              Variety: {product.variety}
            </p>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Flavor & Nutrition Highlight Box */}
            <div style={{ 
              backgroundColor: 'var(--bg-subtle)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '16px', 
              marginBottom: '20px',
              border: '1px solid var(--border-color)'
            }}>
              {product.flavorProfile && (
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Flavor Notes: </span>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontStyle: 'italic' }}>{product.flavorProfile}</span>
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Nutritional Highlights:</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {product.nutritionalNotes.map((note) => (
                    <span key={note} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--primary-800)', fontWeight: 600 }}>
                      🌱 {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dual Pricing Selector */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '12px', 
              marginBottom: '20px' 
            }}>
              <div 
                onClick={() => handleTierChange('retail')}
                style={{ 
                  padding: '14px', 
                  borderRadius: 'var(--radius-md)', 
                  border: `2px solid ${selectedTier === 'retail' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                  backgroundColor: selectedTier === 'retail' ? 'var(--primary-50)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Retail Tier</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  {(product.retailPriceXaf || Math.round(product.retailPrice * 600)).toLocaleString()} FCFA
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                  ≈ ${product.retailPrice.toFixed(2)} / {product.retailUnit}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Direct for homes & small prep</div>
              </div>

              <div 
                onClick={() => handleTierChange('wholesale')}
                style={{ 
                  padding: '14px', 
                  borderRadius: 'var(--radius-md)', 
                  border: `2px solid ${selectedTier === 'wholesale' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                  backgroundColor: selectedTier === 'wholesale' ? 'var(--primary-50)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Wholesale Bulk</span>
                  <span className="badge badge-amber" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>Save {Math.round(((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100)}%</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>
                  {(product.wholesalePriceXaf || Math.round(product.wholesalePrice * 600)).toLocaleString()} FCFA
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>
                  ≈ ${product.wholesalePrice.toFixed(2)} / {product.wholesaleUnit}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--amber-600)', fontWeight: 600, marginTop: '4px' }}>Min {product.wholesaleMinOrder} {product.wholesaleUnit.split(' ')[0]}s</div>
              </div>
            </div>

            {/* Quantity and Add to Cart Section */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quantity:</span>
                
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setQty(Math.max(selectedTier === 'wholesale' ? product.wholesaleMinOrder : 1, qty - (selectedTier === 'wholesale' ? 5 : 1)))}
                    style={{ padding: '8px 14px', backgroundColor: 'var(--bg-subtle)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '48px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    {qty}
                  </span>
                  <button 
                    onClick={() => setQty(qty + (selectedTier === 'wholesale' ? 5 : 1))}
                    style={{ padding: '8px 14px', backgroundColor: 'var(--bg-subtle)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {((selectedTier === 'retail' ? (product.retailPriceXaf || product.retailPrice * 600) : (product.wholesalePriceXaf || product.wholesalePrice * 600)) * qty).toLocaleString()} FCFA
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    (${((selectedTier === 'retail' ? product.retailPrice : product.wholesalePrice) * qty).toFixed(2)})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAdd}
                  className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                  style={{ 
                    flex: '1 1 200px',
                    backgroundColor: added ? '#10b981' : undefined,
                    color: added ? '#ffffff' : undefined
                  }}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add to Harvest Order</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenRFQ();
                  }}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: '1 1 140px' }}
                  title="Need tonnage or custom contract?"
                >
                  <Building2 size={18} />
                  <span>Custom RFQ</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
