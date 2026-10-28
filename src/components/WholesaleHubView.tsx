import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  Building2, 
  Package, 
  ShieldCheck, 
  FileText, 
  Download, 
  Send, 
  Check, 
  Calculator
} from 'lucide-react';
import { DataUnavailableState } from './DataUnavailableState';

interface WholesaleHubViewProps {
  products: Product[];
  onOpenRFQ: () => void;
  onAddToCart: (product: Product, quantity: number, tier: 'retail' | 'wholesale') => void;
}

export const WholesaleHubView: React.FC<WholesaleHubViewProps> = ({
  products,
  onOpenRFQ,
  onAddToCart,
}) => {
  if (products.length === 0) {
    return <DataUnavailableState title="Wholesale pricing is not configured" message="Add live product listings to Supabase before showing commercial pricing or farmer revenue calculations." />;
  }

  const [calcQuantity, setCalcQuantity] = useState<number>(100);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [contractSuccess, setContractSuccess] = useState<boolean>(false);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Volume calculator values with dual XAF / USD support
  const retailXaf = selectedProduct?.retailPriceXaf || Math.round((selectedProduct?.retailPrice || 0) * 600);
  const wholesaleXaf = selectedProduct?.wholesalePriceXaf || Math.round((selectedProduct?.wholesalePrice || 0) * 600);

  const retailTotal = (selectedProduct?.retailPrice || 0) * calcQuantity;
  const retailTotalXaf = retailXaf * calcQuantity;

  const wholesaleRate = selectedProduct?.wholesalePrice || 0;
  const volumeDiscountRate = calcQuantity >= 500 ? wholesaleRate * 0.90 : (calcQuantity >= 200 ? wholesaleRate * 0.95 : wholesaleRate);
  const wholesaleRateXaf = calcQuantity >= 500 ? Math.round(wholesaleXaf * 0.90) : (calcQuantity >= 200 ? Math.round(wholesaleXaf * 0.95) : wholesaleXaf);

  const wholesaleTotal = volumeDiscountRate * calcQuantity;
  const wholesaleTotalXaf = wholesaleRateXaf * calcQuantity;

  const totalSavingsXaf = retailTotalXaf - wholesaleTotalXaf;
  const totalSavings = retailTotal - wholesaleTotal;
  const savingsPercent = Math.round((totalSavingsXaf / (retailTotalXaf || 1)) * 100);
  const farmerEarningsXaf = Math.round(wholesaleTotalXaf * 0.886);
  const farmerEarnings = wholesaleTotal * 0.886;

  const handleOrderWholesaleDirect = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, calcQuantity, 'wholesale');
      setContractSuccess(true);
      setTimeout(() => setContractSuccess(false), 2000);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Hero Banner */}
        <div style={{ 
          backgroundColor: 'var(--primary-950)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: '48px 40px',
          marginBottom: '56px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            width: '45%', 
            backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <span className="badge badge-amber" style={{ marginBottom: '14px' }}>
              <Building2 size={13} />
              Institutional & B2B Commercial Portal
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Commercial Produce Procurement, Direct from Family Farms.
            </h1>
            <p style={{ fontSize: '1rem', color: '#a7f3d0', opacity: 0.9, lineHeight: 1.6, marginBottom: '28px' }}>
              We furnish fine-dining restaurants, independent grocers, school districts, and culinary artisans with palleted farm produce at wholesale gate rates. Guaranteed unbroken cold-chain, audit-ready GAP food safety, and transparent farmer contracts.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={onOpenRFQ} className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>
                <Send size={18} />
                <span>Submit Volume RFQ</span>
              </button>

              <a href="#calculator-section" className="btn btn-secondary btn-lg" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)' }}>
                <Calculator size={18} color="#34d399" />
                <span>Volume Calculator</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Volume & Pallet Pricing Calculator */}
        <div id="calculator-section" style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-color)',
          padding: '36px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '56px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Calculator size={22} color="var(--primary-700)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
              Commercial Bulk Pricing & Pallet Margin Calculator
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Select any crop and your target commercial quantity to preview direct farm-gate discounts and net farmer revenue.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '28px', alignItems: 'center' }}>
            
            {/* Input Controls */}
            <div>
              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">Select Produce Variety</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="form-input"
                  style={{ fontWeight: 600 }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.farmName})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Order Quantity</label>
                  <span style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
                    {calcQuantity} {selectedProduct?.stockUnit || 'kg'}
                  </span>
                </div>

                <input 
                  type="range" 
                  min="25" 
                  max="1000" 
                  step="25"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>25 kg (Min Case)</span>
                  <span>250 kg (Quarter Ton)</span>
                  <span>500 kg (Half Ton)</span>
                  <span>1000 kg (Full Metric Ton)</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Pallets:</span>
                  <strong>{Math.ceil(calcQuantity / 350)} Standard Chep Pallet(s)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Refrigerated Temp Zone:</span>
                  <strong>{selectedProduct?.coldChainTemp || '2°C - 4°C Chilled'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Farm Sourcing Gate:</span>
                  <strong>{selectedProduct?.farmName}</strong>
                </div>
              </div>
            </div>

            {/* Financial Results Display */}
            <div style={{ 
              backgroundColor: 'var(--primary-900)', 
              color: '#ffffff', 
              borderRadius: 'var(--radius-xl)', 
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                  Volume Discount Active
                </span>
                <div style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '6px' }}>
                  Wholesale Commercial Contract Total:
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                  {wholesaleTotalXaf.toLocaleString()} FCFA
                </div>
                <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                  ≈ ${wholesaleTotal.toFixed(2)} USD • Effective: {Math.round(wholesaleTotalXaf / calcQuantity).toLocaleString()} FCFA/kg (${(wholesaleTotal / calcQuantity).toFixed(2)}/kg)
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#d1fae5' }}>Compared to Retail Store:</span>
                  <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>{retailTotalXaf.toLocaleString()} FCFA (${retailTotal.toFixed(2)})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', fontWeight: 700 }}>
                  <span>Your Commercial Savings:</span>
                  <span>Save {totalSavingsXaf.toLocaleString()} FCFA (~${totalSavings.toFixed(2)}, {savingsPercent}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 700, marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>🌱 Direct to Farm Cooperative:</span>
                  <span>{farmerEarningsXaf.toLocaleString()} FCFA (~${farmerEarnings.toFixed(2)}, 88.6%)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleOrderWholesaleDirect}
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: 'var(--primary-500)', fontSize: '0.92rem' }}
                >
                  {contractSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Added to Wholesale Cart!</span>
                    </>
                  ) : (
                    <>
                      <Package size={16} />
                      <span>Order This Wholesale Batch</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onOpenRFQ}
                  className="btn btn-secondary"
                  style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  <span>Custom Quote</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Live Wholesale Stock Table */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-color)', 
          overflow: 'hidden',
          marginBottom: '56px'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Commercial Produce Availability & MOQ Index
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Prices reflect wholesale gate rates for restaurants, caterers, and grocers
              </p>
            </div>

            <button onClick={onOpenRFQ} className="btn btn-primary btn-sm">
              <Send size={14} />
              <span>Request Custom Contract</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '14px 20px' }}>Crop Batch</th>
                  <th style={{ padding: '14px 16px' }}>Sourcing Farm</th>
                  <th style={{ padding: '14px 16px' }}>MOQ</th>
                  <th style={{ padding: '14px 16px' }}>Wholesale Price</th>
                  <th style={{ padding: '14px 16px' }}>Retail Comparison</th>
                  <th style={{ padding: '14px 16px' }}>Cold Chain</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const pct = Math.round(((p.retailPrice - p.wholesalePrice) / p.retailPrice) * 100);
                  return (
                    <tr 
                      key={p.id}
                      style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.imageUrl} alt={p.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.variety}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', color: 'var(--primary-800)', fontWeight: 600 }}>
                        {p.farmName}
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        {p.wholesaleMinOrder} {p.wholesaleUnit.split(' ')[0]}s
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#047857' }}>
                        {(p.wholesalePriceXaf || Math.round(p.wholesalePrice * 600)).toLocaleString()} FCFA <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>(${p.wholesalePrice.toFixed(2)}) /{p.wholesaleUnit}</span>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                          Save {pct}%
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {p.coldChainTemp}
                      </td>

                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => onAddToCart(p, p.wholesaleMinOrder, 'wholesale')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                        >
                          + Add MOQ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit & Compliance Download Shelf */}
        <div style={{ 
          backgroundColor: 'var(--bg-subtle)', 
          borderRadius: 'var(--radius-xl)', 
          padding: 'clamp(18px, 4vw, 32px)', 
          border: '1px solid var(--border-color)',
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', 
          gap: '24px' 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="var(--primary-700)" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>GAP & HACCP Certifications</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Audit-ready documentation for food processors and commercial catering requirements.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => alert('Downloading GAP Level 4 Combined Food Safety Audit Packet (PDF)...')}
              className="btn btn-secondary btn-sm" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} />
              <span>GAP Safety Packet.pdf</span>
              <Download size={13} color="var(--primary-600)" />
            </button>

            <button 
              onClick={() => alert('Downloading USDA Organic & ROC Verification Roster (PDF)...')}
              className="btn btn-secondary btn-sm" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} />
              <span>Organic-Roster.pdf</span>
              <Download size={13} color="var(--primary-600)" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
