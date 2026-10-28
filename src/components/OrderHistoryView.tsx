import React, { useState } from 'react';
import type { Order } from '../types';
import { 
  Download,
  ArrowRight,
  Package
} from 'lucide-react';

interface OrderHistoryViewProps {
  orders: Order[];
  onExploreMarket: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onExploreMarket,
}) => {
  const allOrders = orders;
  const [selectedOrderId, setSelectedOrderId] = useState<string>(allOrders[0]?.id || '');

  const activeOrder = allOrders.find(o => o.id === selectedOrderId) || allOrders[0];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <span className="badge badge-fresh" style={{ marginBottom: '12px' }}>
            <RadioIcon />
            IoT Cold-Chain Telemetry Tracker
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Live Harvest Dispatch Tracker
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Track your farm order in real time. Monitor field cutting timestamps, IoT temperature readings during transit, and verified farmer payout escrow.
          </p>
        </div>

        {allOrders.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <Package size={52} color="var(--border-color)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>No Orders Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px' }}>
              You haven't placed any harvest orders yet. Browse the marketplace to find fresh produce from verified farms.
            </p>
            <button onClick={onExploreMarket} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Explore Marketplace</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Master-Detail Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '28px' }}>
          
              {/* Left Column: Order List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)', margin: '0 0 4px' }}>
                  Your Harvest Contracts ({allOrders.length})
                </h3>

                {allOrders.map((ord) => {
                  const isSelected = ord.id === selectedOrderId;
                  const isDelivered = ord.status === 'delivered';

                  return (
                    <div 
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-xl)',
                        padding: '20px',
                        border: `2px solid ${isSelected ? 'var(--primary-600)' : 'var(--border-color)'}`,
                        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--trans-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-950)' }}>
                            #{ord.id}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {ord.customerName}
                          </div>
                        </div>

                        <span className={isDelivered ? 'badge badge-organic' : 'badge badge-fresh'} style={{ fontSize: '0.72rem' }}>
                          {isDelivered ? 'Delivered Fresh' : '⚡ Chilled En-Route'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        {ord.deliverySlot}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-900)' }}>
                          {(ord.currency === 'XAF' ? ord.total : Math.round(ord.total * 600)).toLocaleString()} FCFA
                          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>
                            (${ord.total.toFixed(2)})
                          </span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                          🌱 {Math.round(ord.farmerDirectPayout * 600).toLocaleString()} FCFA to farmers
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Live Telemetry & Route Tracker Details */}
              {activeOrder && (
              <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: 'var(--radius-xl)', 
                border: '1px solid var(--border-color)', 
                padding: '32px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="badge badge-farm" style={{ marginBottom: '6px' }}>Active Contract Details</span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                      Order #{activeOrder.id}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Recipient: {activeOrder.customerName} • {activeOrder.buyerType.toUpperCase()}
                    </p>
                  </div>

                  <button 
                    onClick={() => alert(`Downloading Farm Sourcing Certificate & Audit Invoice for #${activeOrder.id} (PDF)...`)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} />
                    <span>Traceability Certificate.pdf</span>
                  </button>
                </div>

                {/* Live Sensor Gauge Box */}
                <div style={{ 
                  backgroundColor: 'var(--primary-950)', 
                  color: '#ffffff', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '20px 24px', 
                  marginBottom: '28px',
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '16px' 
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>IoT Van Temp Sensor</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>2.9°C Chilled</div>
                    <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Safe Range: 1.5°C to 4.5°C</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>GPS Telematics</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>Littoral - Douala Port Logistics Corridor</div>
                    <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Speed: 45 km/h • Driver: Jean-Baptiste K.</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>Direct Farmer Revenue</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
                      {Math.round(activeOrder.farmerDirectPayout * 600).toLocaleString()} FCFA
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>≈ ${activeOrder.farmerDirectPayout.toFixed(2)} USD • 88.6% of produce total</div>
                  </div>
                </div>

                {/* Step-by-Step Waypoint Timeline */}
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
                    Dispatch & Quality Inspection Checkpoints
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
                    {(activeOrder.timeline || []).map((step: { status: string; label: string; time: string; location: string; completed: boolean }, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '26px', 
                          height: '26px', 
                          borderRadius: '50%', 
                          backgroundColor: step.completed ? 'var(--primary-600)' : 'var(--bg-subtle)', 
                          color: step.completed ? '#ffffff' : 'var(--text-faint)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: '2px',
                          border: `2px solid ${step.completed ? 'var(--primary-600)' : 'var(--border-color)'}`
                        }}>
                          {step.completed ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: step.completed ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {step.time} • <strong>{step.location}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery address & financial summary */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', fontSize: '0.85rem' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Destination: </span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{activeOrder.shippingAddress}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Delivery Slot: </span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{activeOrder.deliverySlot}</span>
                  </div>
                </div>

              </div>
              )}

            </div>

            {/* Explore more produce CTA */}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button
                onClick={onExploreMarket}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontWeight: 700 }}
              >
                <span>Order Next Harvest Batch</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

function RadioIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  );
}
