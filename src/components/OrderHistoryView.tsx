import React, { useState } from 'react';
import type { Order } from '../types';
import { 
  Download,
  ArrowRight
} from 'lucide-react';

interface OrderHistoryViewProps {
  orders: Order[];
  onExploreMarket: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onExploreMarket,
}) => {
  // Pre-seeded rich sample orders for demonstration if no live orders exist yet
  const demoOrders: Order[] = [
    {
      id: 'AGRI-8942',
      items: [],
      customerName: 'Chef Antoine Mercier (Bistro Bonne Terre)',
      customerEmail: 'sourcing@bistrobonneterre.com',
      customerPhone: '+1 (415) 555-8930',
      buyerType: 'restaurant',
      shippingAddress: '782 Columbus Avenue, North Beach, San Francisco, CA',
      deliverySlot: 'Today 10:00 - 11:30 AM (Morning Chilled)',
      deliveryMethod: 'cold_chain_express',
      tipPercentage: 10,
      subtotal: 184.50,
      deliveryFee: 0,
      tipAmount: 18.45,
      farmerDirectPayout: 163.47,
      platformFee: 21.03,
      total: 202.95,
      status: 'cold_transport',
      timeline: [
        { status: 'confirmed', label: 'Order Confirmed in Farm Escrow', time: 'Today, 05:00 AM', location: 'AgriFlow Escrow Clearinghouse', completed: true },
        { status: 'harvest_assigned', label: 'Dawn Field Harvest & Hydro-Chill', time: 'Today, 06:15 AM', location: 'Sunstone Valley Farm Packhouse', completed: true },
        { status: 'cold_transport', label: 'IoT Chilled Transit (2.9°C Live)', time: 'Today, 08:45 AM', location: 'Pacific Agro-Hub Van #42', completed: true },
        { status: 'delivered', label: 'Commercial Kitchen Delivery Doorstep', time: 'Est. Today 10:45 AM', location: 'Bistro Bonne Terre Loading Dock', completed: false },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'AGRI-7621',
      items: [],
      customerName: 'Elena Rostova',
      customerEmail: 'elena@gmail.com',
      customerPhone: '+1 (503) 555-9122',
      buyerType: 'consumer',
      shippingAddress: '1420 SW River Parkway, Apt 8B, Portland, OR',
      deliverySlot: 'Yesterday 08:00 AM Chilled Tote',
      deliveryMethod: 'cold_chain_express',
      tipPercentage: 5,
      subtotal: 42.00,
      deliveryFee: 0,
      tipAmount: 2.10,
      farmerDirectPayout: 37.21,
      platformFee: 4.79,
      total: 44.10,
      status: 'delivered',
      timeline: [
        { status: 'confirmed', label: 'Order Confirmed in Farm Escrow', time: 'Yesterday, 06:00 AM', location: 'AgriFlow Clearinghouse', completed: true },
        { status: 'harvest_assigned', label: 'Morning Orchard Harvest Packed', time: 'Yesterday, 07:30 AM', location: 'Cascadia Bio-Dynamic Orchards', completed: true },
        { status: 'cold_transport', label: 'Chilled Express Dispatch (3.1°C)', time: 'Yesterday, 09:15 AM', location: 'Cascadia Cold Hub Fleet', completed: true },
        { status: 'delivered', label: 'Delivered in Returnable Thermal Tote', time: 'Yesterday, 11:00 AM', location: '1420 SW River Pkwy, Portland', completed: true },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const allOrders = orders.length > 0 ? [...orders, ...demoOrders] : demoOrders;
  const [selectedOrderId, setSelectedOrderId] = useState<string>(allOrders[0].id);

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

        {/* Master-Detail Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          
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
                      ${ord.total.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                      🌱 ${ord.farmerDirectPayout.toFixed(2)} to farmers
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Telemetry & Route Tracker Details */}
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
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>Pacific Transit Corridor</div>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Speed: 42 mph • Driver: Marcus R.</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>Direct Farmer Revenue</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>${activeOrder.farmerDirectPayout.toFixed(2)}</div>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>88.6% of produce total</div>
              </div>
            </div>

            {/* Step-by-Step Waypoint Timeline */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
                Dispatch & Quality Inspection Checkpoints
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
                {activeOrder.timeline.map((step, idx) => (
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
