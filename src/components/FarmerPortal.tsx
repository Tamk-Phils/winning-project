import React, { useState } from 'react';
import type { 
  Product, 
  Farm, 
  ProducerBatchSubmission 
} from '../types';
import { 
  Tractor, 
  PlusCircle, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Check, 
  ThermometerSnowflake, 
  Scale, 
  Trash2
} from 'lucide-react';
import { DataUnavailableState } from './DataUnavailableState';

interface FarmerPortalProps {
  farms: Farm[];
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  farms,
  products,
  onAddProduct,
  onDeleteProduct,
  onSelectProduct,
}) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || 'farm-1');
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentFarm = farms.find(f => f.id === selectedFarmId) || farms[0];

  // New Produce Form State
  const [formData, setFormData] = useState<ProducerBatchSubmission>({
    produceName: '',
    category: 'vegetables',
    variety: '',
    harvestDate: 'Today, 06:00 AM',
    quantity: 250,
    unit: 'kg',
    retailPrice: 4.50,
    wholesalePrice: 2.20,
    wholesaleMinOrder: 20,
    shelfLifeDays: 10,
    coldChainTemp: '2°C - 4°C Chilled Moisture Controlled',
    grade: 'Grade A+ Premium',
    isOrganic: true,
    isRegenerative: true,
    certifications: ['MINADER Certified Organic', 'Penja PGI Geographical Indication', 'Ecological GAP Standard'],
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
  });

  if (!currentFarm) {
    return <DataUnavailableState title="Supplier profile not found" message="Register and save a supplier profile before opening the Farmer Portal. Connect Supabase first so the profile is stored as real application data." />;
  }

  const farmProducts = products.filter(p => p.farmId === currentFarm.id);

  // Preset sample photography for fast listing
  const sampleProduceImages = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80' },
    { label: 'Carrots', url: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80' },
    { label: 'Strawberries', url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bell Peppers', url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80' },
    { label: 'Salad Greens', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
    { label: 'Ancient Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Raw Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
    { label: 'Farm Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mushrooms', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80' },
    { label: 'Asparagus', url: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleSubmitNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.produceName.trim() || !currentFarm) return;

    const calculatedRetailXaf = Math.round(Number(formData.retailPrice) * 600);
    const calculatedWholesaleXaf = Math.round(Number(formData.wholesalePrice) * 600);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.produceName,
      category: formData.category,
      variety: formData.variety || 'Heirloom Heritage Selection',
      farmId: currentFarm.id,
      farmName: currentFarm.name,
      farmLocation: `${currentFarm.location}, ${currentFarm.state}`,
      farmAvatar: currentFarm.avatar,
      description: formData.description || `Freshly harvested from ${currentFarm.name}. Certified sustainable agricultural batch with unbroken cold-chain transport.`,
      imageUrl: formData.imageUrl,
      retailPrice: Number(formData.retailPrice),
      retailPriceXaf: calculatedRetailXaf,
      retailUnit: formData.unit,
      wholesalePrice: Number(formData.wholesalePrice),
      wholesalePriceXaf: calculatedWholesaleXaf,
      wholesaleUnit: `${formData.unit} (Bulk crate)`,
      wholesaleMinOrder: Number(formData.wholesaleMinOrder),
      stockQuantity: Number(formData.quantity),
      stockUnit: formData.unit,
      harvestDate: formData.harvestDate,
      harvestAgeHours: 3,
      shelfLifeDays: Number(formData.shelfLifeDays),
      coldChainTemp: formData.coldChainTemp,
      grade: formData.grade,
      certifications: formData.certifications,
      practices: currentFarm.practices,
      nutritionalNotes: ['Fresh Field Enzymes', 'Vitamin Boost', 'No Post-Harvest Preservatives'],
      flavorProfile: 'Peak farm freshness, rich authentic soil aroma',
      isOrganic: formData.isOrganic,
      isRegenerative: formData.isRegenerative,
      inSeason: true,
      featured: true,
      rating: 5.0,
      reviewsCount: 1,
    };

    onAddProduct(newProduct);
    setIsListingModalOpen(false);
    setSuccessToast(`Harvest Batch "${newProduct.name}" is now live on the marketplace!`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset form
    setFormData({
      produceName: '',
      category: 'vegetables',
      variety: '',
      harvestDate: 'Today, 06:00 AM',
      quantity: 200,
      unit: 'kg',
      retailPrice: 4.00,
      wholesalePrice: 2.00,
      wholesaleMinOrder: 20,
      shelfLifeDays: 8,
      coldChainTemp: '2°C - 4°C Chilled',
      grade: 'Grade A+ Premium',
      isOrganic: true,
      isRegenerative: true,
      certifications: ['USDA Organic'],
      description: '',
      imageUrl: sampleProduceImages[0].url,
    });
  };

  // Calculations
  const totalStockKg = farmProducts.reduce((acc, p) => acc + p.stockQuantity, 0);
  const estimatedBatchValue = farmProducts.reduce((acc, p) => acc + (p.stockQuantity * p.wholesalePrice), 0);

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: 'var(--bg-page)' }}>
      <div className="container">
        
        {/* Toast alert */}
        {successToast && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: 'var(--primary-900)',
            color: '#ffffff',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--primary-500)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <Check size={20} color="#34d399" />
            <span style={{ fontWeight: 600 }}>{successToast}</span>
          </div>
        )}

        {/* Farmer Header & Co-op Switcher */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-organic">
                <Tractor size={13} />
                Producer Command Hub
              </span>
              <span className="badge badge-amber">Direct Farmer Payout: {currentFarm.directPayoutShare}%</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em' }}>
              {currentFarm.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Managed by {currentFarm.ownerName} • {currentFarm.location}, {currentFarm.state} • {currentFarm.acreage} Acres
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Switch Farm Co-op Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Switch Farm:</label>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1.5px solid var(--border-color)', 
                  padding: '8px 14px', 
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: 'var(--primary-900)'
                }}
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.region})
                  </option>
                ))}
              </select>
            </div>

            {/* List New Produce CTA */}
            <button
              onClick={() => setIsListingModalOpen(true)}
              className="btn btn-primary"
              style={{ marginTop: '16px', padding: '12px 22px' }}
            >
              <PlusCircle size={18} />
              <span>List New Harvest Batch</span>
            </button>
          </div>
        </div>

        {/* 4 Financial & Operational Metric Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px', 
          marginBottom: '36px' 
        }}>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: 'var(--radius-xl)', 
            padding: '24px', 
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Estimated Batch Value</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} color="var(--primary-600)" />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-heading)' }}>
              {Math.round(estimatedBatchValue * 600).toLocaleString()} FCFA
            </div>
            <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} />
              <span>≈ ${estimatedBatchValue.toFixed(2)} USD • 88.6% released straight to farm escrow</span>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: 'var(--radius-xl)', 
            padding: '24px', 
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Harvest Inventory</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={20} color="var(--amber-600)" />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {totalStockKg.toLocaleString()} {farmProducts[0]?.stockUnit || 'kg'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Across {farmProducts.length} active listed crops
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: 'var(--radius-xl)', 
            padding: '24px', 
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cold Hub Pickups</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThermometerSnowflake size={20} color="#0284c7" />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              3 Scheduled
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
              Next chilled pickup: Today, 14:30 PM
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: 'var(--radius-xl)', 
            padding: '24px', 
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Farm Quality Rating</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="var(--primary-800)" />
              </div>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-heading)' }}>
              {currentFarm.rating} / 5.0
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {currentFarm.reviewCount} verified chef & buyer reviews
            </div>
          </div>

        </div>

        {/* Payout Transparency Breakdown Callout */}
        <div style={{ 
          backgroundColor: 'var(--primary-900)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: 'clamp(20px, 4vw, 32px)',
          marginBottom: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-organic" style={{ marginBottom: '8px', color: '#064e3b', backgroundColor: '#6ee7b7' }}>
              Empowering Agricultural Producers
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Direct Farm Payout Economics
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#d1fae5', lineHeight: 1.5, margin: 0 }}>
              Industrial grocery pipelines involve 5–7 brokers, cold packagers, and wholesalers who consume 86% of the consumer price. AgriFlow operates as a direct peer-to-peer agrilogistics rail:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: '#34d399' }}>🌾 Direct to You (Farmer Payout):</span>
                <span style={{ fontWeight: 800, color: '#34d399' }}>88.6%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '88.6%', height: '100%', backgroundColor: '#34d399' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: '#93c5fd' }}>❄️ Chilled Cold-Chain Hub & Transit:</span>
                <span style={{ fontWeight: 700, color: '#93c5fd' }}>6.4%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '6.4%', height: '100%', backgroundColor: '#60a5fa' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: '#fde047' }}>🛡️ Escrow Insurance & Quality Assurance:</span>
                <span style={{ fontWeight: 700, color: '#fde047' }}>5.0%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '5.0%', height: '100%', backgroundColor: '#fbbf24' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Produce Batches Table */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Active Field Batches ({farmProducts.length})
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Real-time stock synced directly with buyers and restaurants
              </p>
            </div>

            <button
              onClick={() => setIsListingModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={15} />
              <span>Add Harvest Batch</span>
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '14px 20px' }}>Produce & Variety</th>
                  <th style={{ padding: '14px 16px' }}>Harvest Time</th>
                  <th style={{ padding: '14px 16px' }}>Available Stock</th>
                  <th style={{ padding: '14px 16px' }}>Retail Price</th>
                  <th style={{ padding: '14px 16px' }}>Wholesale Price (MOQ)</th>
                  <th style={{ padding: '14px 16px' }}>Grade</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmProducts.map((prod) => (
                  <tr 
                    key={prod.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.variety}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#059669" />
                        <span>{prod.harvestDate}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#047857' }}>({prod.harvestAgeHours}h ago)</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prod.stockQuantity}</span> {prod.stockUnit}
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary-900)' }}>
                      {(prod.retailPriceXaf || Math.round(prod.retailPrice * 600)).toLocaleString()} FCFA
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        (${prod.retailPrice.toFixed(2)}) / {prod.retailUnit}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', color: '#047857', fontWeight: 700 }}>
                      {(prod.wholesalePriceXaf || Math.round(prod.wholesalePrice * 600)).toLocaleString()} FCFA
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        (${prod.wholesalePrice.toFixed(2)} • {prod.wholesaleMinOrder} min)
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-fresh" style={{ fontSize: '0.72rem' }}>
                        {prod.grade}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          View
                        </button>
                        {onDeleteProduct && (
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            style={{ 
                              color: '#ef4444', 
                              padding: '4px 8px', 
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #fecaca',
                              backgroundColor: '#fef2f2',
                              cursor: 'pointer' 
                            }}
                            title="Remove Batch"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {farmProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      No active crop batches listed yet for this farm. Click "List New Harvest Batch" above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIST NEW HARVEST BATCH MODAL */}
        {isListingModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsListingModalOpen(false)}>
            <div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()} 
              style={{ maxWidth: '780px', padding: 'clamp(20px, 4vw, 32px)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>List New Produce Harvest Batch</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    Listing on behalf of {currentFarm.name}
                  </p>
                </div>
                <button 
                  onClick={() => setIsListingModalOpen(false)}
                  style={{ fontSize: '1.2rem', color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitNewBatch}>
                <div className="responsive-two-col" style={{ marginBottom: '20px' }}>
                  
                  {/* Produce Name */}
                  <div>
                    <label className="form-label">Produce Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Heirloom Brandywine Tomatoes"
                      value={formData.produceName}
                      onChange={(e) => setFormData({ ...formData, produceName: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="form-label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="form-input"
                    >
                      <option value="vegetables">Fresh Vegetables</option>
                      <option value="fruits">Fresh Orchard Fruits</option>
                      <option value="grains">Heritage Grains & Pulses</option>
                      <option value="dairy_honey">Artisan Dairy, Honey & Eggs</option>
                      <option value="herbs">Living Herbs & Microgreens</option>
                      <option value="bundles">Farm CSA Bounty Box</option>
                    </select>
                  </div>

                  {/* Variety */}
                  <div>
                    <label className="form-label">Variety / Cultivar</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cherokee Purple & Gold Nugget"
                      value={formData.variety}
                      onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Harvest Date */}
                  <div>
                    <label className="form-label">Harvest Date & Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Today, 05:30 AM"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Quantity & Unit */}
                  <div>
                    <label className="form-label">Available Harvest Yield</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        className="form-input"
                        style={{ flex: 2 }}
                      />
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="form-input"
                        style={{ flex: 1 }}
                      >
                        <option value="kg">kg</option>
                        <option value="crates">crates</option>
                        <option value="bunches">bunches</option>
                        <option value="punnets">punnets</option>
                        <option value="jars">jars</option>
                        <option value="boxes">boxes</option>
                      </select>
                    </div>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="form-label">Quality Grade</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                      className="form-input"
                    >
                      <option value="Grade A+ Premium">Grade A+ Premium</option>
                      <option value="Grade A">Grade A Standard</option>
                      <option value="Export Quality">Export Quality</option>
                      <option value="Imperfect / Processing Grade">Imperfect / Processing Grade</option>
                    </select>
                  </div>

                  {/* Retail Price */}
                  <div>
                    <label className="form-label">Retail Price ($ / unit) *</label>
                    <input 
                      type="number" 
                      step="0.05"
                      min="0.10"
                      required
                      value={formData.retailPrice}
                      onChange={(e) => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>

                  {/* Wholesale Bulk Price & MOQ */}
                  <div>
                    <label className="form-label">Wholesale Price & MOQ *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        step="0.05"
                        min="0.10"
                        required
                        placeholder="Price $/unit"
                        value={formData.wholesalePrice}
                        onChange={(e) => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                      <input 
                        type="number" 
                        min="1"
                        placeholder="Min MOQ"
                        value={formData.wholesaleMinOrder}
                        onChange={(e) => setFormData({ ...formData, wholesaleMinOrder: Number(e.target.value) })}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Cold Chain Temp */}
                  <div>
                    <label className="form-label">Cold Storage Requirement</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2°C - 4°C Chilled"
                      value={formData.coldChainTemp}
                      onChange={(e) => setFormData({ ...formData, coldChainTemp: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  {/* Shelf life */}
                  <div>
                    <label className="form-label">Shelf Life Stability (Days)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.shelfLifeDays}
                      onChange={(e) => setFormData({ ...formData, shelfLifeDays: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>

                </div>

                {/* Choose Image Preset or Custom URL */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Select Produce Image</label>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
                    {sampleProduceImages.map((img) => (
                      <button
                        type="button"
                        key={img.label}
                        onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                        style={{ 
                          border: formData.imageUrl === img.url ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <img src={img.url} alt={img.label} style={{ width: '64px', height: '54px', objectFit: 'cover' }} />
                        <div style={{ fontSize: '0.68rem', textAlign: 'center', backgroundColor: '#ffffff', padding: '2px' }}>{img.label}</div>
                      </button>
                    ))}
                  </div>

                  <input 
                    type="url" 
                    placeholder="Or enter custom image URL"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label">Field & Harvest Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe soil conditioning, flavor notes, harvest conditions, or storage advice for chefs..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.isOrganic}
                      onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                    />
                    <span>Certified Organic Batch</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.isRegenerative}
                      onChange={(e) => setFormData({ ...formData, isRegenerative: e.target.checked })}
                    />
                    <span>Regenerative Soil Certified</span>
                  </label>
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsListingModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ minWidth: '180px' }}
                  >
                    <PlusCircle size={18} />
                    <span>Publish Harvest Batch</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
