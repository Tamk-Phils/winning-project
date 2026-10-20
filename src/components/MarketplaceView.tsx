import React, { useState } from 'react';
import type { 
  Product, 
  ProductCategory, 
  Farm 
} from '../types';
import { ProductCard } from './ProductCard';
import { 
  ArrowUpDown, 
  Building2, 
  Calendar, 
  Package 
} from 'lucide-react';

interface MarketplaceViewProps {
  products: Product[];
  farms: Farm[];
  activeCategory: ProductCategory;
  setActiveCategory: (category: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRegion: string;
  onAddToCart: (product: Product, quantity: number, tier: 'retail' | 'wholesale') => void;
  onSelectProduct: (product: Product) => void;
  onSelectFarm: (farmId: string) => void;
  onOpenRFQ: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  farms,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  onAddToCart,
  onSelectProduct,
  onSelectFarm,
  onOpenRFQ,
}) => {
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [regenerativeOnly, setRegenerativeOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest');

  // Categories list
  const categories: { id: ProductCategory; label: string; icon: string; count?: number }[] = [
    { id: 'all', label: 'All Harvest', icon: '🌱' },
    { id: 'vegetables', label: 'Fresh Vegetables', icon: '🥦' },
    { id: 'fruits', label: 'Orchard Fruits', icon: '🍓' },
    { id: 'grains', label: 'Heritage Grains', icon: '🌾' },
    { id: 'dairy_honey', label: 'Honey & Dairy', icon: '🍯' },
    { id: 'herbs', label: 'Living Herbs', icon: '🌿' },
    { id: 'bundles', label: 'CSA Bounty Boxes', icon: '📦' },
  ];

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    // Category match
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }

    // Region match
    if (selectedRegion !== 'all') {
      const farm = farms.find(f => f.id === p.farmId);
      if (farm && farm.region !== selectedRegion) {
        return false;
      }
    }

    // Organic filter
    if (organicOnly && !p.isOrganic) {
      return false;
    }

    // Regenerative filter
    if (regenerativeOnly && !p.isRegenerative) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchVariety = p.variety.toLowerCase().includes(q);
      const matchFarm = p.farmName.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchName && !matchVariety && !matchFarm && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      return a.harvestAgeHours - b.harvestAgeHours;
    }
    if (sortBy === 'price_low') {
      return a.retailPrice - b.retailPrice;
    }
    if (sortBy === 'price_high') {
      return b.retailPrice - a.retailPrice;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div style={{ padding: '48px 0 80px', backgroundColor: 'var(--bg-page)' }}>
      <div className="container">
        
        {/* Marketplace Section Title */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-fresh">
                <Calendar size={12} />
                Fresh Morning Cut
              </span>
              <span className="badge badge-organic">Regenerative Verified</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', margin: 0 }}>
              Direct Harvest Catalog
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>
              Showing {sortedProducts.length} crop batches available for immediate refrigerated dispatch
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onOpenRFQ}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Building2 size={15} color="var(--primary-700)" />
              <span>Wholesale Pallets RFQ</span>
            </button>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '4px 10px' }}>
              <ArrowUpDown size={14} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ 
                  border: 'none', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  color: 'var(--text-main)', 
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                <option value="newest">Sort: Freshest Harvest First</option>
                <option value="price_low">Sort: Price (Low to High)</option>
                <option value="price_high">Sort: Price (High to Low)</option>
                <option value="rating">Sort: Highest Farmer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto', 
          paddingBottom: '12px', 
          marginBottom: '20px',
          scrollbarWidth: 'none'
        }}>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--primary-800)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: `1.5px solid ${isSelected ? 'var(--primary-800)' : 'var(--border-color)'}`,
                  boxShadow: isSelected ? '0 4px 12px rgba(15, 70, 44, 0.2)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{ 
                  fontSize: '0.72rem', 
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-subtle)', 
                  padding: '1px 6px', 
                  borderRadius: '10px',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar (Organic, Regenerative, Active Search query) */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '12px 20px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Practice Filters:
            </span>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={organicOnly} 
                onChange={(e) => setOrganicOnly(e.target.checked)} 
              />
              <span>Certified Organic Only</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={regenerativeOnly} 
                onChange={(e) => setRegenerativeOnly(e.target.checked)} 
              />
              <span>Regenerative Soil Verified Only</span>
            </label>
          </div>

          {searchQuery && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Filtering by: <strong>"{searchQuery}"</strong></span>
              <button 
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--earth-600)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
                onSelectFarm={onSelectFarm}
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: 'var(--radius-xl)', 
            padding: '60px 20px', 
            textAlign: 'center',
            border: '1px solid var(--border-color)' 
          }}>
            <Package size={52} color="var(--border-color)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>No Harvest Matches Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px' }}>
              No produce batches matched your current filter criteria. Try adjusting your search keywords, region selection, or category.
            </p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setOrganicOnly(false);
                setRegenerativeOnly(false);
              }}
              className="btn btn-primary"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
