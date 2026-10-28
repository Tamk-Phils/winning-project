import React, { useState } from 'react';
import type { BulkRFQ } from '../types';
import { 
  X, 
  Building2, 
  Send, 
  CheckCircle2 
} from 'lucide-react';

interface WholesaleRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRFQ: (rfq: BulkRFQ) => void;
}

export const WholesaleRFQModal: React.FC<WholesaleRFQModalProps> = ({
  isOpen,
  onClose,
  onSubmitRFQ,
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState<string>('Bistro Bonne Terre');
  const [contactPerson, setContactPerson] = useState<string>('Chef Antoine Mercier');
  const [email, setEmail] = useState<string>('sourcing@bistrobonneterre.com');
  const [phone, setPhone] = useState<string>('+1 (415) 555-8930');
  const [produceNeeded, setProduceNeeded] = useState<string>('Organic Heirloom Tomatoes & Rainbow Carrots');
  const [category, setCategory] = useState<string>('Fresh Vegetables');
  const [volumeNeeded, setVolumeNeeded] = useState<string>('150 kg weekly');
  const [frequency, setFrequency] = useState<BulkRFQ['frequency']>('Weekly Recurring');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('San Francisco, CA');
  const [targetPriceRange, setTargetPriceRange] = useState<string>('$2.10 - $2.40 / kg');
  const [coldChainRequired, setColdChainRequired] = useState<boolean>(true);
  const [additionalNotes, setAdditionalNotes] = useState<string>('Need early morning delivery before 08:30 AM before restaurant service prep.');
  
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRFQ: BulkRFQ = {
      id: `RFQ-${Date.now().toString().slice(-6)}`,
      companyName,
      contactPerson,
      email,
      phone,
      produceNeeded,
      category,
      volumeNeeded,
      frequency,
      deliveryLocation,
      targetPriceRange,
      coldChainRequired,
      additionalNotes,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };

    onSubmitRFQ(newRFQ);
    setIsSubmitted(true);
  };

  const handleDone = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '100%', padding: '24px 20px' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-100)', 
              color: 'var(--primary-700)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px' 
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
              Wholesale Sourcing RFQ Dispatched
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              Your contract requirement for <strong>{produceNeeded} ({volumeNeeded})</strong> has been routed to verified partner farms in our agricultural co-op network.
            </p>

            <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', maxWidth: '420px', margin: '0 auto 28px', textAlign: 'left', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span className="badge badge-amber">Pending Farm Match</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Response Window:</span>
                <strong>Within 4 Business Hours</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Direct Settlement:</span>
                <strong style={{ color: 'var(--primary-800)' }}>88.6% to producer</strong>
              </div>
            </div>

            <button onClick={handleDone} className="btn btn-primary" style={{ minWidth: '180px' }}>
              Close & Return
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Building2 size={22} color="var(--primary-700)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--primary-950)' }}>
                Commercial Wholesale RFQ
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Direct harvest contracts for restaurants, food distributors, school districts, and independent grocers.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="responsive-two-col" style={{ marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Company / Entity *</label>
                  <input 
                    type="text" 
                    required 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Contact Person *</label>
                  <input 
                    type="text" 
                    required 
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Work Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="form-input"
                  >
                    <option value="Fresh Vegetables">Fresh Vegetables</option>
                    <option value="Orchard Fruits">Orchard Fruits</option>
                    <option value="Heritage Grains">Heritage Grains</option>
                    <option value="Honey & Dairy">Honey & Dairy</option>
                    <option value="Living Herbs">Living Herbs</option>
                    <option value="Specialty Mixed">Specialty Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Produce Types Needed *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Heirloom Tomatoes, Berries, Grain"
                    value={produceNeeded}
                    onChange={(e) => setProduceNeeded(e.target.value)}
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Volume / Tonnage *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 500 kg, 4 pallets"
                    value={volumeNeeded}
                    onChange={(e) => setVolumeNeeded(e.target.value)}
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="responsive-two-col" style={{ marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Frequency / Cadence *</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Weekly Recurring">Weekly Recurring Delivery</option>
                    <option value="Bi-Weekly">Bi-Weekly Scheduled Drops</option>
                    <option value="Monthly Harvest Contract">Monthly Harvest Contract</option>
                    <option value="One-Time Spot Purchase">One-Time Spot Purchase</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Target Price Range</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $2.00 - $2.50 / kg"
                    value={targetPriceRange}
                    onChange={(e) => setTargetPriceRange(e.target.value)}
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Delivery Destination (City, State / ZIP)</label>
                <input 
                  type="text" 
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="form-input" 
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">Logistics & Handling Notes</label>
                <textarea 
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="form-input" 
                  placeholder="Loading dock availability, liftgate required, specific cultivar requests..."
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={coldChainRequired} 
                    onChange={(e) => setColdChainRequired(e.target.checked)} 
                  />
                  <span>Require unbroken refrigerated cold-chain transit (2°C - 4°C with temperature logging)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
                  <Send size={16} />
                  <span>Submit Sourcing RFQ</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
