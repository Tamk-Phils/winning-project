import React, { useState } from 'react';
import { 
  ThermometerSnowflake, 
  MapPin, 
  ShieldCheck, 
  Radio, 
  Clock, 
  Search
} from 'lucide-react';
import type { LogisticsHub } from '../types';
import { DataUnavailableState } from './DataUnavailableState';

export const LogisticsNetworkView: React.FC = () => {
  const [zipInput, setZipInput] = useState<string>('97201');
  const [zipResult, setZipResult] = useState<string | null>(null);

  // Hub telemetry must come from a connected logistics table or provider.
  const hubs: LogisticsHub[] = [];

  if (hubs.length === 0) {
    return <DataUnavailableState title="Cold-chain telemetry is not connected" message="No logistics hub records are available. Connect an authorized telemetry source before displaying temperatures, capacity, or fleet activity." />;
  }

  /* const hubs: LogisticsHub[] = [
    {
      id: 'hub-1',
      name: 'Cascadia Regional Agro-Cold Hub',
      region: 'Pacific Northwest',
      location: 'Hood River Valley, Oregon',
      capacityTons: 120,
      activeColdRooms: 6,
      targetTempRange: '1.5°C – 3.5°C',
      currentTemp: 2.8,
      humidity: 92,
      status: 'optimal',
      fleetVehiclesActive: 18,
      coordinates: { lat: 45.7054, lng: -121.5215 }
    },
    {
      id: 'hub-2',
      name: 'Central Valley Chilled Aggregation Facility',
      region: 'California Coast & Valley',
      location: 'Salinas Logistics Center, California',
      capacityTons: 240,
      activeColdRooms: 10,
      targetTempRange: '2.0°C – 4.0°C',
      currentTemp: 3.1,
      humidity: 90,
      status: 'high_volume',
      fleetVehiclesActive: 32,
      coordinates: { lat: 36.6777, lng: -121.6555 }
    },
    {
      id: 'hub-3',
      name: 'Red River Prairie Grain & Bulk Depot',
      region: 'Midwest Prairies',
      location: 'Grand Forks, North Dakota',
      capacityTons: 650,
      activeColdRooms: 4,
      targetTempRange: 'Ambient Ventilated Silo',
      currentTemp: 14.2,
      humidity: 58,
      status: 'optimal',
      fleetVehiclesActive: 14,
      coordinates: { lat: 47.9253, lng: -97.0329 }
    },
    {
      id: 'hub-4',
      name: 'Blue Ridge Sunbelt Agro-Locker Hub',
      region: 'Sunbelt & Mid-Atlantic',
      location: 'Charlottesville, Virginia',
      capacityTons: 85,
      activeColdRooms: 5,
      targetTempRange: '2.0°C – 4.0°C',
      currentTemp: 3.4,
      humidity: 89,
      status: 'dispatching',
      fleetVehiclesActive: 12,
      coordinates: { lat: 38.0293, lng: -78.4767 }
    }
  ]; */

  const handleCheckCoverage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput.trim()) return;

    if (zipInput.startsWith('9') || zipInput.startsWith('8') || zipInput.startsWith('2') || zipInput.startsWith('5')) {
      setZipResult(`✅ ZIP ${zipInput}: Active Cold-Chain Coverage! Daily morning delivery available directly from regional Hub.`);
    } else {
      setZipResult(`✅ ZIP ${zipInput}: Regional 24hr express refrigerated courier active via AgriFlow Cold Carrier.`);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
          <span className="badge badge-fresh" style={{ marginBottom: '12px' }}>
            <ThermometerSnowflake size={13} />
            Unbroken Agrilogistics Infrastructure
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            The Farm-to-Door Cold-Chain
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Freshness is a race against time and temperature. Our regional pre-cooling hubs and IoT-monitored refrigerated fleets ensure produce stays in peak harvest condition from the farm gate to your prep counter.
          </p>
        </div>

        {/* Live IoT Fleet Metrics Bar */}
        <div style={{ 
          backgroundColor: 'var(--primary-950)', 
          color: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          padding: '24px 32px',
          marginBottom: '40px',
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Radio size={14} color="#34d399" />
              <span>Live Cold Fleet</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              76 Vehicles En-Route
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>100% active GPS & temperature telematics</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <ThermometerSnowflake size={14} color="#38bdf8" />
              <span>Fleet Avg Temperature</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              3.1°C Steady
            </div>
            <div style={{ fontSize: '0.75rem', color: '#bae6fd' }}>Threshold: 1.5°C to 4.5°C</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <Clock size={14} color="#fbbf24" />
              <span>Avg Transit Time</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              11.4 Hours
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fef3c7' }}>From dawn harvest to door arrival</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <ShieldCheck size={14} color="#34d399" />
              <span>Compliance</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              99.98%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>HACCP & FSMA Audited Safe</div>
          </div>
        </div>

        {/* 4 Regional Hubs Cards Grid */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-950)' }}>
          Active Regional Cold-Chain Hubs
        </h2>

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
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-fresh" style={{ fontSize: '0.72rem' }}>
                  <MapPin size={11} />
                  {hub.region}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="live-dot" style={{ width: '8px', height: '8px' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
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
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Ambient Temp</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>{hub.currentTemp}°C</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Target: {hub.targetTempRange}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Humidity</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-800)' }}>{hub.humidity}%</div>
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
                Farmers harvest between 4:30 AM and 8:00 AM while ambient heat is low. Produce is field-graded and packed into reusable biodegradable crates.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                2
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Rapid Hydro-Chill Tunnel</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Within 45 minutes of field cutting, produce enters solar-powered cold hubs where spring water and forced air drop core temperatures to 2°C–4°C.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                3
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>IoT Monitored Linehaul</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Electric and clean-diesel refrigerated vans continuously transmit temperature and humidity data every 60 seconds to our logistics cloud.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                4
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Doorstep & Kitchen Delivery</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Delivered before morning kitchen service for restaurants, or in insulated thermal returnable totes for households. Zero plastic waste.
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
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            Check Daily Chilled Dispatch in Your Area
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#a7f3d0', marginBottom: '20px' }}>
            Enter your ZIP or Postal Code to verify daily cold-chain delivery schedules from our nearest agricultural hub:
          </p>

          <form onSubmit={handleCheckCoverage} style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto 16px' }}>
            <input 
              type="text" 
              placeholder="e.g. 97201 or 93901"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="form-input"
              style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: 600 }}
            />
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--primary-500)' }}>
              <Search size={16} />
              <span>Verify</span>
            </button>
          </form>

          {zipResult && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#ffffff' }}>
              {zipResult}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
