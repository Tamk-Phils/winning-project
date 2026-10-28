import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  Clock, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Info, 
  Check, 
  TrendingDown, 
  Building2, 
  Heart 
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, tier: 'retail' | 'wholesale') => void;
  onSelectProduct: (product: Product) => void;
  onSelectFarm: (farmId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
  onSelectFarm,
}) => {
  const [tier, setTier] = useState<'retail' | 'wholesale'>('retail');
  const [quantity, setQuantity] = useState<number>(tier === 'wholesale' ? product.wholesaleMinOrder : 1);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Switch tier
  const handleTierSwitch = (newTier: 'retail' | 'wholesale') => {
    setTier(newTier);
    if (newTier === 'wholesale') {
      setQuantity(product.wholesaleMinOrder);
    } else {
      setQuantity(1);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const min = tier === 'wholesale' ? product.wholesaleMinOrder : 1;
    const step = tier === 'wholesale' ? 5 : 1;
    const nextVal = Math.max(min, quantity + (delta * step));
    setQuantity(nextVal);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, tier);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1400);
  };

  // Wholesale discount percentage calculation
  const savingsPct = Math.round(
    ((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100
  );

  return (
    <div className="card-hover product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Product Image Area */}
      <div className="product-card-image" style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
          loading="lazy"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onClick={() => onSelectProduct(product)}
        />

        {/* Harvest Freshness Badge */}
        <div style={{ 
          position: 'absolute', 
          top: '12px', 
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span className="badge badge-fresh" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(236, 254, 255, 0.95)' }}>
            <Clock size={12} />
            <span>Harvested {product.harvestAgeHours}h ago</span>
          </span>

          {product.isOrganic && (
            <span className="badge badge-organic" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(209, 250, 229, 0.95)' }}>
              <ShieldCheck size={12} />
              <span>{product.isRegenerative ? 'Regenerative Organic' : 'USDA Organic'}</span>
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease',
            color: isFavorited ? '#ef4444' : 'var(--text-muted)'
          }}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} />
        </button>

        {/* Quality Grade pill */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          letterSpacing: '0.03em'
        }}>
          {product.grade}
        </div>
      </div>

      {/* Card Body */}
      <div className="product-card-body" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Farm Attribution Row */}
        <div 
          onClick={() => onSelectFarm(product.farmId)}
          className="product-card-farm"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '8px',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <img 
            src={product.farmAvatar} 
            alt={product.farmName} 
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.farmName}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>• {product.farmLocation.split(',')[0]}</span>
        </div>

        {/* Product Title & Variety */}
        <h3 
          onClick={() => onSelectProduct(product)}
          className="product-card-title"
          style={{ 
            fontSize: '1.08rem', 
            fontWeight: 700, 
            lineHeight: 1.3, 
            marginBottom: '4px',
            cursor: 'pointer',
            color: 'var(--text-main)',
            transition: 'color var(--trans-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
        >
          {product.name}
        </h3>

        <p className="product-card-variety" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', fontStyle: 'italic' }}>
          Variety: {product.variety}
        </p>

        {/* Tier Switcher (Retail vs Wholesale) */}
        <div className="product-card-tier" style={{
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          backgroundColor: 'var(--bg-subtle)', 
          padding: '3px', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '14px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => handleTierSwitch('retail')}
            style={{
              padding: '6px 8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: tier === 'retail' ? '#ffffff' : 'transparent',
              color: tier === 'retail' ? 'var(--primary-800)' : 'var(--text-muted)',
              boxShadow: tier === 'retail' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Direct Retail
          </button>

          <button
            onClick={() => handleTierSwitch('wholesale')}
            style={{
              padding: '6px 8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: tier === 'wholesale' ? 'var(--primary-900)' : 'transparent',
              color: tier === 'wholesale' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: tier === 'wholesale' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Building2 size={12} />
            <span>Wholesale Bulk</span>
          </button>
        </div>

        {/* Price & Unit Display */}
        <div className="product-card-price" style={{
          display: 'flex', 
          alignItems: 'baseline', 
          justifyContent: 'space-between', 
          marginBottom: '12px' 
        }}>
          <div>
            {tier === 'retail' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-heading)' }}>
                    {(product.retailPriceXaf || Math.round(product.retailPrice * 600)).toLocaleString()} FCFA
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    / {product.retailUnit}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  ≈ ${product.retailPrice.toFixed(2)} USD
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-heading)' }}>
                    {(product.wholesalePriceXaf || Math.round(product.wholesalePrice * 600)).toLocaleString()} FCFA
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    / {product.wholesaleUnit}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  ≈ ${product.wholesalePrice.toFixed(2)} USD • MOQ: {product.wholesaleMinOrder} {product.wholesaleUnit.split(' ')[0]}s
                </div>
              </div>
            )}
          </div>

          {tier === 'wholesale' && (
            <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
              <TrendingDown size={12} />
              Save {savingsPct}%
            </span>
          )}
        </div>

        {/* Harvest Availability Bar */}
        <div className="product-card-availability" style={{ marginBottom: '16px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Available from morning batch:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{product.stockQuantity} {product.stockUnit}</span>
          </div>
          <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(100, Math.max(15, (product.stockQuantity / 800) * 100))}%`, 
              height: '100%', 
              backgroundColor: 'var(--primary-500)', 
              borderRadius: '3px' 
            }} />
          </div>
        </div>

        {/* Quantity Stepper & Add to Cart Action */}
        <div className="product-card-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {/* Stepper */}
          <div className="product-card-stepper" style={{
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--bg-subtle)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            padding: '2px'
          }}>
            <button 
              onClick={() => handleQuantityChange(-1)}
              style={{ width: '28px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span style={{ width: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {quantity}
            </span>
            <button 
              onClick={() => handleQuantityChange(1)}
              style={{ width: '28px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add Button */}
          <button 
            onClick={handleAdd}
            className={`btn product-card-add ${isAddedRecently ? 'btn-secondary' : 'btn-primary'}`}
            style={{ 
              flex: 1, 
              padding: '9px 12px', 
              fontSize: '0.88rem',
              backgroundColor: isAddedRecently ? '#10b981' : undefined,
              color: isAddedRecently ? '#ffffff' : undefined,
              transition: 'all 0.2s ease'
            }}
          >
            {isAddedRecently ? (
              <>
                <Check size={16} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add {tier === 'wholesale' ? 'Bulk' : ''}</span>
              </>
            )}
          </button>

          {/* Inspect Button */}
          <button
            onClick={() => onSelectProduct(product)}
            className="product-card-inspect"
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-color)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)'
            }}
            title="Inspect Harvest Details & Soil Notes"
            aria-label="Inspect Harvest Details"
          >
            <Info size={16} />
          </button>

        </div>

      </div>
    </div>
  );
};
