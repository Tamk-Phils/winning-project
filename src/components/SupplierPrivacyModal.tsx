import React, { useState } from 'react';
import { X, ShieldCheck, Eye, EyeOff, Lock, Check } from 'lucide-react';
import type { Farm, SupplierPrivacySettings } from '../types';

interface SupplierPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
  onUpdatePrivacy: (farmId: string, settings: SupplierPrivacySettings) => void;
}

export const SupplierPrivacyModal: React.FC<SupplierPrivacyModalProps> = ({
  isOpen,
  onClose,
  farm,
  onUpdatePrivacy,
}) => {
  if (!isOpen || !farm) return null;

  const currentSettings: SupplierPrivacySettings = farm.privacySettings || {
    showPhonePublicly: false,
    showEmailPublicly: true,
    showExactAddress: false,
    allowWhatsAppDirect: true,
    preferredContactMethod: 'whatsapp'
  };

  const [settings, setSettings] = useState<SupplierPrivacySettings>(currentSettings);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrivacy(farm.id, settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 27, 17, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1350,
      padding: '20px'
    }}>
      <div 
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-950)', margin: 0 }}>
                Supplier Field-Level Privacy Shield
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {farm.name}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          Control exactly which contact channels are publicly visible to anonymous visitors versus verified buyers. Hidden fields are securely masked and protected against scraping bots.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Toggle 1: Direct Phone Number */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-950)' }}>
                {settings.showPhonePublicly ? <Eye size={16} color="#d97706" /> : <EyeOff size={16} color="#16a34a" />}
                <span>Direct Phone Number Visibility</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {settings.showPhonePublicly 
                  ? `Publicly displayed (${farm.phone})` 
                  : 'Hidden from unverified public; buyers must request connection'}
              </div>
            </div>

            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input
                type="checkbox"
                checked={settings.showPhonePublicly}
                onChange={(e) => setSettings(prev => ({ ...prev, showPhonePublicly: e.target.checked }))}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.showPhonePublicly ? 'var(--primary-600)' : '#cbd5e1',
                borderRadius: '24px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: settings.showPhonePublicly ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }}></span>
              </span>
            </label>
          </div>

          {/* Toggle 2: Exact Physical Address / GPS */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-950)' }}>
                {settings.showExactAddress ? <Eye size={16} color="#d97706" /> : <Lock size={16} color="#16a34a" />}
                <span>Exact Farm Address & GPS Coordinates</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {settings.showExactAddress 
                  ? 'Precise farm GPS pins visible on public map' 
                  : 'Displays regional municipality only (e.g. Foumbot Valley, West Region)'}
              </div>
            </div>

            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input
                type="checkbox"
                checked={settings.showExactAddress}
                onChange={(e) => setSettings(prev => ({ ...prev, showExactAddress: e.target.checked }))}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.showExactAddress ? 'var(--primary-600)' : '#cbd5e1',
                borderRadius: '24px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: settings.showExactAddress ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }}></span>
              </span>
            </label>
          </div>

          {/* Toggle 3: WhatsApp Click-to-Chat Permission */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-950)' }}>
                Allow Direct WhatsApp Inquiries
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Enables prefilled WhatsApp click-to-chat button for verified buyers.
              </div>
            </div>

            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input
                type="checkbox"
                checked={settings.allowWhatsAppDirect}
                onChange={(e) => setSettings(prev => ({ ...prev, allowWhatsAppDirect: e.target.checked }))}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.allowWhatsAppDirect ? '#16a34a' : '#cbd5e1',
                borderRadius: '24px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: settings.allowWhatsAppDirect ? '22px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }}></span>
              </span>
            </label>
          </div>

          {/* Radio: Preferred Primary Channel */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Preferred Incoming Channel:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { id: 'whatsapp', label: 'WhatsApp Direct' },
                { id: 'live_chat', label: 'AgriFlow In-App Live Chat' },
                { id: 'email', label: 'Cooperative Email' },
                { id: 'platform_rfq', label: 'Formal Platform RFQ' }
              ].map((opt) => (
                <label 
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: settings.preferredContactMethod === opt.id ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                    backgroundColor: settings.preferredContactMethod === opt.id ? 'var(--primary-50)' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <input
                    type="radio"
                    name="preferredChannel"
                    value={opt.id}
                    checked={settings.preferredContactMethod === opt.id}
                    onChange={() => setSettings(prev => ({ ...prev, preferredContactMethod: opt.id as any }))}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              {saved ? <Check size={16} /> : null}
              <span>{saved ? 'Saved!' : 'Save Privacy Settings'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
