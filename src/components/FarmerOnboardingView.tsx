import React, { useState } from 'react';
import type { Farm } from '../types';
import { 
  Tractor, 
  Sprout, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  ThermometerSnowflake, 
  Building
} from 'lucide-react';

interface FarmerOnboardingViewProps {
  onRegisterFarm: (newFarm: Farm) => void;
  onGoToFarmerPortal: () => void;
}

export const FarmerOnboardingView: React.FC<FarmerOnboardingViewProps> = ({
  onRegisterFarm,
  onGoToFarmerPortal,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdFarm, setCreatedFarm] = useState<Farm | null>(null);

  // Form State
  const [farmName, setFarmName] = useState<string>('Whispering Pine Regenerative Farm');
  const [ownerName, setOwnerName] = useState<string>('Hannah & David Miller');
  const [email, setEmail] = useState<string>('hannah@whisperingpinefarm.org');
  const [phone, setPhone] = useState<string>('+1 (509) 555-0133');
  const [location, setLocation] = useState<string>('Yakima River Valley');
  const [state, setState] = useState<string>('Washington');
  const [region, setRegion] = useState<Farm['region']>('Littoral & Coastal');
  const [acreage, setAcreage] = useState<number>(65);
  const [tagline, setTagline] = useState<string>('Certified organic heritage stone fruit, sweet cherries, and lavender');
  const [story, setStory] = useState<string>('Founded on glacial alluvial soils, we utilize zero synthetic nitrogen and rely on multi-species cover crops to nourish our heritage apricot, peach, and heirloom apple orchards.');
  
  // Practices
  const [practices, setPractices] = useState<string[]>([
    'No-Till Soil Management',
    'Cover Cropping',
    'Drip Precision Irrigation',
    'Zero Synthetic Fertilizers'
  ]);

  // Certifications
  const [certifications, setCertifications] = useState<string[]>([
    'USDA Organic',
    'Regenerative Organic Certified'
  ]);

  const [hasColdStorage, setHasColdStorage] = useState<boolean>(true);

  const togglePractice = (practice: string) => {
    if (practices.includes(practice)) {
      setPractices(practices.filter(p => p !== practice));
    } else {
      setPractices([...practices, practice]);
    }
  };

  const toggleCert = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter(c => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: farmName,
      tagline,
      location,
      state,
      coordinates: { lat: 46.6021, lng: -120.5059 },
      region,
      ownerName,
      story,
      avatar: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=300&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      certifications,
      practices,
      acreage: Number(acreage),
      rating: 5.0,
      reviewCount: 1,
      totalHarvestSoldKg: 0,
      joinedYear: 2026,
      directPayoutShare: 89,
      phone,
      email,
    };

    onRegisterFarm(newFarm);
    setCreatedFarm(newFarm);
    setIsSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', padding: '50px 0 90px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
          <span className="badge badge-organic" style={{ marginBottom: '12px' }}>
            <Tractor size={13} />
            Producer Network Expansion
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--primary-950)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Sell Directly from Farm to Market
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Join 450+ verified independent farms. Keep <strong>88.6%+ of every dollar</strong>, eliminate intermediate brokers, and access our pre-cooling hub logistics network.
          </p>
        </div>

        {/* 3 Core Producer Benefits */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '20px', 
          marginBottom: '48px' 
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <DollarSign size={22} color="var(--primary-600)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
              88.6% Direct Payout
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Set your own prices. Conventional distributors pay farmers 14¢ on the dollar; AgriFlow settles 88.6% directly into your farm account.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ThermometerSnowflake size={22} color="#0284c7" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
              Farm-Gate Cold Transport
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Our refrigerated trucks pick up directly from your farm packhouse or transfer to our nearest regional pre-cooling hub.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Building size={22} color="var(--amber-600)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
              Wholesale & Retail Buyers
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Your morning harvest is immediately listed to executive chefs, regional grocery co-ops, and thousands of households.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--border-color)', 
          padding: '40px',
          maxWidth: '820px', 
          margin: '0 auto',
          boxShadow: 'var(--shadow-md)'
        }}>

          {isSubmitted && createdFarm ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-100)', 
                color: 'var(--primary-700)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 16px rgba(34, 160, 102, 0.25)' 
              }}>
                <CheckCircle2 size={42} />
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '8px' }}>
                Welcome to AgriFlow, {createdFarm.name}!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                Your farm profile and regenerative credentials have been registered into the marketplace clearinghouse. You can now immediately list your morning harvest batches!
              </p>

              <div style={{ 
                backgroundColor: 'var(--bg-subtle)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '20px', 
                maxWidth: '480px', 
                margin: '0 auto 32px',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Farm Sourcing ID:</span>
                  <strong>#{createdFarm.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Regional Hub:</span>
                  <strong>{createdFarm.region} Agro-Cold Hub</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Agreed Producer Share:</span>
                  <strong style={{ color: '#047857' }}>{createdFarm.directPayoutShare}% Direct Settlement</strong>
                </div>
              </div>

              <button
                onClick={onGoToFarmerPortal}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '240px' }}
              >
                <Tractor size={18} />
                <span>Open Your Farmer Command Center</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Stepper Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
                {[
                  { num: 1, label: 'Farm Basics' },
                  { num: 2, label: 'Soil Practices' },
                  { num: 3, label: 'Cold Storage' }
                ].map((s) => (
                  <div 
                    key={s.num} 
                    onClick={() => setCurrentStep(s.num)}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '6px', 
                      cursor: 'pointer',
                      flex: 1 
                    }}
                  >
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: currentStep >= s.num ? 'var(--primary-700)' : 'var(--bg-subtle)',
                      color: currentStep >= s.num ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: `2px solid ${currentStep >= s.num ? 'var(--primary-700)' : 'var(--border-color)'}`
                    }}>
                      {s.num}
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: currentStep === s.num ? 700 : 500, color: currentStep === s.num ? 'var(--primary-900)' : 'var(--text-muted)' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* STEP 1: FARM BASICS */}
                {currentStep === 1 && (
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Step 1: Farm Identity & Location</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Tell us about your agricultural property and grower ownership.
                    </p>

                    <div className="responsive-two-col" style={{ marginBottom: '16px' }}>
                      <div>
                        <label className="form-label">Farm / Ranch Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={farmName} 
                          onChange={(e) => setFarmName(e.target.value)} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">Principal Grower / Family Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={ownerName} 
                          onChange={(e) => setOwnerName(e.target.value)} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">Grower Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">Contact Phone *</label>
                        <input 
                          type="tel" 
                          required 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">County / Valley Location *</label>
                        <input 
                          type="text" 
                          required 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">State / Province *</label>
                        <input 
                          type="text" 
                          required 
                          value={state} 
                          onChange={(e) => setState(e.target.value)} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">Agri-Hub Operating Region *</label>
                        <select 
                          value={region} 
                          onChange={(e) => setRegion(e.target.value as any)} 
                          className="form-input"
                        >
                          <option value="Littoral & Coastal">Littoral & Coastal (Douala / Penja)</option>
                          <option value="Centre & Yaoundé">Centre & Yaoundé</option>
                          <option value="West Highlands (Foumbot/Bafoussam)">West Highlands (Foumbot / Bafoussam)</option>
                          <option value="Southwest & Mt. Cameroon">Southwest & Mt. Cameroon</option>
                          <option value="Northwest & Grassfields">Northwest & Grassfields</option>
                          <option value="North & Adamawa">North & Adamawa</option>
                          <option value="Midwest Prairies">Midwest Prairies</option>
                          <option value="Sunbelt South">Sunbelt South & Blue Ridge</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Total Acreage Under Cultivation</label>
                        <input 
                          type="number" 
                          min="1" 
                          value={acreage} 
                          onChange={(e) => setAcreage(Number(e.target.value))} 
                          className="form-input" 
                        />
                      </div>

                      <div>
                        <label className="form-label">Short Tagline</label>
                        <input 
                          type="text" 
                          value={tagline} 
                          onChange={(e) => setTagline(e.target.value)} 
                          className="form-input" 
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label className="form-label">Farm Heritage Story</label>
                      <textarea 
                        rows={3} 
                        value={story} 
                        onChange={(e) => setStory(e.target.value)} 
                        className="form-input" 
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(2)} 
                        className="btn btn-primary"
                      >
                        <span>Next: Soil Practices</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SOIL PRACTICES */}
                {currentStep === 2 && (
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Step 2: Ecological Practices & Certifications</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Our buyers value transparency into living soils, water stewardship, and chemical-free cultivation.
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                      <label className="form-label">Farming & Soil Stewardship Practices</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        {[
                          'No-Till Soil Management',
                          'Cover Cropping',
                          'Drip Precision Irrigation',
                          'Zero Synthetic Fertilizers',
                          'Biological Integrated Pest Mgmt',
                          'Pollinator Corridors',
                          'Compost Tea Soil Inoculation',
                          'Solar-Powered Operations'
                        ].map((practice) => (
                          <label 
                            key={practice} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '10px', 
                              borderRadius: 'var(--radius-md)', 
                              border: '1px solid var(--border-color)', 
                              backgroundColor: practices.includes(practice) ? 'var(--primary-50)' : '#ffffff',
                              cursor: 'pointer',
                              fontSize: '0.84rem',
                              fontWeight: practices.includes(practice) ? 700 : 500
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={practices.includes(practice)} 
                              onChange={() => togglePractice(practice)} 
                            />
                            <span>{practice}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                      <label className="form-label">Official Agricultural Certifications</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        {[
                          'USDA Organic',
                          'Regenerative Organic Certified',
                          'Demeter Biodynamic',
                          'Non-GMO Project Verified',
                          'GAP Good Agricultural Practices Level 4',
                          'Certified Naturally Grown'
                        ].map((cert) => (
                          <label 
                            key={cert} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              padding: '10px', 
                              borderRadius: 'var(--radius-md)', 
                              border: '1px solid var(--border-color)', 
                              backgroundColor: certifications.includes(cert) ? 'var(--primary-50)' : '#ffffff',
                              cursor: 'pointer',
                              fontSize: '0.84rem',
                              fontWeight: certifications.includes(cert) ? 700 : 500
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={certifications.includes(cert)} 
                              onChange={() => toggleCert(cert)} 
                            />
                            <span>{cert}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(1)} 
                        className="btn btn-secondary"
                      >
                        Back
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(3)} 
                        className="btn btn-primary"
                      >
                        <span>Next: Cold Storage & Payout</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: COLD STORAGE & PAYOUT */}
                {currentStep === 3 && (
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Step 3: Cold-Chain Logistics & Direct Escrow</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Finalize pickup logistics and confirm your 88.6% direct grower revenue share.
                    </p>

                    <div style={{ backgroundColor: 'var(--primary-50)', border: '1.5px solid var(--primary-200)', borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <ShieldCheck size={18} color="var(--primary-700)" />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-900)', margin: 0 }}>
                          Grower Payout Guarantee
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--primary-800)', margin: 0, lineHeight: 1.5 }}>
                        As an AgriFlow producer, you set your own crop prices. Payments are held in secure escrow upon buyer checkout and released immediately upon cold-chain delivery confirmation. Zero hidden broker deductions.
                      </p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={hasColdStorage} 
                          onChange={(e) => setHasColdStorage(e.target.checked)} 
                        />
                        <span><strong>On-Farm Cold Room:</strong> We have an on-site refrigerated cold room / pre-cooling packhouse capable of holding morning harvest at 2°C–4°C prior to hub transport.</span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(2)} 
                        className="btn btn-secondary"
                      >
                        Back
                      </button>

                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        style={{ minWidth: '220px' }}
                      >
                        <Sprout size={18} />
                        <span>Submit & Launch Farm</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
