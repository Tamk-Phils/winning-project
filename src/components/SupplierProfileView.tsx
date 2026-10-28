import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  Calendar, 
  Award, 
  Package, 
  ShoppingCart
} from 'lucide-react';
import type { Farm, Product } from '../types';
import { getStoredFarms, getStoredProducts } from '../lib/agriflowStore';

interface SupplierProfileViewProps {
  farm?: Farm;
  farmId?: string;
  products?: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, tier: 'retail' | 'wholesale') => void;
  onSelectProduct?: (product: Product) => void;
}

export const SupplierProfileView: React.FC<SupplierProfileViewProps> = ({
  farm: propFarm,
  farmId,
  products: propProducts,
  onBack,
  onAddToCart,
  onSelectProduct,
}) => {
  const farm = propFarm || getStoredFarms().find(f => f.id === farmId) || getStoredFarms()[0];
  const allProducts = propProducts && propProducts.length > 0 ? propProducts : getStoredProducts();
  const [selectedTier, setSelectedTier] = useState<'retail' | 'wholesale'>('retail');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const supplierProducts = allProducts.filter(p => p.farmId === farm.id);

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product, 1, selectedTier);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleWhatsAppClick = () => {
    const rawNumber = farm.whatsappNumber || farm.phone;
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${farm.ownerName}, I discovered ${farm.name} on AgriFlow Direct and would like to inquire about your produce.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Top Navigation Bar */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', position: 'sticky', top: 60, zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ArrowLeft size={18} />
            <span>Back to Marketplace</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Supplier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supplier Hero Banner */}
      <div style={{ position: 'relative', height: '280px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
        <img
          src={farm.bannerImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'}
          alt={farm.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 100%)'
        }} />
      </div>

      {/* Main Profile Info Header */}
      <div className="container" style={{ marginTop: '-70px', position: 'relative', zIndex: 10 }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px 32px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img
              src={farm.avatar}
              alt={farm.ownerName}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {farm.name}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  <ShieldCheck size={14} />
                  <span>Verified Producer</span>
                </span>
                {farm.minaderRegNumber && (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 600
                  }}>
                    {farm.minaderRegNumber}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.98rem', fontWeight: 600, color: '#166534', marginTop: '4px', marginBottom: '8px' }}>
                {farm.tagline}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="#15803d" />
                  <strong style={{ color: '#334155' }}>{farm.location}</strong> ({farm.region})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={15} color="#eab308" fill="#eab308" />
                  <strong style={{ color: '#334155' }}>{farm.rating.toFixed(2)}</strong> ({farm.reviewCount} reviews)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={15} />
                  Member since {farm.joinedYear}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Direct Payout */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>{farm.acreage} ha</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Acreage</div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {(farm.totalHarvestSoldKg / 1000).toFixed(0)} Tons
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Harvest Traded</div>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                {farm.directPayoutShare}%
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Direct to Farmer</div>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Story & Practices, Right Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', marginTop: '28px' }}>
          
          {/* Left Column: Farm Story, Contacts, Practices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Story Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                About the Farm & Founder
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {farm.story}
              </p>
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem', color: '#64748b' }}>
                Lead Producer: <strong style={{ color: '#0f172a' }}>{farm.ownerName}</strong>
              </div>
            </div>

            {/* Certifications & Practices */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Certifications & Standards
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {farm.certifications.map((cert) => (
                  <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#1e293b' }}>
                    <Award size={15} color="#15803d" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '18px', marginBottom: '10px' }}>
                Farming Practices
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {farm.practices.map((practice) => (
                  <span
                    key={practice}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    {practice}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Direct Supplier Rails
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <a
                  href={`tel:${farm.phone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', textDecoration: 'none' }}
                >
                  <Phone size={15} color="#15803d" />
                  <span>{farm.phone}</span>
                </a>
                <a
                  href={`mailto:${farm.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', textDecoration: 'none' }}
                >
                  <Mail size={15} color="#15803d" />
                  <span>{farm.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Start WhatsApp Conversation</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Full Produce Catalog Listed by this Supplier */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              backgroundColor: '#ffffff',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Harvest Catalog ({supplierProducts.length} Items Listed)
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0' }}>
                  Fresh batches cut and harvested directly at {farm.name}
                </p>
              </div>

              {/* Tier Toggle */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTier('retail')}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: selectedTier === 'retail' ? '#ffffff' : 'transparent',
                    color: selectedTier === 'retail' ? '#0f172a' : '#64748b',
                    boxShadow: selectedTier === 'retail' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Retail
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTier('wholesale')}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: selectedTier === 'wholesale' ? '#ffffff' : 'transparent',
                    color: selectedTier === 'wholesale' ? '#0f172a' : '#64748b',
                    boxShadow: selectedTier === 'wholesale' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Commercial Wholesale
                </button>
              </div>
            </div>

            {supplierProducts.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '48px 24px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <Package size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No active produce listed</h3>
                <p style={{ fontSize: '0.85rem' }}>This farm is currently preparing its next seasonal harvest cycle.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                {supplierProducts.map((product) => {
                  const price = selectedTier === 'wholesale' 
                    ? (product.wholesalePriceXaf || product.wholesalePrice * 600)
                    : (product.retailPriceXaf || product.retailPrice * 600);
                  const unit = selectedTier === 'wholesale' ? product.wholesaleUnit : product.retailUnit;

                  return (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      {/* Product Image */}
                      <div
                        onClick={() => onSelectProduct?.(product)}
                        style={{ height: '170px', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {product.grade || 'Grade A'}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                          {product.category}
                        </div>
                        <h4
                          onClick={() => onSelectProduct?.(product)}
                          style={{
                            fontSize: '0.96rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            margin: '4px 0 6px',
                            cursor: 'pointer'
                          }}
                        >
                          {product.name}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description}
                        </p>

                        <div style={{ marginTop: 'auto', paddingTop: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div>
                              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                {price.toLocaleString()} FCFA
                              </span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '4px' }}>
                                / {unit}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700 }}>
                              {product.stockQuantity} {product.stockUnit} left
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            style={{
                              width: '100%',
                              backgroundColor: addedProductId === product.id ? '#15803d' : '#0f172a',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            {addedProductId === product.id ? (
                              <>
                                <CheckCircle2 size={16} />
                                <span>Added to Cart!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={15} />
                                <span>Add {selectedTier === 'wholesale' ? 'Wholesale' : 'Retail'} to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
