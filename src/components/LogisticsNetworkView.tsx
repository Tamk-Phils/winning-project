import React, { useState, useEffect } from 'react';
import { 
  ThermometerSnowflake, 
  MapPin, 
  ShieldCheck, 
  Radio, 
  Clock, 
  Search,
  Truck,
  CheckCircle2,
  Send,
  X
} from 'lucide-react';
import type { LogisticsHub } from '../types';
import { getStoredLogisticsHubs } from '../lib/agriflowStore';

export const LogisticsNetworkView: React.FC = () => {
  const [hubs, setHubs] = useState<LogisticsHub[]>(() => getStoredLogisticsHubs());
  const [locationInput, setLocationInput] = useState<string>('Douala Bonabéri');
  const [locationResult, setLocationResult] = useState<string | null>(null);
  
  // Dispatch booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedHubId, setSelectedHubId] = useState<string>(hubs[0]?.id || '');
  const [pickupLocation, setPickupLocation] = useState<string>('Mbang Agro-Ecological Farms, Mbanga');
  const [deliveryDestination, setDeliveryDestination] = useState<string>('Douala Port Terminal Frigorifique');
  const [cargoType, setCargoType] = useState<string>('Penja White Pepper & Fresh Plantains');
  const [tonnage, setTonnage] = useState<number>(2.5);
  const [targetTemp, setTargetTemp] = useState<string>('13°C - 15°C Chilled Ambient');
  const [dispatchScheduled, setDispatchScheduled] = useState<boolean>(false);

  // Sync with central operational store
  useEffect(() => {
    const handleUpdate = () => {
      setHubs(getStoredLogisticsHubs());
    };
    window.addEventListener('agriflow-data-updated', handleUpdate);
    return () => window.removeEventListener('agriflow-data-updated', handleUpdate);
  }, []);

  const totalFleetUnits = hubs.reduce((acc, h) => acc + (h.fleetVehiclesActive || 0), 0);
  const totalCapacityTons = hubs.reduce((acc, h) => acc + (h.capacityTons || 0), 0);
  const avgTemp = hubs.length > 0 ? (hubs.reduce((acc, h) => acc + h.currentTemp, 0) / hubs.length).toFixed(1) : '2.8';

  const handleCheckCoverage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;

    const loc = locationInput.toLowerCase();
    if (loc.includes('douala') || loc.includes('penja') || loc.includes('mbanga') || loc.includes('littoral')) {
      setLocationResult(`Active Cold-Chain Corridor! Connected to Douala Port Chilled Export Terminal. Daily 06:00 AM refrigerated shuttle active.`);
    } else if (loc.includes('foumbot') || loc.includes('bafoussam') || loc.includes('west') || loc.includes('noun')) {
      setLocationResult(`Active Cold-Chain Corridor! Covered by Foumbot Valley Pre-Cooling Hub. Solar hydro-chilling available within 45 mins of cutting.`);
    } else if (loc.includes('yaounde') || loc.includes('yaoundé') || loc.includes('centre') || loc.includes('nsam')) {
      setLocationResult(`Active Cold-Chain Corridor! Serviced by Yaoundé Nsam Central Cold Storage Depot. Direct hotel & wholesale market linehaul active.`);
    } else if (loc.includes('buea') || loc.includes('limbe') || loc.includes('southwest')) {
      setLocationResult(`Active Cold-Chain Corridor! Covered by Buea Mountain Cold-Chain Transit Locker for volcanic soil harvests.`);
    } else {
      setLocationResult(`Regional Cold-Chain Reachable! 24hr express refrigerated dispatch available from nearest AgriFlow hub.`);
    }
  };

  const handleBookDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchScheduled(true);
    setTimeout(() => {
      setDispatchScheduled(false);
      setIsBookingModalOpen(false);
    }, 2400);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 48px' }}>
          <span className="badge badge-fresh" style={{ marginBottom: '12px' }}>
            <ThermometerSnowflake size={13} />
            Unbroken Agrilogistics Infrastructure
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            The Farm-to-Port Cold-Chain Network
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Freshness is a race against heat and transit delays. Our regional pre-cooling depots and IoT-monitored refrigerated fleets ensure volcanic harvests and organic vegetables stay in peak export condition.
          </p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: 800 }}
            >
              <Truck size={18} />
              <span>Request Cold-Chain Fleet Dispatch</span>
            </button>
          </div>
        </div>

        {/* Live IoT Fleet Metrics Bar */}
        <div style={{ 
          backgroundColor: 'var(--primary-950)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: '28px 32px',
          marginBottom: '44px',
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Radio size={14} color="#34d399" />
              <span>Active Fleet Vehicles</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {totalFleetUnits} Reefer Units
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Live GPS & IoT temperature telemetry</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <ThermometerSnowflake size={14} color="#38bdf8" />
              <span>Network Avg Core Temp</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              {avgTemp}°C Steady
            </div>
            <div style={{ fontSize: '0.75rem', color: '#bae6fd' }}>Target: 1.5°C to 4.5°C refrigerated</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Clock size={14} color="#fbbf24" />
              <span>Daily Cold Capacity</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {totalCapacityTons} Metric Tons
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fef3c7' }}>Across {hubs.length} regional staging depots</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <ShieldCheck size={14} color="#34d399" />
              <span>Cold-Chain Integrity</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              99.94%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Zero temperature break violations</div>
          </div>
        </div>

        {/* 5 Regional Hubs Cards Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
            Operational Cold-Chain Hubs ({hubs.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time telemetry synced with central store
          </span>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
          marginBottom: '56px'
        }}>
          {hubs.map((hub) => (
            <div 
              key={hub.id}
              className="card-hover"
              style={{ 
                backgroundColor: '#ffffff', 
                padding: '24px', 
                borderRadius: 'var(--radius-xl)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-fresh" style={{ fontSize: '0.72rem' }}>
                  <MapPin size={11} />
                  {hub.region}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="live-dot" style={{ width: '8px', height: '8px', backgroundColor: hub.status === 'optimal' ? '#10b981' : '#f59e0b', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: hub.status === 'optimal' ? '#047857' : '#b45309', textTransform: 'uppercase' }}>
                    {hub.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                {hub.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                {hub.location}
              </p>

              {/* Sensor Readings Box */}
              <div style={{ 
                backgroundColor: 'var(--bg-subtle)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '14px',
                marginBottom: '18px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Ambient Temp</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>{hub.currentTemp}°C</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Target: {hub.targetTempRange}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Humidity</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>{hub.humidity}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Vapor-Lock Monitored</div>
                </div>
              </div>

              {/* Hub Capacity Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Daily Cold Storage Capacity:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{hub.capacityTons} Tons</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Active Refrigerated Fleets:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{hub.fleetVehiclesActive} Units Active</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Dedicated Cold Cells:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{hub.activeColdRooms} Chilled Zones</strong>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHubId(hub.id);
                    setIsBookingModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--primary-600)',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-700)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Truck size={14} />
                  <span>Dispatch Reefer from this Hub</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* 4-Step Cold-Chain Journey Diagram */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: '36px 32px', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '56px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <span className="badge badge-organic" style={{ marginBottom: '8px' }}>Step-by-Step Logistics Rail</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-950)' }}>
              How Fresh Produce Moves From Soil to Market
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                1
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Dawn Harvest & Sorting</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Farmers harvest at daybreak while temperatures are cool. Produce is graded and loaded into ventilated crates.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Rapid Hydro-Chill Pre-Cooling</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Within 45 minutes of harvest, produce enters solar-assisted cold depots to drop core temperatures to 2°C–4°C.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>IoT Monitored Linehaul</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Refrigerated trucks transmit live temperature and GPS coordinates every 60 seconds directly to AgriFlow.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                4
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Port Export & Kitchen Delivery</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Delivered straight to hotel chefs, wholesale distributors, or Douala Port reefer containers for European and Gulf export.
              </p>
            </div>

          </div>
        </div>

        {/* Coverage Checker */}
        <div style={{ 
          backgroundColor: 'var(--primary-900)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: '36px',
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            Check Regional Cold-Chain Corridor Coverage
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#a7f3d0', marginBottom: '20px' }}>
            Enter your farm basin or city corridor (e.g. Douala, Foumbot, Buea, Penja, Yaoundé) to check daily refrigerated schedules:
          </p>

          <form onSubmit={handleCheckCoverage} style={{ display: 'flex', gap: '10px', maxWidth: '440px', margin: '0 auto 16px' }}>
            <input 
              type="text" 
              placeholder="e.g. Douala Bonabéri or Foumbot Basin"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="form-input"
              style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: 600 }}
            />
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--primary-500)', whiteSpace: 'nowrap' }}>
              <Search size={16} />
              <span>Verify Route</span>
            </button>
          </form>

          {locationResult && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: '#ffffff', lineHeight: 1.5 }}>
              {locationResult}
            </div>
          )}
        </div>

      </div>

      {/* Booking Fleet Modal */}
      {isBookingModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: 'var(--shadow-2xl)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsBookingModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={22} color="#0284c7" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--primary-950)' }}>
                  Request Reefer Truck Dispatch
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Book temperature-controlled fleet pickup for your harvest
                </p>
              </div>
            </div>

            {dispatchScheduled ? (
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534', marginBottom: '6px' }}>
                  Reefer Dispatch Scheduled!
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: 0 }}>
                  Driver and cold-room bay reserved. The driver will contact the farm manager 2 hours before scheduled dawn arrival.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Select Regional Staging Hub
                  </label>
                  <select
                    value={selectedHubId}
                    onChange={(e) => setSelectedHubId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}
                  >
                    {hubs.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Produce / Cargo Type
                  </label>
                  <input
                    type="text"
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    placeholder="e.g. Penja White Pepper, Plantains, or Roma Tomatoes"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Pickup Location (Farm or Co-op Yard)
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Delivery Destination (Port, Hotel, or Warehouse)
                  </label>
                  <input
                    type="text"
                    value={deliveryDestination}
                    onChange={(e) => setDeliveryDestination(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Cargo Weight (Tons)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="40"
                      value={tonnage}
                      onChange={(e) => setTonnage(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Target Cold Setting
                    </label>
                    <select
                      value={targetTemp}
                      onChange={(e) => setTargetTemp(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    >
                      <option value="1.5°C - 3.5°C Chilled Vegetables">1.5°C - 3.5°C Chilled Vegetables</option>
                      <option value="13°C - 15°C Chilled Ambient">13°C - 15°C Chilled Ambient (Plantains/Papayas)</option>
                      <option value="-18°C Frozen Storage">-18°C Deep Freeze</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    backgroundColor: '#166534',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={16} />
                  <span>Confirm Fleet Reservation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
