import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  MessageCircle, 
  Clock, 
  Award, 
  Wrench, 
  CheckCircle2, 
  Shield, 
  Lock
} from 'lucide-react';
import type { ServiceProvider, ServiceOffering, ServiceBooking } from '../types';
import { getStoredServiceProviders, saveServiceBookingToStore } from '../lib/agriflowStore';

interface ServiceProviderProfileViewProps {
  provider?: ServiceProvider;
  providerId?: string;
  onBack: () => void;
  onConfirmBooking?: (booking: ServiceBooking) => void;
}

export const ServiceProviderProfileView: React.FC<ServiceProviderProfileViewProps> = ({
  provider: propProvider,
  providerId,
  onBack,
  onConfirmBooking,
}) => {
  const provider = propProvider || getStoredServiceProviders().find(p => p.id === providerId) || getStoredServiceProviders()[0];
  const [selectedService, setSelectedService] = useState<ServiceOffering>(provider.services[0]);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'full_day'>('morning');
  const [scopeQuantity, setScopeQuantity] = useState<number>(1);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientLocation, setClientLocation] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);

  const subtotal = selectedService ? selectedService.priceXaf * scopeQuantity : 0;
  const escrowFee = Math.round(subtotal * 0.05);
  const total = subtotal + escrowFee;

  const handleWhatsAppClick = () => {
    const rawNumber = provider.whatsappNumber || provider.phone;
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${provider.fullName}, I viewed your profile on AgriFlow and would like to inquire about your ${selectedService?.title || 'services'}.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !clientName || !clientPhone) return;

    const newBooking: ServiceBooking = {
      id: `bk-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.fullName,
      providerTitle: provider.title,
      providerAvatar: provider.avatarUrl,
      providerPhone: provider.phone,
      providerWhatsapp: provider.whatsappNumber,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      serviceUnit: selectedService.unit,
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@farmer.cm`,
      clientFarmLocation: clientLocation || 'Main Plantation Field',
      bookingDate,
      timeSlot,
      scopeQuantity,
      unitPriceXaf: selectedService.priceXaf,
      subtotalXaf: subtotal,
      platformEscrowFeeXaf: escrowFee,
      totalPriceXaf: total,
      specialInstructions: instructions,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    if (onConfirmBooking) {
      onConfirmBooking(newBooking);
    } else {
      saveServiceBookingToStore(newBooking);
    }
    setBookingSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Top Navigation */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', position: 'sticky', top: 60, zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Service Hub</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <MessageCircle size={16} />
            <span>Direct WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Specialist Banner */}
      <div style={{ position: 'relative', height: '260px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
        <img
          src={provider.bannerUrl}
          alt={provider.fullName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 100%)'
        }} />
      </div>

      {/* Main Profile Info Header */}
      <div className="container" style={{ marginTop: '-70px', position: 'relative', zIndex: 10 }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px 32px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img
              src={provider.avatarUrl}
              alt={provider.fullName}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {provider.fullName}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  <ShieldCheck size={14} />
                  <span>Verified Agricultural Specialist</span>
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  color: '#334155',
                  backgroundColor: '#f1f5f9',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {provider.category.replace('_', ' ')}
                </span>
              </div>

              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#166534', marginTop: '4px', marginBottom: '8px' }}>
                {provider.title} {provider.businessName && `• ${provider.businessName}`}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="#15803d" />
                  <strong style={{ color: '#334155' }}>{provider.location}</strong> ({provider.region})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={15} color="#eab308" fill="#eab308" />
                  <strong style={{ color: '#334155' }}>{provider.rating.toFixed(2)}</strong> ({provider.reviewCount} verified reviews)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={15} />
                  {provider.experienceYears} Years in Field
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{provider.completedJobsCount}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Completed Jobs</div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>{provider.responseTimeMinutes} min</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Avg. Response</div>
            </div>

            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                {provider.startingPriceXaf.toLocaleString()} F
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Rates From</div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left Details, Right Booking Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', marginTop: '28px' }}>
          
          {/* Left Column: Bio, Certifications, Equipment, Services List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Bio Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                Specialist Background & Expertise
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {provider.bio}
              </p>
            </div>

            {/* Certifications & Machinery Equipment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#15803d" />
                  <span>Professional Credentials</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {provider.certifications.map((cert) => (
                    <div key={cert} style={{ fontSize: '0.84rem', color: '#334155' }}>
                      • {cert}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={16} color="#15803d" />
                  <span>Field Equipment & Machinery</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {provider.equipmentList.map((eq) => (
                    <div key={eq} style={{ fontSize: '0.84rem', color: '#334155' }}>
                      • {eq}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Rendered Catalog */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Services Rendered by {provider.fullName} ({provider.services.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {provider.services.map((srv) => {
                  const isSelected = selectedService.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #166534' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                            {srv.title}
                          </span>
                          {isSelected && (
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              backgroundColor: '#15803d',
                              color: '#ffffff',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              Selected
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 8px' }}>
                          {srv.description}
                        </p>
                        <div style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', gap: '16px' }}>
                          <span><strong>Duration:</strong> {srv.estimatedDuration}</span>
                          {srv.includesEquipment && (
                            <span style={{ color: '#15803d', fontWeight: 600 }}>Equipment included</span>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                          {srv.priceXaf.toLocaleString()} FCFA
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {srv.unit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Direct Booking Terminal */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              position: 'sticky',
              top: '120px'
            }}>
              
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                Book This Specialist
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 18px' }}>
                Escrow protected payment held safely until field job is validated.
              </p>

              {bookingSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    Booking Confirmed!
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px' }}>
                    {provider.fullName} has been notified and will contact you via WhatsApp / Phone to confirm dispatch timing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingSubmitted(false)}
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Book Another Service
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Selected Service Title */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Selected Service
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      {selectedService.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                      {selectedService.priceXaf.toLocaleString()} FCFA {selectedService.unit}
                    </div>
                  </div>

                  {/* Scope Quantity */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Scope / Volume ({selectedService.unit})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={scopeQuantity}
                      onChange={(e) => setScopeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {/* Date & Time Slot */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.82rem'
                        }}
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="full_day">Full Day</option>
                      </select>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean Nono"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+237 6XX XX XX XX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Farm Location / Access Road
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Foumbot Valley Plot 2"
                      value={clientLocation}
                      onChange={(e) => setClientLocation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="farmer@agriflow.cm"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Special Instructions / Soil State
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Field is moist from rain; start with northern slope..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div style={{ paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '4px' }}>
                      <span>Subtotal ({scopeQuantity}x):</span>
                      <span>{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '8px' }}>
                      <span>Escrow Protection (5%):</span>
                      <span>{escrowFee.toLocaleString()} FCFA</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                      <span>Total:</span>
                      <span>{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '6px',
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
                    <Lock size={15} />
                    <span>Confirm & Hold in Escrow</span>
                  </button>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Shield size={12} color="#15803d" />
                    <span>Funds held securely until service completion is confirmed.</span>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
